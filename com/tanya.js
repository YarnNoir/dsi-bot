const { MessageActionRow, MessageButton } = require("discord.js")
const { msgBox } = require("@root/util/messagebox")
const verifyUser = require("@models/verifyUser")
const randomstring = require("randomstring")

module.exports = {
  category: "Fun",
  description: "Register pertanyaan dan jawaban disini", // Required for slash commands
  options: [
    {
      name: "pertanyaan",
      description: "Apa pertanyaan yang anda tanyakan?",
      type: 3,
      required: true,
    },
    {
      name: "jawaban",
      description: "Apa jawaban yang anda sampaikan?",
      type: 3,
      required: true,
    },
  ],
  slash: true, // Create both a slash and legacy command
  testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ interaction, client }) => {},
}
