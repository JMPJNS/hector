import { TextChannel, Message, Role } from "discord.js"
import { Service } from "typedi"
import { GuildEntity } from "../entities/guild.entity.js"
import { GuildLevelingRoleEntity } from "../entities/guildLevelingRole.entity.js"
import { UserLevelEntity } from "../entities/userLevel.entity.js"
import { DatabaseService } from "./database.service.js"
import { GuildService } from "./guild.service.js"
import { UserService } from "./user.service.js"

@Service()
export class LevelingService {
  constructor(
    private _db: DatabaseService,
    private _gs: GuildService,
    private _us: UserService,
  ) { }

  public async handleMessage(message: Message<boolean>) {
    // don't track xp for bots
    if (message.author.bot) return
    const guildId = message.guildId
    const userId = message.member?.id

    // return in DM messages
    if (!guildId || !userId) return

    const guild = await this._gs.getByGuildId(guildId)
    const level = await this._us.getUserLevels(userId, guildId)

    const minAge = new Date()
    minAge.setSeconds(minAge.getSeconds() - guild.minimumLevelingDelay)

    // return if the last messages was counted too soon
    level.lastUpdated ??= new Date()
    if (level.lastUpdated > minAge) {
      console.log("not giving xp, too soon")
      return
    }

    const maxPoints = 3
    const minPoints = 1
    const points = (Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints) * guild.levelingMultiplier

    level.points += points

    level.lastUpdated = new Date()
    this._db.manager.save(level)

    await this.handleLevelUp(level, guild, message)
  }

  public async handleLevelUp(level: UserLevelEntity, guild: GuildEntity, message: Message<boolean>) {
    // Grab the first role that has less points required than the user currently has
    const newRoleEntity = guild.levelingRoles?.find(x => level.points > x.pointsRequired)

    // exit the function early if there aren't any roles defined
    if (!newRoleEntity) return

    // set to true if the users current role is different from the one he should have
    const changeRole = newRoleEntity.roleId != level.currentRoleId

    if (changeRole) {
      const newRole = await message.guild?.roles.fetch(newRoleEntity.roleId)
      const currentRole = level.currentRoleId ? await message.guild?.roles.fetch(level.currentRoleId) : null

      if (newRole) {
        // FIXME use a proper logging system that also includes guild/channel and time in the logger and can optionally log to a channel or logfile
        await message.member?.roles.add(newRole).catch(e => console.error(`could not give role ${newRole.id} to user ${message.member?.id}`, e))
      }

      if (currentRole) {
        // FIXME also logger here
        await message.member?.roles.remove(currentRole).catch(e => console.error(`could not remove role ${currentRole.id} from user ${message.member?.id}`, e))
      }

      level.currentRoleId = newRole?.id
      await this._db.manager.save(level)

      if (guild.levelUpMessage) {
        const messageChannelId = guild.botMessageChannelId ?? message.channelId
        // FIXME logger
        const messageChannel = await message.client.channels.fetch(messageChannelId).catch(e => console.error(`could not get ${guild.guildId}s message channel`, e))

        const preparedMessage = guild.levelUpMessage
                                          .replace("[user]", `${message.member}`)
                                          .replace("[points]", `${level.points}`)
                                          .replace("[newRole]", newRole?.name ?? "[]")
                                          .replace("[oldRole]", currentRole?.name ?? "[]")

        await (messageChannel as TextChannel).send(preparedMessage)
      }
    }
  }
}