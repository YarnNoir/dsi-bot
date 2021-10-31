const allowed = require("@util/allowedMember")

module.exports = (req, res, next) => {
  if (allowed(req.member)) next()
  else {
    res.render("verify/not-verify", {
      title_head: "Verifikasi Dinasti (beta)",
      title: "Verifikasi Dinasti",
      user: req.user,
    })
  }
}
