import "reflect-metadata"
import "dotenv/config"

import { dirname, importx } from "@discordx/importer"
import { Koa } from "@discordx/koa"
import type { Interaction, Message } from "discord.js"
import { IntentsBitField } from "discord.js"
import { Client, DIService, typeDiDependencyRegistryEngine } from "discordx"
import { Container, Service } from "typedi"
import { DatabaseService } from "./services/database.service.js"

DIService.engine = typeDiDependencyRegistryEngine
  .setService(Service)
  .setInjector(Container)

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

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started")
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

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment")
  }

  await bot.login(process.env.BOT_TOKEN)

  // Webserver initialization ------------
  const server = new Koa()

  await server.build()

  const port = process.env.PORT ?? 3000
  server.listen(port, () => {
    console.log(`discord api server started on ${port}`)
    console.log(`visit http://localhost:${port}/guilds`)
  })
}

run()
