import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from "typeorm"
import { UserLevelEntity } from "./userLevel.entity.js"

@Entity()
export class UserEntity {
  // General Information
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: string

  // Leveling System
  @OneToMany(() => UserLevelEntity, (ul) => ul.user)
  levels: Relation<UserLevelEntity[]>
}