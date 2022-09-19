import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  Role,
  User,
} from "discord.js"
import {
  ApplicationCommandOptionType,
} from "discord.js"
import { Discord, Slash, SlashGroup, SlashOption } from "discordx"
import { GuildLevelingRoleEntity } from "../entities/guildLevelingRole.entity.js"
import { DatabaseService } from "../services/database.service.js"
import { GuildService } from "../services/guild.service.js"
import { LevelingService } from "../services/leveling.service.js"
import { UserService } from "../services/user.service.js"

@Discord()
@SlashGroup({ name: "leveling" })
export class LevelingCommands {

  constructor(
    private readonly _db: DatabaseService,
    private readonly _ls: LevelingService,
    private readonly _us: UserService,
    private readonly _gs: GuildService,
  ) { }

  @Slash({ name: "level" })
  @SlashGroup("leveling")
  async level(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User, required: false }) user: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    const guildId = interaction.guild?.id
    if (!guildId) return

    await interaction.deferReply()

    user = user ?? interaction.user
    const level = await this._us.getUserLevels(user.id, guildId)

    const embed = new EmbedBuilder()
      .setThumbnail(user.avatarURL())
      .addFields({ name: "xp", value: level.points.toString() })

    interaction.editReply({ embeds: [embed] })
  }

  @Slash({ name: "add-leveling-role" })
  @SlashGroup("leveling")
  async addLevelingRole(
    @SlashOption({ name: "role", type: ApplicationCommandOptionType.Role }) role: Role,
    @SlashOption({ name: "points", type: ApplicationCommandOptionType.Integer }) points: number,
    interaction: CommandInteraction
  ) {
    if (!interaction.guild?.id) {
      await interaction.reply("only supported in guilds")
      return
    }

    await interaction.deferReply()
    
    if (!role.id) return

    try {
      const guild = await this._gs.getByGuildId(interaction.guild.id)
      // try to find if this role has already been added, otherwise create a new one
      const glr = await this._db.manager.findOne(GuildLevelingRoleEntity, {where: {guild: {guildId: guild.guildId}, roleId: role.id}}) ?? new GuildLevelingRoleEntity()
      glr.guild = guild
      glr.roleId = role.id
      glr.pointsRequired = points
      await this._db.manager.save(glr)
      // FIXME translations
      await interaction.editReply("the role was added successfully")
    } catch (e) {
      await interaction.editReply("there was an error adding the role")
    }
  }
}