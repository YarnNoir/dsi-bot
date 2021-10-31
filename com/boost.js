const { MessageEmbed } = require("discord.js")
const { user } = require("../util/tag")

module.exports = {
  category: "Welcome",
  permissions: ["ADMINISTRATOR"],
  description: "Cuma coba welcome chat", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  //testOnly: true, // Only register a slash command for the testing guilds

  callback: async ({ guild, interaction }) => {
    const member = guild?.members.cache.get(interaction.user.id)

    const boostedTime = member?.premiumSinceTimestamp
    const boost = member?.guild.premiumTier
    const boostValue = member?.guild.premiumSubscriptionCount

    const tier1 = 2
    const tier2 = 7
    const tier3 = 14

    let sisaBoost, lvlTujuan
    if (boostValue < tier1) {
      sisaBoost = tier1 - boostValue
      lvlTujuan = 1
    }

    if (boostValue >= tier1 && boostValue < tier2) {
      sisaBoost = tier2 - boostValue
      lvlTujuan = 2
    }

    if (boostValue >= tier2 && boostValue < tier3) {
      sisaBoost = tier3 - boostValue
      lvlTujuan = 3
    }

    let boostString
    if (boost === "TIER_3")
      boostString = "Dinasti ini sudah mencapai tier maksimal"
    else
      boostString = `Tinggal ${sisaBoost} boost lagi untuk mencapai level ${lvlTujuan}`

    const embed = new MessageEmbed()
      .setDescription(`${user(member.id)} telah ngeboost server ini`)
      .setFooter(boostString)
      .setColor("PURPLE")
      .setTimestamp(boostedTime || new Date().getTime())

    const channel = guild?.channels.cache.get(process.env.BOOST_LOG)
    channel.send({ content: user(member.id), embeds: [embed] })
  },
}
