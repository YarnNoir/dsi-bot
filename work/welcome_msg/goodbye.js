const byeImg = require("@util/bye_img")
const verifyUser = require("@models/verifyUser")

module.exports = (client, instance) => {
  client.on("guildMemberRemove", async (member) => {
    const { guild, user } = member

    await verifyUser.findOneAndDelete({ _id: member.id })

    byeImg(guild, user)
  })
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Good Bye Message",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "GOODBYE MESSAGE",
}
