module.exports = (req, res, next) => {
  if (req.user?.myServer) next()
  else {
    res.render("error/not-member", {
      title_head: "Verifikasi Dinasti (beta)",
      title: "Verifikasi Dinasti",
      user: req.user,
    })
  }
}
