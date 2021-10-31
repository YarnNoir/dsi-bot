const { Strategy } = require("passport-discord")
const passport = require("passport")
require("dotenv/config")
const { userSchema } = require("@root/models/discordUser")

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await userSchema.findById(id)
  if (user) done(null, user)
})

passport.use(
  new Strategy(
    {
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      callbackURL: `${process.env.BASE_URL || ``}/auth/redirect`,
      scope: ["identify", "guilds", "connections"],
    },
    async (access, refresh, profile, done) => {
      try {
        const dinasti =
          profile.guilds?.filter(
            (server) => server.id === process.env.GUILD_ID
          )[0] || null

        const content = profile.connections.filter(
          (con) => con.type === "youtube" || con.type === "twitch"
        )

        const user = await userSchema
          .findOneAndUpdate(
            { _id: profile.id },
            {
              _id: profile.id,
              username: `${profile.username}#${profile.discriminator}`,
              myServer: dinasti || null,
              content: content || null,
            },
            { upsert: true, new: true }
          )
          .then((d) => d)

        console.log("found")

        done(null, user)
      } catch (err) {
        console.log(err)
        done(err)
      }
    }
  )
)
