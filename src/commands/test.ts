import type {
  CommandInteraction,
} from "discord.js"
import { Discord, Guild, Slash, SlashOption } from "discordx"
import { DatabaseService } from "../services/database.service.js"
import { GuildService } from "../services/guild.service.js"
import { TranslationService } from "../services/translation.service.js"
import { UserService } from "../services/user.service.js"

@Discord()
export class TestCommands {

  constructor(
		private _db: DatabaseService, 
		private _ts: TranslationService, 
		private _gs: GuildService,
		private _us: UserService,
	) {}

	@Guild("716635355020918784")
  @Slash({ name: "test" })
  async hello(
    interaction: CommandInteraction
  ) {
		await this._ts.setLanguageByInteraction(interaction)
		
    const translated = this._ts.translator.__("HELLO {{name}}", {name: interaction.user.username})

		console.log(translated)
		await interaction.reply(translated)
  }
}