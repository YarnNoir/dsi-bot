const { MessageActionRow, MessageButton } = require("discord.js")
const { msgBox } = require("@root/util/messagebox")
const verifyUser = require("@models/verifyUser")
const allowedMember = require("@util/allowedMember")
// const randomstring = require("randomstring")

module.exports = {
  category: "Verification",
  description: "Verifikasi ke server kami", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  // testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ interaction, client }) => {
    // if (interaction.guildId != null)
    //   return interaction.reply({
    //     embeds: [
    //       msgBox(
    //         "Kesalahan Pengguna",
    //         "Command ini hanya bisa jalan di DM/Private message",
    //         "error"
    //       ),
    //     ],
    //     ephemeral: true,
    //   })

    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)

    const member = guild?.members.cache.get(interaction.user.id)

    const Role_rakyat = `${process.env.VERIFY_ROLE}`
    const check_rakyat = member?._roles.filter((r) => r == Role_rakyat).length

    if (check_rakyat > 0) {
      interaction.reply({
        embeds: [
          msgBox(
            "Anda Sudah Menjadi Warga Terdaftar!",
            "Selamat menikmati apa yang disediakan dinasti ini!",
            "info"
          ),
        ],
        ephemeral:
          interaction.guildId != null ||
          interaction.channelId !== `${process.env.CHANNEL_BOT}`,
      })

      return
    }

    if (allowedMember(member)) {
      return interaction.reply({
        embeds: [
          msgBox(
            "Anda tidak perlu verifikasi",
            "Anda adalah seorang staff",
            "info"
          ),
        ],
        ephemeral:
          interaction.guildId != null ||
          interaction.channelId !== `${process.env.CHANNEL_BOT}`,
      })
    }

    // const timeQ =
    //   member.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7 <
    //   member.joinedTimestamp
    //     ? member.joinedTimestamp + 1000 * 60 * 5
    //     : member.user.createdTimestamp + 1000 * 60 * 60 * 24 * 7
    const verifyUsers = await verifyUser.findOne({ _id: member.id })

    if (!verifyUsers) {
      interaction.reply({
        embeds: [
          msgBox(
            "Anda belum bisa mengunakan command verifikasi!",
            "Tunggu sampai karantina selesai",
            "warning"
          ),
        ],
        ephemeral:
          interaction.guildId != null ||
          interaction.channelId !== `${process.env.CHANNEL_BOT}`,
      })

      return
    }

    // const verifyId = randomstring.generate()

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(
          `${
            process.env.BASE_URL ||
            `http://127.0.0.1:${process.env.PORT || 3001}`
          }/verify?id=${verifyUsers?.verifyId}`
        )
        .setEmoji("✅")
        .setLabel("Verify Now")
        .setStyle("LINK")
    )

    if (interaction.guildId === null) {
      interaction.reply({
        embeds: [
          msgBox(
            "Verifikasi Member",
            "Klik tombol dibawah untuk verifikasi\nUntuk **Windows 11** jika tidak bisa dibuka, klik kanan pada tombol dibawah, lalu klik **Copy Link** untuk di pastekan di Browser kamu",
            "info"
          ),
        ],
        components: [row],
      })
    } else {
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

      interaction.reply({
        embeds: [msgBox("Verifikasi Member", "Silahkan cek di DM", "info")],
        ephemeral: interaction.channelId !== `${process.env.CHANNEL_BOT}`,
      })
    }
  },
}
