import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from "typeorm"
import { UserEntity } from "./user.entity.js"

@Entity()
export class UserLevelEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, (user) => user.levels)
  user: Relation<UserEntity>

  @Column()
  guildId: string

  @Column({default: 1})
  points: number

  @Column()
  lastUpdated?: Date
}