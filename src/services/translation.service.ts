import { CommandInteraction } from "discord.js"
import i18n, { I18n } from "i18n"
import path from "path"
import { Service } from "typedi"
import { GuildEntity, UserEntity } from "../entities"
import { GuildService } from "./guild.service.js"
import { UserService } from "./user.service.js"


@Service({transient: true})
export class TranslationService {
	constructor(
		private _gs: GuildService,
		private _us: UserService,
	) {
		i18n.configure({
			locales: ["en", "de"],
			register: this.translator,
			directory: path.join("locales")
		})

		this.translator.setLocale("en")
	}

	public setLanguage(user?: UserEntity, guild?: GuildEntity) {
		const lang = user?.language ?? guild?.language ?? "en"
		this.translator.setLocale(lang)
	}

	public async setLanguageByInteraction(interaction: CommandInteraction) {
		const guild = interaction.guildId ? await this._gs.getByGuildId(interaction.guildId) : undefined
		const user = await this._us.getByUserId(interaction.user.id)
		this.setLanguage(user, guild)
	}
	
	public translator: i18nAPI = {} as i18nAPI
}