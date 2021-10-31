// import 'module-alias/'
require("./util/alias")

const dotenv = require("dotenv")
dotenv.config({ path: "@root/.env" })

const { Client } = require("discord.js")
const WOKCommands = require("wokcommands")
const path = require("path")
const { server } = require("./src/index")

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "DIRECT_MESSAGES",
  ],
  partials: ["CHANNEL"],
})

client.on("ready", async () => {
  console.log("bot active")
  server(client)

  // client.application.commands
  //   .fetch()
  //   .then((commands) => {
  //     commands.forEach((com) => {
  //       com.delete()
  //     })
  //   })
  //   .catch(console.error)

  new WOKCommands(client, {
    // The name of the local folder for your command files
    commandsDir: path.join(__dirname, "com"),
    featuresDir: path.join(__dirname, "work"),
    testServers: "809864826142457946",
    // Allow importing of .ts files if you are using ts-node
    dbOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    mongoUri: `${process.env.MONGO_URI}`,
  })
})

client.login(`${process.env.TOKEN}`)
