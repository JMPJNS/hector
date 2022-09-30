import { Entity, Column, OneToMany, Relation } from "typeorm"
import { DeepPartial, Language } from "../types/types.js"
import { HectorEntity } from "./base.entity.js"
import { UserLevelEntity } from "./userLevel.entity.js"

@Entity()
export class UserEntity extends HectorEntity {
	constructor(input?: DeepPartial<UserEntity>) {
		super()
		Object.assign(this, input)
	}

  // General Information
  @Column()
  userId: string

  // Leveling System
  @OneToMany(() => UserLevelEntity, (ul) => ul.user)
  levels: Relation<UserLevelEntity[]>

	@Column({default: null, nullable: true})
	 language: Language
}