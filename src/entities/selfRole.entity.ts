import { Entity, Column, ManyToOne, Relation } from "typeorm"
import { DeepPartial } from "../types/types.js"
import { HectorEntity } from "./base.entity.js"
import { SelfRoleMessageEntity } from "./selfRoleMessage.entity.js"

@Entity()
export class SelfRoleEntity extends HectorEntity {
  constructor(input?: DeepPartial<SelfRoleEntity>) {
    super()
    Object.assign(this, input)
  }

  // General Information
  @Column()
  roleId: string

  @Column()
  interactionId: string

  @ManyToOne(() => SelfRoleMessageEntity, (m) => m.roles, {
    onDelete: "CASCADE",
  })
  selfRoleMessage: Relation<SelfRoleMessageEntity>
}
