const { MessageActionRow, MessageButton } = require("discord.js")
const verifyUser = require("@models/verifyUser")
const { msgBox } = require("@root/util/messagebox")
const randomstring = require("randomstring")
const allowedMember = require("@util/allowedMember")

module.exports = (client, instance) => {
  setInterval(() => {
    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)

    guild?.members.cache.forEach(async (member) => {
      const timeQ =
        member.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7 <
        member.joinedTimestamp
          ? member.joinedTimestamp + 1000 * 60 * 5
          : member.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7

      const checkUser = await verifyUser?.findOne({ _id: member.id })
      if (
        member.user.bot ||
        allowedMember(member) ||
        member.id == guild.ownerId ||
        Date.now() < timeQ ||
        checkUser
      )
        return

      const getUrlVerify = await verifyUser
        .findOneAndUpdate(
          { _id: member.id },
          {
            _id: member.id,
            verifyId: randomstring.generate(),
            date: Date.now(),
          },
          { upsert: true, new: true }
        )
        .then((d) => d)

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setURL(
            `${
              process.env.BASE_URL ||
              `http://127.0.0.1:${process.env.PORT || 3001}`
            }/verify?id=${getUrlVerify.verifyId}`
          )
          .setEmoji("✅")
          .setLabel("Verify Now")
          .setStyle("LINK")
      )

      member.send({
        embeds: [
          msgBox(
            "Verifikasi Member",
            "Klik tombol dibawah untuk verifikasi\nUntuk **Windows 11** jika tidak bisa dibuka, klik kanan pada tombol dibawah, lalu klik **Copy Link** untuk di pastekan di Browser kamu",
            "info"
          ),
        ],
        components: [row],
      })
    })
  }, 1000 * 30)
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "New Link Verify",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "LINK VERIFY",
}
