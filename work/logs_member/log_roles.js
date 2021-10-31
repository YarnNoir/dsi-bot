const { MessageEmbed } = require("discord.js")
const verifyUser = require("@models/verifyUser")

module.exports = (client, instance) => {
  client.on("guildMemberUpdate", async (old, newM) => {
    const oldRoles = await old?._roles
    const roles = await newM?._roles

    if (
      roles.includes(`${process.env.VERIFY_ROLE}`) &&
      !oldRoles.includes(`${process.env.VERIFY_ROLE}`)
    ) {
      const warga = await verifyUser
        .findOne({
          _id: newM?.id,
        })
        .then((d) => d)

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Warga ini telah terdaftar")
        .setDescription(
          `Username:\`${
            newM?.user.username + "#" + newM?.user.discriminator
          }\`\nID User:\`${warga?._id}\`\nVerify ID:\`${warga?.verifyId}\``
        )
        .setTimestamp(new Date().getTime())

      const channel = newM.guild.channels.cache.get(
        `${process.env.LOG_VERIFY_CHANNEL}`
      )
      await channel.send({ embeds: [embed] })

      await verifyUser.deleteOne({ id: warga?.id })
    }
  })
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Roles Added",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "ROLES ADDED",
}
