import { Entity, Column, OneToMany, Relation } from "typeorm"
import { DeepPartial } from "../types/types.js"
import { HectorEntity } from "./base.entity.js"
import { SelfRoleEntity } from "./selfRole.entity.js"

@Entity()
export class SelfRoleMessageEntity extends HectorEntity {
	constructor(input?: DeepPartial<SelfRoleMessageEntity>) {
		super(input)
		console.log(this)
	}

  // General Information
	@Column()
	guildId: string

	@Column()
	channelId: string

	@Column()
	messageId: string

	@Column()
	message?: string

	@OneToMany(() => SelfRoleEntity, (sr) => sr.selfRoleMessage)
  roles: Relation<SelfRoleEntity[]>

}