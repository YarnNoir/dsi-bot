module.exports = (interaction, member, channel) => {
  interaction.reply({
    content: "Coming soon",
    ephemeral:
      interaction.guildId != null ||
      interaction.channelId !== `${process.env.CHANNEL_BOT}`,
  })
}
