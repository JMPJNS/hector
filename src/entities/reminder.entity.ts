import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ReminderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  message?: string

  @Column()
  time: Date

  @Column()
  userId: string

  @Column()
  channelId: string
}