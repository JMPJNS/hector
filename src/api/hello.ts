import { Get, Router } from "@discordx/koa"
import type { Context } from "koa"
import { ReminderEntity } from "../entities/reminder.entity.js"

import { bot } from "../main.js"
import { DatabaseService } from "../services/database.service.js"

@Router()
export class API {
  constructor(private _database: DatabaseService) {}

  @Get("/reminders")
  async reminders(context: Context) {
    const reminders = await this._database.dataSource.manager.find(ReminderEntity)
    context.body = reminders.map(x => x.message).join(", ")
  }

  @Get("/")
  index(context: Context): void {
    context.body = `
      <div style="text-align: center">
        <h1>
          <a href="https://discordx.js.org">discord.ts</a> rest api server example
        </h1>
        <p>
          powered by <a href="https://koajs.com/">koa</a> and
          <a href="https://www.npmjs.com/package/@discordx/koa">@discordx/koa</a>
        </p>
      </div>
    `
  }
}
