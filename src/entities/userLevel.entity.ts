import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, UpdateDateColumn } from "typeorm"
import { UserEntity } from "./user.entity.js"

@Entity()
export class UserLevelEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, (user) => user.levels)
  user: Relation<UserEntity>

  @Column()
  guildId: string

	@Column()
	joinDate: Date

	/**
	 * These points include messages, special events and manually added points
	 */
  @Column({default: 0})
  points: number

  @Column()
  lastPointUpdate: Date

	/**
	 * These points are calculated from the joinDate
	 * Optimally this would not exist and instead the database computes a final point value based on the date but idk how (can't do it on demand cause leaderboard)
	 */
	@Column({default: 0})
	timeBasedPoints: number

	@Column()
	lastTimeBasedPointUpdate: Date

  @Column({nullable: true})
  currentRoleId?: string

	public get totalPoints() {
		return this.points + this.timeBasedPoints
	}
}