const { MessageEmbed } = require("discord.js")

module.exports = {
  category: "Help",
  description: "Apa isi command pada bot ini?", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  options: [
    {
      name: "pilih",
      description: "Memilih 2 hal yang berkaitan",
      type: 1,
    },
  ],
  //testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ guild, interaction }) => {
    const command = interaction.options._subcommand
    const embed = new MessageEmbed()

    if (command === "pilih") {
      embed
        .setTitle("Command untuk pilih")
        .setDescription(
          "**Command:** /pilih `pilihan1:Manis` `pilihan2:Asin`\n\n**Optional Command:**\n\n"
        )
        .setColor("BLURPLE")
        .setFields([
          {
            name: "Pernyataan",
            value:
              "**Command:** /pilih `pilihan1:Manis` `pilihan2:Asin` `pernyataan:Saya suka {p}`\n\n**Tag:**\n• `{@}` Tag orang yang mengunakan command\n• `{p}` Memasukan pilihan 1 dan pilihan 2 secara bersamaan\n• `{1}` Memasukan pilihan 1\n• `{2}` Memasukan pilihan 2\n\n**`⚠️ Pastikan tag {1} dan tag {2} dimasukan secara bersamaan`**\n**Contoh:** /pilih `pilihan1:Manis` `pilihan2:Asin` `pernyataan:Saya suka {1} atau mungkin {2}`\n\n",
          },
          {
            name: "Jawaban",
            value:
              "**Command:** /pilih `pilihan1:Manis` `pilihan2:Asin` `jawaban:Saya suka yang {j}`\n\n**Tag:**\n• `{@}` Tag orang yang mengunakan command\n• `{j}` Memasukan jawaban yang dipilih",
          },
        ])
    }

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}
