const isAuth = (req, res, next) => {
  if (req.user) next()
  else {
    req.session.nexturi = req.originalUrl
    res.redirect("/auth")
  }
}

const isGuest = (req, res, n) => {
  if (!req.user) n()
  else res.redirect("/")
}

module.exports = { isAuth, isGuest }
