import { Get, Router } from "@discordx/koa"
import type { Context } from "koa"
import { html } from "lit-html"
import { ReminderEntity } from "../entities/reminder.entity.js"

import { bot } from "../main.js"
import { DatabaseService } from "../services/database.service.js"

@Router()
export class API {
  constructor(private _database: DatabaseService) {}

  @Get("/reminders")
  async reminders(ctx: Context) {
    const reminders = await this._database.dataSource.manager.find(ReminderEntity)
    ctx.body = reminders.map(x => x.message).join(", ")
  }

  @Get("/")
  index(ctx: Context) {
		const guilds = bot.guilds.cache.map(x => `<div>${x.name}</div>`).join(" ")
    ctx.body = html`
      <div style="text-align: center">
        <h1>
          Serving the following guilds
        </h1>
        <p>
          ${guilds}
        </p>
      </div>
    `
  }
}
