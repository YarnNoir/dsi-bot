module.exports = (req, res, next) => {
  const timeQ =
    req.member?.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7 <
    req.member?.joinedTimestamp
      ? req.member?.joinedTimestamp + 1000 * 60 * 5
      : req.member?.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7

  if (Date.now() >= timeQ) next()
  else {
    res.render("error/quarentine", {
      title_head: "Verifikasi Dinasti (beta)",
      title: "Verifikasi Dinasti",
      user: req.user,
    })
  }
}
