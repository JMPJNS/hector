import { Entity, Column } from "typeorm"
import { DeepPartial } from "../types/types.js"
import { HectorEntity } from "./base.entity.js"

@Entity()
export class ReminderEntity extends HectorEntity {
	constructor(input?: DeepPartial<ReminderEntity>) {
		super(input)
	}

  @Column()
  message?: string

  @Column()
  time: Date

  @Column()
  userId: string

  @Column()
  channelId: string
}