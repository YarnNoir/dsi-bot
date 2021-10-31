const { MessageActionRow, MessageButton } = require("discord.js")
const { msgBox } = require("@root/util/messagebox")
const verifyUser = require("@models/verifyUser")

module.exports = (client, instance) => {
  setInterval(() => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://discord.gg/WvB8wpJvNH`)
        .setEmoji("🚪")
        .setLabel("Join Again")
        .setStyle("LINK")
    )

    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)

    guild?.members.cache.forEach(async (member) => {
      verifyMember = await verifyUser.findOne({ _id: member.id })

      if (
        !verifyMember ||
        Date.now() < verifyMember.date + 1000 * 60 * 60 * 24 * 7
      )
        return

      member.send({
        embeds: [
          msgBox(
            "Anda dikeluarkan karena anda belum verifikasi",
            "Maaf, tapi anda belum melakukan verifikasi selama 2 minggu, tapi anda dapat join kembali dengan klik tombol dibawah",
            "error"
          ),
        ],
        components: [row],
      })

      await member.kick()
    })
  }, 1000 * 60 * 60)
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Expired",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "EXPIRED",
}
