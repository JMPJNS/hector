import {
  CommandInteraction,
  GuildMember,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  SelectMenuInteraction,
} from "discord.js"
import { ActionRowBuilder } from "discord.js"
import { Discord, SelectMenuComponent, Slash, SlashGroup } from "discordx"
import { GuildService } from "../services/guild.service.js"
import { TranslationService } from "../services/translation.service.js"
import { UserService } from "../services/user.service.js"
import { Language } from "../types/types.js"

@Discord()
@SlashGroup({ name: "settings", nameLocalizations: { de: "einstellungen" } })
export class SettingsCommands {
  constructor(
    private readonly _ts: TranslationService,
    private readonly _us: UserService,
    private readonly _gs: GuildService
  ) {}

  @SlashGroup("settings")
  @Slash({ name: "language", nameLocalizations: { de: "sprache" } })
  async language(interaction: CommandInteraction): Promise<void> {
    await this._ts.setLanguageByInteraction(interaction)
    await interaction.deferReply({ ephemeral: true })

    const userLangSelect = new SelectMenuBuilder()
      .setCustomId("user-language-select")
      .setPlaceholder(this._ts.__("USER_LANG"))

    const guildLangSelect = new SelectMenuBuilder()
      .setCustomId("guild-language-select")
      .setPlaceholder(this._ts.__("GUILD_LANG"))

    for (const code in this._ts.locales) {
      const lang = this._ts.locales[code as Language]

      userLangSelect.addOptions({
        label: lang.name,
        emoji: lang.flag,
        description: this._ts.__("USER_LANG"),
        value: code,
      })

      guildLangSelect.addOptions({
        label: lang.name,
        emoji: lang.flag,
        description: this._ts.__("GUILD_LANG"),
        value: code,
      })
    }

    const components = []
    const userLangRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        userLangSelect
      )
    components.push(userLangRow)

    if ((interaction.member as GuildMember)?.permissions.has("Administrator")) {
      const guildLangRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          guildLangSelect
        )
      components.push(guildLangRow)
    }

    interaction.editReply({
      components,
    })
  }

  @SelectMenuComponent({ id: "user-language-select" })
  async userLanguageModal(interaction: SelectMenuInteraction) {
    await this._ts.setLanguageByInteraction(interaction)
    await interaction.deferReply({ ephemeral: true })
    const code = interaction.values[0] as Language
    const lang = this._ts.locales[code]

    await this._us.setLanguage(interaction.user.id, code)
    await this._ts.setLanguageByInteraction(interaction)
    interaction.editReply(
      this._ts.__("SET_{{name}}_LANG_{{lang}}", {
        name: interaction.user.username,
        lang: lang.name,
      })
    )
  }

  @SelectMenuComponent({ id: "guild-language-select" })
  async guildLanguageModal(interaction: SelectMenuInteraction) {
    await this._ts.setLanguageByInteraction(interaction)

    if (!interaction.guildId || !interaction.guild)
      return interaction.reply({
        content: this._ts.__("ONLY_GUILDS"),
        ephemeral: true,
      })

    if (!(interaction.member as GuildMember)?.permissions.has("Administrator"))
      return interaction.reply({
        content: this._ts.__("ONLY_ADMINS"),
        ephemeral: true,
      })

    await interaction.deferReply({ ephemeral: true })
    const code = interaction.values[0] as Language
    const lang = this._ts.locales[code]

    await this._gs.setLanguage(interaction.guildId, code)
    await this._ts.setLanguageByInteraction(interaction)
    interaction.editReply(
      this._ts.__("SET_{{name}}_LANG_{{lang}}", {
        name: interaction.guild.name,
        lang: lang.name,
      })
    )
  }
}
