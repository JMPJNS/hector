
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { DeepPartial } from "../types/types.js"

export abstract class HectorEntity {
    protected constructor(input?: DeepPartial<HectorEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value
            }
        }
    }

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn() createdAt: Date

    @UpdateDateColumn() updatedAt: Date
}