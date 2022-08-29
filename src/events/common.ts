import type { ArgsOf, Client } from "discordx"
import { Discord, On } from "discordx"
import { LevelingService } from "../services/leveling.service.js"

@Discord()
export class CommonEvents {
  constructor(private _ls: LevelingService) {}

  @On()
  async messageCreate([message]: ArgsOf<"messageCreate">, client: Client) {
    console.log("Message Created", client.user?.username, message.content)
    await this._ls.handleMessage(message)
  }
}
