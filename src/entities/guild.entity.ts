import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class GuildEntity {
  // General Information
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  guildId: string

  // Leveling System  

  // minimum delay between messages in seconds
  @Column({default: 10})
  minimumLevelingDelay: number

  @Column({default: 1})
  levelingMultiplier: number
}