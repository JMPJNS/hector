import type {
  ButtonInteraction,
  CommandInteraction,
  GuildMember,
  MessageActionRowComponentBuilder,
  User,
} from "discord.js"
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx"
import { TranslationService } from "../services/translation.service.js"

@Discord()
export class ExampleCommands {
  constructor(private readonly _ts: TranslationService) {}

  @Slash({ name: "hello", description: "this is an example command to show how they are created" })
  async hello(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User, description: "the user you want to say hello to" })
    user: User | GuildMember | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    await this._ts.setLanguageByInteraction(interaction)
    await interaction.deferReply()

    const helloBtn = new ButtonBuilder()
      .setLabel("Hello")
      .setEmoji("👋")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("hello-btn")

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        helloBtn
      )

    interaction.editReply({
      components: [row],
      content: `${user}, Say hello to bot`,
    })
  }

  @ButtonComponent({ id: "hello-btn" })
  helloBtn(interaction: ButtonInteraction): void {
    interaction.reply(`👋 ${interaction.member}`)
  }
}
