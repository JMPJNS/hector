import type {
  CommandInteraction,
  GuildMember,
} from "discord.js"
import {
  ApplicationCommandOptionType,
} from "discord.js"
import { Discord, Slash, SlashOption } from "discordx"
import { ReminderEntity } from "../entities/reminder.entity.js"
import { DatabaseService } from "../services/database.service.js"

@Discord()
export class ReminderCommands {

  constructor(
		private readonly _db: DatabaseService,
	) {}

  @Slash({ name: "remind" })
  async hello(
    @SlashOption({ name: "user", type: ApplicationCommandOptionType.User }) user: GuildMember,
    @SlashOption({ name: "in-minutes", type: ApplicationCommandOptionType.Integer}) minutes: number,
    @SlashOption({ name: "message", type: ApplicationCommandOptionType.String}) message: string | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply()

    const reminder = new ReminderEntity()
    reminder.userId = interaction.user.id
    reminder.channelId = interaction.channelId
    reminder.message = message
    reminder.time = new Date(new Date().getTime() + minutes*60000)

    await this._db.manager.save(reminder)

    await interaction.editReply(`I will remind you in ${minutes} minutes!`)
  }
}