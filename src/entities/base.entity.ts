
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { DeepPartial } from "../types/types.js"

export abstract class HectorEntity extends BaseEntity {
    protected constructor(input?: DeepPartial<HectorEntity>) {
			super()
			if (input) {
					for (const [key, value] of Object.entries(input)) {
							(this as any)[key] = value
					}
			}
			console.log(this)
    }

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn() createdAt: Date

    @UpdateDateColumn() updatedAt: Date
}