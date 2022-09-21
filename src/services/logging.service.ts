import { Service } from "typedi"
import { Logger } from "tslog"
import chalk from "chalk"
import { Guild } from "discord.js"

@Service()
export class LoggingService {
	public logger: Logger = new Logger()

	public silly(...args: unknown[]) {
		this.logger.silly(...args)
	}

	public guildSilly(guild?: Guild | null, ...args: unknown[]) {
		this.logger.silly(chalk.bold(`[guild: ${guild?.id}:${guild?.name}]`), ...args)
	}

	public trace(...args: unknown[]) {
		this.logger.trace(...args)
	}

	public info(...args: unknown[]) {
		this.logger.info(...args)
	}

	public guildInfo(guild?: Guild | null, ...args: unknown[]) {
		this.logger.info(chalk.bold(`[guild: ${guild?.id}:${guild?.name}]`), ...args)
	}

	public warn(...args: unknown[]) {
		this.logger.warn(...args)
	}

	public error(...args: unknown[]) {
		this.logger.error(...args)
	}

	public guildError(guild?: Guild | null, ...args: unknown[]) {
		this.logger.error(chalk.bold(`[guild: ${guild?.id}:${guild?.name}]`), ...args)
	}

	public fatal(...args: unknown[]) {
		this.logger.fatal(...args)
	}

	public debug(...args: unknown[]) {
		this.logger.debug(...args)
	}
}