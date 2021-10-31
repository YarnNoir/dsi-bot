const { tempCCscema } = require("@models/tempcc")
const { msgBox } = require("@root/util/messagebox")
const { MessageAttachment } = require("discord.js")
const { user } = require("@util/tag.js")

module.exports = (client, instance) => {
  client.on("messageCreate", async (msg) => {
    if (msg.guildId != null) return

    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)
    const channel = guild?.channels.cache.get(process.env.LOG_CC_CHANNEL)

    const RoleCC = await tempCCscema
      .findOne({ _id: msg.author.id })
      .then((d) => d)

    if (RoleCC && Date.now() < RoleCC.expiredAt) {
      const image = msg.attachments?.first()

      if (!image.contentType.includes("image")) {
        msg.reply({
          embeds: [
            msgBox(
              "Kesalahan",
              "File yang anda kirimkan bukan gambar, coba file yang lain",
              "error"
            ),
          ],
        })
        return
      }

      const imageFile = new MessageAttachment(image.url)

      channel.send({
        content: `**Pendaftaran role ${
          RoleCC.vtuber === true ? "VTuber" : "Content Creator"
        }**\n${user(msg.author.id)}\n\`URL :\` ${RoleCC.url}${
          RoleCC.twitter_url ? `\n\`Twitter:\` ${RoleCC.twitter_url}` : ""
        }`,
        files: [imageFile],
      })
      msg.reply({
        embeds: [
          msgBox(
            "Pendaftaran telah berhasil",
            "Tunggu pemberitahuan selanjutnya dari admin",
            "info"
          ),
        ],
      })

      await tempCCscema.findOneAndDelete({ _id: msg.author.id })
    }
  })

  setInterval(async () => {
    await tempCCscema.find().then((data) => {
      data.forEach(async (d) => {
        const guildId = `${process.env.GUILD_ID}`
        const guild = client.guilds.cache.get(guildId)
        const member = guild?.members.cache.get(d._id)

        if (Date.now() > d.expiredAt) {
          member.send({
            embeds: [
              msgBox(
                "Waktu Telah Habis",
                "Anda belum mengupload screenshot selama 1 menit lebih, coba untuk daftar ulang",
                "error"
              ),
            ],
          })
          await tempCCscema.findOneAndDelete({ _id: d._id })
        }
      })
    })
  }, 5000)
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Upload Content Creator",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "UPLOAD CONTENT",
}
