const { Strategy } = require("passport-instagram")
const passport = require("passport")

passport.use(
  new Strategy(
    {
      clientID: "",
      clientSecret: "",
      grantType: "authorization_code",
      callbackURL: `${
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`
      }/content/instagram/callback`,
      scope: ["user_profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      console.log("found")
      // done(null, profile)
    }
  )
)
