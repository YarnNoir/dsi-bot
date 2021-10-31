module.exports = async (member, followers) => {
  followers = parseInt(followers)
  const ccrole = process.env.CC_ROLE.split(",").reverse()
  const ccfollowers = process.env.CC_FOLLOWERS.split(",")
    .reverse()
    .map((f) => parseInt(f))

  await member?.roles
    .remove(ccrole)
    .then((role) => console.log("semua role telah dihapus"))

  await member?.roles
    .add(ccrole.find((r, i) => followers >= ccfollowers[i]))
    .then((r) => {
      console.log(`role ditambahkan`)
    })
}
