import { Service } from "typedi"
import { UserEntity } from "../entities/user.entity.js"
import { UserLevelEntity } from "../entities/userLevel.entity.js"
import { Language } from "../types/types.js"
import { DatabaseService } from "./database.service.js"

@Service()
export class UserService {
  constructor(private _db: DatabaseService) {}

  public async getByUserId(userId: string, cacheTime = 1000): Promise<UserEntity> {
    const found = await this._db.manager.findOne(UserEntity, {cache: cacheTime, where: {userId}})
    if (found) return found

    const newUser = new UserEntity()
    newUser.userId = userId

    return this._db.manager.save(newUser)
  }

  public async getUserLevels(userId: string, guildId: string, cacheTime = 1000): Promise<UserLevelEntity> {
    const found = await this._db.manager.findOne(UserLevelEntity, {cache: cacheTime, where: {guildId, user: {userId}}})
    if (found) return found
    
    const newLevel = new UserLevelEntity()
    newLevel.guildId = guildId
    newLevel.user = await this.getByUserId(userId)
    newLevel.lastUpdated = new Date()
    
    return this._db.manager.save(newLevel)
  }

	public async setLanguage(userId: string, lang: Language) {
		const user = await this.getByUserId(userId)
		user.language = lang
		return this._db.manager.save(user)
	}
}