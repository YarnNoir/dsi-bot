const allowed = require("@util/allowedMember")

module.exports = (req, res, next) => {
  // const Role_rakyat = `${process.env.VERIFY_ROLE}`
  // const check_rakyat =
  //   req.member?._roles.filter((r) => r == Role_rakyat).length < 1

  if (!allowed(req.member)) next()
  else {
    res.render("verify/rakyat", {
      title_head: "Verifikasi Dinasti (beta)",
      title: "Verifikasi Dinasti",
      user: req.user,
    })
  }
}
