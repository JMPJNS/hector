import { Entity, Column, ManyToOne, Relation } from "typeorm"
import { DeepPartial } from "../types/types.js"
import { HectorEntity } from "./base.entity.js"
import { GuildEntity } from "./guild.entity.js"

@Entity()
export class GuildLevelingRoleEntity extends HectorEntity {
	constructor(input?: DeepPartial<GuildLevelingRoleEntity>) {
		super(input)
	}

  // General Information

  @ManyToOne(() => GuildEntity, (guild) => guild.levelingRoles, {onDelete: "CASCADE"})
  guild: Relation<GuildEntity>

  /**
   * The discord snowflake of the role
   */
  @Column()
  roleId: string

  /**
   * How many points are required to reach this level
   */
  @Column()
  pointsRequired: number
}