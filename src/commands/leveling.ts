import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  Role,
  User,
} from "discord.js"
import { ApplicationCommandOptionType } from "discord.js"
import { Discord, Slash, SlashGroup, SlashOption } from "discordx"
import { GuildLevelingRoleEntity } from "../entities/guildLevelingRole.entity.js"
import { DatabaseService } from "../services/database.service.js"
import { GuildService } from "../services/guild.service.js"
import { LevelingService } from "../services/leveling.service.js"
import { TranslationService } from "../services/translation.service.js"
import { UserService } from "../services/user.service.js"

@Discord()
@SlashGroup({ name: "leveling", description: "leveling system" })
export class LevelingCommands {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _ls: LevelingService,
    private readonly _us: UserService,
    private readonly _gs: GuildService,
    private readonly _ts: TranslationService
  ) {}

  @Slash({ name: "level", description: "get information about a users current level" })
  @SlashGroup("leveling")
  async level(
    @SlashOption({
      name: "user",
      type: ApplicationCommandOptionType.User,
      required: false,
      description: "what user you want"
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    await this._ts.setLanguageByInteraction(interaction)
    const guildId = interaction.guild?.id
    if (!guildId) return

    await interaction.deferReply()

    user = user ?? interaction.user
    const level = await this._us.getUserLevels(user.id, guildId)

    const embed = new EmbedBuilder()
      .setThumbnail(user.avatarURL())
      .addFields({ name: "xp", value: level.totalPoints.toString() })

    interaction.editReply({ embeds: [embed] })
  }

  @Slash({
    name: "add-leveling-role",
    nameLocalizations: { de: "leveling-rolle-hinzufügen" },
    description: "add a role to the leveling system"
  })
  @SlashGroup("leveling")
  async addLevelingRole(
    @SlashOption({
      name: "role",
      nameLocalizations: { de: "rolle" },
      type: ApplicationCommandOptionType.Role,
      description: "the role you want to add"
    })
    role: Role,
    @SlashOption({
      name: "points",
      nameLocalizations: { de: "punkte" },
      type: ApplicationCommandOptionType.Integer,
      description: "how many points the role should be worth"
    })
    points: number,
    interaction: CommandInteraction
  ) {
    await this._ts.setLanguageByInteraction(interaction)
    if (!interaction.guild?.id) {
      await interaction.reply({
        ephemeral: true,
        content: this._ts.__("ONLY_GUILDS"),
      })
      return
    }

    await interaction.deferReply()

    if (!role.id) return

    try {
      const guild = await this._gs.getByGuildId(interaction.guild.id)
      // try to find if this role has already been added, otherwise create a new one
      const glr =
        (await this._db.manager.findOne(GuildLevelingRoleEntity, {
          where: { guild: { guildId: guild.guildId }, roleId: role.id },
        })) ?? new GuildLevelingRoleEntity()
      glr.guild = guild
      glr.roleId = role.id
      glr.pointsRequired = points
      await this._db.manager.save(glr)
      // FIXME translations
      await interaction.editReply(this._ts.__("ROLE_ADD_SUCCESS"))
    } catch (e) {
      await interaction.editReply(this._ts.__("ROLE_ADD_ERROR"))
    }
  }
}
