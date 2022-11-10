import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  MessageActionRowComponentBuilder,
  Role,
  User,
} from "discord.js"
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import {
  ButtonComponent,
  Discord,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx"
import { SelfRoleService } from "../services/selfRole.service.js"
import { TranslationService } from "../services/translation.service.js"

@Discord()
@SlashGroup({ name: "self-roles", description: "create buttons to give yourself roles" })
export class SelfRoleCommands {
  constructor(
    private readonly _srService: SelfRoleService,
    private readonly _ts: TranslationService
  ) {}

  @Slash({ name: "create", description: "create a self role message" })
  @SlashGroup("self-roles")
  async create(
    @SlashOption({ name: "message", type: ApplicationCommandOptionType.String, description: "the message that should be shown" })
    message: string,
    interaction: CommandInteraction
  ): Promise<void> {
    await this._ts.setLanguageByInteraction(interaction)
    if (!interaction.guildId || !interaction.channel) {
      await interaction.reply({
        ephemeral: true,
        content: this._ts.__("ONLY_GUILDS"),
      })
      return
    }

    const discordMessage = await interaction.channel.send({ content: "..." })

    const sr = await this._srService.createSelfRoleMessage(
      interaction.guildId,
      interaction.channelId,
      discordMessage.id,
      message
    )
    const embed = new EmbedBuilder()
      .setFooter({ text: `ID: ${sr.id}, ` + this._ts.__("SR_ADD_ROLES") })
      .setDescription(message)

    await discordMessage.edit({ embeds: [embed] })
  }

  @Slash({ name: "add-role", description: "add a role to a self role message" })
  @SlashGroup("self-roles")
  async addRole(
    @SlashOption({
      name: "id",
      type: ApplicationCommandOptionType.Number,
      description: "you get this ID from the /self-roles create command",
    })
    id: number,
    @SlashOption({ name: "role", type: ApplicationCommandOptionType.Role, description: "the role" })
    role: Role,
    interaction: CommandInteraction
  ): Promise<void> {
    await this._ts.setLanguageByInteraction(interaction)
    await interaction.deferReply({ ephemeral: true })
    if (!interaction.guildId || !interaction.channel) {
      await interaction.editReply({ content: this._ts.__("ONLY_GUILDS") })
      return
    }

    const srm = await this._srService.findSelfRoleMessage(id)

    if (!srm || srm.guildId !== interaction.guildId) {
      await interaction.editReply({ content: this._ts.__("NOT_FOUND") })
      return
    }

    srm.roles ??= []

    if (!srm.roles.find((x) => x.roleId === role.id)) {
      const createdRole = await this._srService.findOrCreateRole(id, role.id)
      srm.roles.push(createdRole)
    }

    const components = []

    const rolePairs = srm.roles.flatMap((_, i, a) =>
      i % 3 ? [] : [a.slice(i, i + 3)]
    )
    for (const pair of rolePairs) {
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      for (const role of pair) {
        const discordRole = await interaction.guild?.roles.fetch(role.roleId)
        if (!discordRole) {
          //TODO: delete the self role entity in database
          continue
        }

        const btn = new ButtonBuilder()
          .setLabel(discordRole.name)
          .setStyle(ButtonStyle.Primary)
          .setCustomId(role.interactionId)

        row.addComponents(btn)
      }
      components.push(row)
    }

    const discordMessage = await interaction.channel.messages.fetch(
      srm.messageId
    )
    const embed = new EmbedBuilder()
      .setFooter({ text: `ID: ${srm.id}` })
      .setDescription(srm.message ?? "")

    await discordMessage.edit({ embeds: [embed], components, content: "" })

    await interaction.editReply({ content: this._ts.__("SUCCESS") })
  }
}
