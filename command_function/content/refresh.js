const allowedMember = require("@util/allowedMember")
const { msgBox } = require("@root/util/messagebox")
const { contentSchema } = require("@models/contentUser")

const setRoleContent = require("@util/content/role")
const getYTrole = require("@util/api/getYTrole")
const getTwitchRole = require("@util/api/getTwitchRole")

module.exports = async (interaction, member, channel) => {
  if (!allowedMember(member)) {
    return interaction.reply({
      embeds: [
        msgBox(
          "Belum verifikasi",
          "Saat ini anda belum verifikasi, silahkan command `/verify`",
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  const checkContent = await contentSchema.findOne({ _id: member.id })

  if (!checkContent) {
    return interaction.reply({
      embeds: [
        msgBox(
          "Pengguna tidak tersedia",
          "Request role dengan mengetikan `/content add`",
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  if (checkContent?.time + 1000 * 60 * 60 * 24 * 7 > Date.now()) {
    return interaction.reply({
      embeds: [
        msgBox(
          "Pengguna dibatasi",
          "Anda hanya bisa request dan refresh selama 7 hari",
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  let content_data

  if (checkContent.type === "youtube") {
    content_data = await getYTrole({
      id: checkContent.content_id,
    })
  }

  if (checkContent.type === "twitch") {
    content_data = await getTwitchRole({
      id: checkContent.content_id,
    })
  }

  setRoleContent(member, content_data.followers)

  await contentSchema.updateOne(
    { _id: member.id },
    {
      follower: content_data.followers,
      time: Date.now(),
    }
  )

  return interaction.reply({
    embeds: [
      msgBox("Role telah direfresh", "Silahkan check role anda", "info"),
    ],
    ephemeral:
      interaction.guildId != null ||
      interaction.channelId !== `${process.env.CHANNEL_BOT}`,
  })
}
