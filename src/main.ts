import "reflect-metadata"
import "dotenv/config"

import { dirname, importx } from "@discordx/importer"
import { Koa } from "@discordx/koa"
import type { Interaction, Message } from "discord.js"
import { IntentsBitField } from "discord.js"
import { Client, DIService, typeDiDependencyRegistryEngine } from "discordx"
import { Container, Service } from "typedi"
import { DatabaseService } from "./services/database.service.js"
import { renderLitMiddleware } from "./helpers/renderLit.js"
import { LoggingService } from "./services/logging.service.js"

// setup dependency injection
DIService.engine = typeDiDependencyRegistryEngine
  .setService(Service)
  .setInjector(Container)

const log = await Container.get(LoggingService)

export const bot = new Client({
  // To only use global commands (use @Guild for specific guild command), comment this line
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "$",
  },
})

bot.once("ready", async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch()

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands()

	log.info("Bot Started")
})

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction)
})

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message)
})

async function run() {
  // Db initialization
  await Container.get(DatabaseService).dataSource.initialize()

  // Bot initialization ------------
  await importx(
    dirname(import.meta.url) + "/{events,commands,api}/**/*.{ts,js}"
  )

  if (!process.env.DISCORD_TOKEN) {
    throw Error("Could not find DISCORD_TOKEN in your environment")
  }

  await bot.login(process.env.DISCORD_TOKEN)

  // Webserver initialization ------------
  const server = new Koa()

	server.middleware.unshift(renderLitMiddleware)

  await server.build()

  const port = process.env.PORT ?? 3000
  server.listen(port, () => {
    log.info(`koa api server started on ${port}`)
  })
}

run()
