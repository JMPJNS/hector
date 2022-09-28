import { Service } from "typedi"
import { EntityNotFoundError } from "typeorm"
import { SelfRoleEntity } from "../entities/selfRole.entity.js"
import { SelfRoleMessageEntity } from "../entities/selfRoleMessage.entity.js"
import { DatabaseService } from "./database.service.js"
import { LoggingService } from "./logging.service.js"

@Service()
export class SelfRoleService {
  constructor(
		private readonly _db: DatabaseService,
		private readonly log: LoggingService,
		) {	}

	public async createSelfRoleMessage(guildId: string, channelId: string, messageId: string, message?: string) {
		const newEntity = new SelfRoleMessageEntity({guildId, channelId, messageId, message})
		return this._db.manager.save(newEntity)
	}

	public async findSelfRoleMessage(id: number) {
		return this._db.manager.findOneBy(SelfRoleMessageEntity, {id})
	}

	public async findOrCreateRole(selfRoleMessageId: number, roleId: string) {
		const found = await this._db.manager.findOneBy(SelfRoleEntity, {roleId, selfRoleMessage: {id: selfRoleMessageId}})
		if (found) return found

		const foundSrMessage = await this.findSelfRoleMessage(selfRoleMessageId)
		if (!foundSrMessage) {
			this.log.error("Self Role Message not found", selfRoleMessageId)
			throw new EntityNotFoundError(SelfRoleMessageEntity, selfRoleMessageId)
		}

		const newRole = new SelfRoleEntity({roleId, selfRoleMessage: foundSrMessage})
		return this._db.manager.save(newRole)
	}
}