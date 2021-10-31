const { MessageEmbed } = require("discord.js")
const { user } = require("@root/util/tag")
const { msgBox } = require("@root/util/messagebox")

module.exports = {
  category: "Fun",
  description: "Memilih 2 hal yang berkaitan", // Required for slash commands
  slash: true, // Create both a slash and legacy command
  options: [
    {
      name: "pilihan1",
      description: "Apa pilihan pertama anda",
      type: 3,
      required: true,
    },
    {
      name: "pilihan2",
      description: "Apa pilihan kedua anda",
      type: 3,
      required: true,
    },
    {
      name: "pernyataan",
      description: "Isi pernyataan anda.",
      type: 3,
    },
    {
      name: "jawaban",
      description: "Isi jawaban anda.",
      type: 3,
    },
  ],
  // testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ interaction, client }) => {
    const pilih1 = interaction?.options.getString("pilihan1")
    const pilih2 = interaction?.options.getString("pilihan2")
    let pernyataan = interaction?.options.getString("pernyataan")
    let jawaban = interaction?.options.getString("jawaban")

    const userId = interaction.user.id

    if (pilih1.toLowerCase() === pilih2.toLowerCase()) {
      interaction.reply({
        embeds: [
          msgBox(
            "Kesalahan Pengguna",
            "Pilihan antara 2 pilihan sama saja, cobalah untuk salah-satunya ada yang berbeda\n\nKetik command `/help pilih` untuk informasi selengkapnya",
            "error"
          ),
        ],
        ephemeral: true,
      })
      return
    }

    console.log([pernyataan, jawaban])

    if (pernyataan) {
      if (
        !pernyataan.includes("{p}") &&
        !pernyataan.includes("{P}") &&
        !pernyataan.includes("{1}") &&
        !pernyataan.includes("{2}")
      )
        pernyataan = pernyataan + ` **${pilih1}** atau **${pilih2}**`

      if (pernyataan.includes("{p}") || pernyataan.includes("{P}"))
        pernyataan = pernyataan.replace(
          /\{[pP]\}/,
          `**${pilih1}** atau **${pilih2}**`
        )

      if (pernyataan.includes("{1}") || pernyataan.includes("{2}")) {
        if (!pernyataan.includes("{1}") || !pernyataan.includes("{2}"))
          return interaction.reply({
            embeds: [
              msgBox(
                "Pastikan anda menggunakan tag **{1}** dan tag **{2}** ",
                "Contoh: `Saya ingin menikah antara si {1} atau si {2}`",
                "error"
              ),
            ],
            ephemeral: true,
          })
        else
          pernyataan = pernyataan
            .replace(/\{1\}/, `**${pilih1}**`)
            .replace(/\{2\}/, `**${pilih2}**`)
      }

      if (pernyataan.includes("{@}")) pernyataan.replace(/\{@\}/, user(userId))
    } else
      pernyataan = `${user(
        userId
      )} memilih, antara **${pilih1}** atau **${pilih2}**`

    const pilihan = [pilih1, pilih2]
    const result = pilihan[Math.floor(Math.random() * pilihan.length)]
    if (jawaban) {
      if (jawaban.includes("{j}") || jawaban.includes("{J}"))
        jawaban = jawaban.replace(/\{[jJ]\}/, `**${result}**`)
      else jawaban = jawaban + ` **${result}**`

      if (jawaban.includes("{@}")) jawaban.replace(/\{@\}/, user(userId))
    } else jawaban = ` Saya memilih **${result}**`

    const embed = new MessageEmbed()
      .setDescription(jawaban)
      .setColor("GREEN")
      .setTimestamp(new Date().getTime())

    interaction.reply({ content: pernyataan, embeds: [embed] })
  },
}
