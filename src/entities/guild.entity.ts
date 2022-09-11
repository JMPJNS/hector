import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from "typeorm"
import { Language } from "../types/types.js"
import { GuildLevelingRoleEntity } from "./guildLevelingRole.entity.js"

@Entity()
export class GuildEntity {
  // General Information
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  guildId: string

  /**
   * Bot info messages (like levelup or errors) are sent in this channel
   */
  @Column({nullable: true})
  botMessageChannelId?: string

  // Leveling System  -----------
  @OneToMany(() => GuildLevelingRoleEntity, (glr) => glr.guild)
  levelingRoles: Relation<GuildLevelingRoleEntity[]>

  /**
   * minimum delay between messages in seconds
   */
  @Column({default: 10})
  minimumLevelingDelay: number

  /**
   * points the user gets get multiplied by this ammount
   */
  @Column({default: 1})
  levelingMultiplier: number

  /**
   * Message that is sent in the guilds botChannel (or last channel the user sent a message if not defined)
   * 
   * Some special strings here will get replaced in the actual levelup message
   * Currently supported:
   * 
   * - [user]: mentions the user that leveled up
   * - [newRole]: the new role the user reached
   * - [oldRole]: the users old role
   * - [points]: the users current points
   */
   @Column({default: "[user] has leveled up!", nullable: true})
   levelUpMessage?: string

	 @Column({default: "en"})
	 language: Language
}