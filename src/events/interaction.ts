import type { ArgsOf, Client } from "discordx"
import { Discord, On } from "discordx"
import { LevelingService } from "../services/leveling.service.js"
import { LoggingService } from "../services/logging.service.js"
import chalk from "chalk"
import { SelfRoleEntity } from "../entities/selfRole.entity.js"
import { ButtonInteraction } from "discord.js"
import { TranslationService } from "../services/translation.service.js"

@Discord()
export class InteractionEvents {
  constructor(
    private readonly _ls: LevelingService,
    private readonly _log: LoggingService,
    private readonly _ts: TranslationService
  ) {}

  @On({ event: "interactionCreate" })
  async interactionCreated(
    [interaction]: ArgsOf<"interactionCreate">,
    client: Client
  ) {
    // check if interaction id is associated with a self role entity
    if (interaction instanceof ButtonInteraction) {
      const sr = await SelfRoleEntity.findOneBy({
        interactionId: interaction.customId,
      })
      if (sr) {
        const role = interaction.guild?.roles.cache.find(
          (x) => x.id === sr.roleId
        )
        const member = interaction.guild?.members.cache.find(
          (x) => x.id === interaction.user.id
        )
        if (member && role) {
          if (member?.roles.cache.some((x) => x.id === role.id))
            await member?.roles.remove(role)
          else await member?.roles.add(role)
          interaction.reply({
            ephemeral: true,
            content: this._ts.__("SUCCESS"),
          })
        }
      }
    }
  }
}
