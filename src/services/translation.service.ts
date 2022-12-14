import { BaseInteraction } from "discord.js"
import { Locale } from "../types/types.js"
import i18n from "i18n"
import path from "path"
import { Service } from "typedi"
import { GuildEntity, UserEntity } from "../entities/entities"
import { GuildService } from "./guild.service.js"
import { UserService } from "./user.service.js"

@Service({ transient: true })
export class TranslationService {
  constructor(private _gs: GuildService, private _us: UserService) {
    i18n.configure({
      locales: Object.keys(this.locales),
      register: this.translator,
      directory: path.join("locales"),
    })

    this.translator.setLocale("en")

    this.__ = this.translator.__
  }

  public readonly locales: Locale = {
    en: {
      flag: "🇬🇧",
      name: "English",
    },
    de: {
      flag: "🇩🇪",
      name: "Deutsch",
    },
  }

  public setLanguage(user?: UserEntity, guild?: GuildEntity) {
    const lang = user?.language ?? guild?.language ?? "en"
    this.translator.setLocale(lang)
  }

  public async setLanguageByInteraction<T extends BaseInteraction>(
    interaction: T
  ) {
    const guild = interaction.guildId
      ? await this._gs.getByGuildId(interaction.guildId)
      : undefined
    const user = await this._us.getByUserId(interaction.user.id)
    this.setLanguage(user, guild)
  }
  public __
  public translator: i18nAPI = {} as i18nAPI
}
