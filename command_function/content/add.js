const allowedMember = require("@util/allowedMember")
const { msgBox } = require("@root/util/messagebox")
const { tempCCscema } = require("@models/tempcc")
const { contentSchema } = require("@models/contentUser")

const setRoleContent = require("@util/content/role")
const getYTrole = require("@util/api/getYTrole")
const getTwitchRole = require("@util/api/getTwitchRole")
const { MessageActionRow, MessageButton } = require("discord.js")

module.exports = async (interaction, member, channel) => {
  const isURLYouTube =
    /^((http|https):\/\/|)(www\.)?youtube\.com\/(channel\/|user\/|c\/)?[a-zA-Z0-9_-]{1,}$/g
  const isURLFacebookPage =
    /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)$/g
  const isURLInstagram =
    /^(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_]+)$/g
  const isURLTwitch = /^(https:\/\/twitch.tv\/)[a-zA-Z0-9_]{4,25}$/g
  const isURLTikTok = /^(https:\/\/tiktok.com\/@)[a-zA-Z0-9_.]{1,}$/g
  const isATwitter =
    /^(https:\/\/(m|mobile|www)?twitter\.com\/|@)?[A-Za-z0-9_]{4,15}$/g

  const url = interaction?.options.getString("url")
  const isTwitter = interaction?.options.getString("twitter")
  const vtuber = interaction?.options.getBoolean("vtuber")

  const msgManualContent = {
    embeds: [
      msgBox(
        "Selangkah lagi",
        "Upload screenshot berisi jumlah subsriber/followermu untuk verifikasi",
        "info"
      ),
    ],
    ephemeral:
      interaction.guildId != null ||
      interaction.channelId !== `${process.env.CHANNEL_BOT}`,
  }

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

  if (
    !(
      url.match(isURLYouTube) ||
      url.match(isURLFacebookPage) ||
      url.match(isURLInstagram) ||
      url.match(isURLTwitch) ||
      url.match(isURLTikTok)
    )
  ) {
    console.log(url)
    return interaction.reply({
      embeds: [
        msgBox(
          "URL Salah",
          "Format URL salah, silahkan masukan yang benar!",
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  if (isTwitter && !isTwitter?.match(isATwitter)) {
    return interaction.reply({
      embeds: [
        msgBox(
          "Format Salah",
          "Format akun twitter salah, silahkan masukan yang benar!",
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  let content_data

  if (url.match(isURLYouTube)) {
    if (url.includes("/channel/"))
      content_data = await getYTrole({
        id: url.split("/").slice(-1)[0],
      })
    else if (url.includes("/user/"))
      content_data = await getYTrole({
        username: url.split("/").slice(-1)[0],
      })
    else {
      return interaction.reply({
        embeds: [
          msgBox(
            "URL resiko tidak akurat",
            `Harap masukan url channel dengan id/username\nContoh: \`https://www.youtube.com/user/YouTube\` atau \`https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ\``,
            "error"
          ),
        ],
        ephemeral:
          interaction.guildId != null ||
          interaction.channelId !== `${process.env.CHANNEL_BOT}`,
      })
    }
  }

  if (url.match(isURLTwitch)) {
    content_data = await getTwitchRole({
      username: url.split("/").slice(-1)[0],
    })
  }

  let twitter_url
  if (isTwitter) {
    if (isTwitter.startsWith("http"))
      twitter_url = isTwitter.replace(/\/(m|mobile|www)?t/, "/t")
    else twitter_url = `https://twitter.com/${isTwitter.replace("@", "")}`
  }

  if (content_data === false) {
    return interaction.reply({
      embeds: [
        msgBox(
          "Input kurang tepat",
          `URL yang anda masukan tidak benar, coba untuk memasukannya dengan benar`,
          "error"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  } else if (content_data === -1) {
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("yes").setLabel("Ya").setStyle("SUCCESS")
    )

    interaction.reply({
      components: [row],
      embeds: [
        msgBox(
          "Subscriber anda tersembunyi!",
          `Subsriber anda tidak bisa melakukan permintaan secara otomatis\nKamu harus verifikasi secara manual`,
          "warning"
        ),
      ],
      ephemeral: interaction.guildId != null,
    })

    const filter = (btn) => interaction.user.id === btn.user.id

    const collector = channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 1000 * 30,
    })

    collector.on("collect", (i) => console.log("mengirimkan data"))

    let fail = false

    await collector.on("end", async (col) => {
      col.forEach((klik) =>
        console.log(`${klik.user.username} menekan ${klik.customId}`)
      )

      if (col.first()?.customId !== "yes") {
        interaction?.editReply({
          embeds: [msgBox("Times out", "Waktu respon telah habis", "error")],
          components: [],
          ephemeral:
            interaction.guildId != null ||
            interaction.channelId !== `${process.env.CHANNEL_BOT}`,
        })

        fail = true
      } else {
        await tempCCscema
          .findOneAndUpdate(
            { _id: member.id },
            {
              _id: member.id,
              expiredAt: Date.now() + 1000 * 60 * 5,
              vtuber,
              url,
              twitter_url,
            },
            { upsert: true }
          )
          .catch((e) => console.log(e))

        interaction.editReply({ components: [], ...msgManualContent })
      }
    })
  } else {
    setRoleContent(member, content_data.followers)

    await contentSchema.findOneAndUpdate(
      { _id: member.id },
      {
        _id: member.id,
        name: content_data.name,
        type: url.match(isURLYouTube) ? "youtube" : "twitch",
        vtuber,
        twitter_url,
        content_id: content_data.id,
        follower: content_data.followers,
        time: Date.now(),
      },
      { upsert: true, new: true }
    )

    return interaction.reply({
      embeds: [
        msgBox(
          "Role telah ditambahkan",
          "Anda sekarang termasuk konten kreator role",
          "info"
        ),
      ],
      ephemeral:
        interaction.guildId != null ||
        interaction.channelId !== `${process.env.CHANNEL_BOT}`,
    })
  }

  if (!url.match(isURLYouTube) && !url.match(isURLTwitch)) {
    await tempCCscema
      .findOneAndUpdate(
        { _id: member.id },
        {
          _id: member.id,
          expiredAt: Date.now() + 1000 * 60 * 5,
          vtuber,
          url,
          twitter_url,
        },
        { upsert: true }
      )
      .catch((e) => console.log(e))

    interaction.reply("ol")
  }
}
