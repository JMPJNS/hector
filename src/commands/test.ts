import type { CommandInteraction } from "discord.js"
import { Discord, Guild, Slash } from "discordx"
import { DatabaseService } from "../services/database.service.js"
import { GuildService } from "../services/guild.service.js"
import { LoggingService } from "../services/logging.service.js"
import { TranslationService } from "../services/translation.service.js"
import { UserService } from "../services/user.service.js"

@Discord()
export class TestCommands {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _ts: TranslationService,
    private readonly _gs: GuildService,
    private readonly _us: UserService,
    private readonly _log: LoggingService
  ) {}

  @Guild("716635355020918784")
  @Slash({ name: "test" })
  async hello(interaction: CommandInteraction) {
    await this._ts.setLanguageByInteraction(interaction)
    const translated = this._ts.translator.__("HELLO {{name}}", {
      name: interaction.user.username,
    })
    throw new Error("yes")
    this._log.silly(translated)
    await interaction.reply(translated)
  }
}
