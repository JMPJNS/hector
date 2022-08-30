import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from "typeorm"
import { GuildEntity } from "./guild.entity.js"

@Entity()
export class GuildLevelingRoleEntity {
  // General Information
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => GuildEntity, (guild) => guild.levelingRoles, {})
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