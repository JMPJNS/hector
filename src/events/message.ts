import type { ArgsOf, Client } from "discordx"
import { Discord, On } from "discordx"
import { LevelingService } from "../services/leveling.service.js"
import { LoggingService } from "../services/logging.service.js"
import chalk from "chalk"

@Discord()
export class MessageEvents {
  constructor(
		private _ls: LevelingService,
		private _log: LoggingService
	) {}

  @On({event: "messageCreate"})
  async messageCreate([message]: ArgsOf<"messageCreate">, client: Client) {
    this._log.guildSilly(message.guild, chalk.underline(`[user: ${message.author.id}:${message.author.username}]`), "Message Created", message.content)
    await this._ls.handleMessage(message)
  }
}
