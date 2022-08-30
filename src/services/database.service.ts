import { DataSource, EntityManager } from "typeorm"
import { Service } from "typedi"

// Entities
import { ReminderEntity, GuildEntity, UserEntity, UserLevelEntity } from "../entities/index.js"
import { GuildLevelingRoleEntity } from "../entities/guildLevelingRole.entity.js"

@Service()
export class DatabaseService {
  public dataSource: DataSource
  public manager: EntityManager

  constructor() {
    const type = process.env.DB_TYPE

    const entities = [ReminderEntity, GuildLevelingRoleEntity, GuildEntity, UserLevelEntity, UserEntity]

    if (type == "postgres") {
      this.dataSource = new DataSource({
        type: "postgres",
        database: process.env.DB_DATABASE ?? "hector",
        username: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "",
        host: process.env.DB_HOST ?? "localhost",
        port: process.env.DB_PORT as unknown as number ?? 5432,
        entities,
      })
    // if no other type is defined use sqlite default
    } else {
      this.dataSource = new DataSource({
        type: "sqlite",
        database: process.env.DB_DATABASE ?? "./hector.sqlite",
        entities,
        synchronize: true,
        // logging: "all",
      })
    }

    this.manager = this.dataSource.manager
  }
}