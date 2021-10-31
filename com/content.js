const { msgBox } = require("@root/util/messagebox")
const { MessageActionRow, MessageButton } = require("discord.js")

const add = require("@com/content/add")
const refresh = require("@com/content/refresh")
const config = require("@com/content/config")

module.exports = {
  category: "Verification",
  description: "Command untuk mendapatkan conren creator/vtuber role", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  // testOnly: true, // Only register a slash command for the testing guilds

  options: [
    {
      name: "add",
      description: "Get category content creator roles",
      type: 1, // 1 is type SUB_COMMAND
      options: [
        {
          name: "url",
          description:
            "Masukan url channel YouTube/channel Twitch/akun Facebook Page/akun IGTV/akun TikTok anda",
          required: true,
          type: 3,
        },
        {
          name: "vtuber",
          description: "Pilih false jika anda bukan vtuber",
          type: 5,
          required: true,
        },
        {
          name: "twitter",
          description: "Masukan URL atau username Twitter anda (optional)",
          type: 3,
        },
      ],
    },
    {
      name: "refresh",
      description: "Refreshing role when using automatic register",
      type: 1, // 1 is type SUB_COMMAND
    },
    {
      name: "link",
      description: "Link to content creator role",
      type: 1, // 1 is type SUB_COMMAND
    },
    {
      name: "config",
      description: "a configuration",
      type: 1,
      options: [
        {
          name: "vtuber",
          description: "toggle when you vtuber",
          type: 5,
        },
        {
          name: "twitter",
          description: "Masukan URL atau username Twitter anda (optional)",
          type: 3,
        },
      ],
    },
  ],

  callback: async ({ interaction, channel, client }) => {
    const guildId = `${process.env.GUILD_ID}`
    const guild = client.guilds.cache.get(guildId)
    const member = guild?.members.cache.get(interaction.user.id)

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(
          `${
            process.env.BASE_URL ||
            `http://127.0.0.1:${process.env.PORT || 3001}`
          }/content`
        )
        .setEmoji("✅")
        .setLabel("Verify Now")
        .setStyle("LINK")
    )

    const message = {
      embeds: [
        msgBox(
          "Link menuju halaman content creator role",
          "Klik tombol dibawah menuju halaman ini\nUntuk **Windows 11** jika tidak bisa dibuka, klik kanan pada tombol dibawah, lalu klik **Copy Link** untuk di pastekan di Browser kamu",
          "info"
        ),
      ],
      components: [row],
    }

    if (interaction.options.getSubcommand() === "link") {
      if (interaction.guildId != null) {
        interaction.reply({
          embeds: [msgBox("Sudah terkirim", "Silahkan cek link di DM", "info")],
          ephemeral: interaction.channelId !== `${process.env.CHANNEL_BOT}`,
        })

        member.send(message)
      } else interaction.reply(message)
    }

    if (interaction.options.getSubcommand() === "add")
      return await add(interaction, member, channel)

    if (interaction.options.getSubcommand() === "refresh")
      return await refresh(interaction, member, channel)

    if (interaction.options.getSubcommand() === "config")
      return await config(interaction, member, channel)
  },
}
