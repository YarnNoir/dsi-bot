const welcomeImg = require("@util/welcome_img")
const { welcomeMsg } = require("@util/welcome_msg")

module.exports = (client, instance) => {
  client.on("guildMemberAdd", async (member) => {
    const { guild, user } = member

    welcomeMsg(user, guild)
    welcomeImg(guild, user)
  })
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Welcome Message",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "WELCOME MESSAGE",
}
