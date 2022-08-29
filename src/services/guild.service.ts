import { Service } from "typedi"
import { GuildEntity } from "../entities/guild.entity.js"
import { DatabaseService } from "./database.service.js"

@Service()
export class GuildService {
  constructor(private _db: DatabaseService) {}

  public async getByGuildId(guildId: string, cacheTime = 60000): Promise<GuildEntity> {
    const found = await this._db.manager.findOne(GuildEntity, {cache: cacheTime, where: {guildId}})
    if (found) return found

    const newGuild = new GuildEntity()
    newGuild.guildId = guildId

    return this._db.manager.save(newGuild)
  } 
}