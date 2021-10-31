const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const passport = require("passport")
const { database } = require("@util/database")
const MongoStore = require("connect-mongo")
const useragent = require("express-useragent")

const https = require("https")
const path = require("path")
const fs = require("fs")

const { authRoute } = require("@routes/auth")
const { verifyRoute } = require("@routes/verify")
const { ccroleRoute } = require("@routes/content")

const { userSchema } = require("@models/discordUser")
const { model } = require("mongoose")

const app = express()
const port = process.env.PORT || 3001
require("@serve/strategies/discord")
// require("@serve/strategies/instagram")

const server = (client) => {
  database
    .then(() => console.log("database active"))
    .catch((e) => console.log(e))

  app.set("view engine", "ejs")
  app.set("views", "ejs-views")

  app.use(
    session({
      name: "discord.oauth2",
      secret: `secret`,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
      saveUninitialized: false,
      resave: false,
      store: MongoStore.create({ mongoUrl: `${process.env.MONGO_URI}` }),
    })
  )

  app.use(expressLayouts)
  app.set("layout", "layout/dinasti-layout")

  app.use(express.static("files"))
  app.use(express.urlencoded({ extended: true }))
  app.use(useragent.express())

  app.use(passport.initialize())
  app.use(passport.session())

  const getDataMember = async (req, res, next) => {
    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)
    if (await req.user) {
      req.member = guild?.members.cache.get(req.user._id)

      req.session.loginid = req.user.id
    }
    next()
  }
  app.use(getDataMember)

  app.get("/", (req, res) => {
    res.render("index", {
      title_head: "Welcome to DSI Bot",
      title: "DSI Bot",
      user: req.user,
    })
  })

  app.use("/auth", authRoute)

  app.get("/listen", (req, res) => {
    res.send("ok")
  })

  app.use("/verify", verifyRoute)
  app.use("/content", ccroleRoute)

  app.get(
    "/.well-known/acme-challenge/2r2QPQOr3t1BufvXeqjywwhZuz1soERClMlG3MJRgj8",
    (req, res) =>
      res.send(
        "2r2QPQOr3t1BufvXeqjywwhZuz1soERClMlG3MJRgj8.VOvIsgiuwJoKgwTGq6lX7AlcQxzFQhtQWvOENVQelKc"
      )
  )

  app.listen(port, () => {
     console.log(`web active, listen ${port}`)
  })
  const appHttps = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "../etc/https/key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "../etc/https/cert.pem")),
    },
    app
  )

  // if (process.env.BASE_URL === "https://discord.dsiworld.my.id")
  // appHttps.listen(port, () =>
  //  console.log(`web active with https, listen ${port}`)
  // )
  // else
  //   app.listen(port, () => {
  //     console.log(`web active, listen ${port}`)
  //   })
}

module.exports = { server }
