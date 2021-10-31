const byeImg = require("../util/bye_img")

module.exports = {
  category: "Welcome",
  permissions: ["ADMINISTRATOR"],
  description: "Cuma coba goodbye chat", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  //testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ guild, interaction }) => {
    if (interaction.guildId == null)
      return interaction.reply({
        content: "This content not send in DM",
        fetchReply: false,
      })

    const user = interaction.member.user

    byeImg(guild, user)

    interaction.reply({ content: "welcome message sended", ephemeral: true })
  },
}
