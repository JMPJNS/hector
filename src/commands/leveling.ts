import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
} from "discord.js"
import {
  ApplicationCommandOptionType,
} from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"
import { DatabaseService } from "../services/database.service.js"
import { LevelingService } from "../services/leveling.service.js"
import { UserService } from "../services/user.service.js"

@Discord()
export class LevelingCommands {

  constructor(
    private _db: DatabaseService,
    private _ls: LevelingService,
    private _us: UserService,
  ) { }

  @Slash({ name: "level" })
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
      .addFields({name: "xp", value: level.points.toString()})

    interaction.editReply({embeds: [embed]})
  }
}