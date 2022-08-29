import { Message } from "discord.js"
import { Service } from "typedi"
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
    if (level.lastUpdated < minAge) {
      console.log("not giving xp, too soon")
      return
    }

    const maxPoints = 3
    const minPoints = 1
    const points = (Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints) * guild.levelingMultiplier

    level.points += points

    level.lastUpdated = new Date()
    this._db.manager.save(level)
  }
}