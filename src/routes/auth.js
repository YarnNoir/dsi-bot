const { Router } = require("express")
const { isGuest } = require("@middle/auth")
const passport = require("passport")
require("dotenv/config")

const router = Router()

router.get("/", isGuest, passport.authenticate("discord"))

router.get("/logout", (req, res) => res.redirect(`/`))

router.post("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

router.get(
  "/redirect",
  isGuest,
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    console.log(req.session?.nexturi)
    const url = await req.session?.nexturi
    req.session.nexturi = ""
    if (url) res.redirect(url)
    else res.redirect("/")
  }
)

module.exports = { authRoute: router }
