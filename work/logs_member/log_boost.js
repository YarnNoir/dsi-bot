const { MessageEmbed } = require("discord.js")
const { user } = require("@root/util/tag")

module.exports = (client, instance) => {
  client.on("guildMemberUpdate", async (oldMbr, newMbr) => {
    const boostedTime = newMbr?.premiumSinceTimestamp
    const oldBoost = oldMbr?.guild.premiumTier
    const boost = newMbr?.guild.premiumTier
    const oldBoostValue = oldMbr?.guild.premiumSubscriptionCount
    const boostValue = newMbr?.guild.premiumSubscriptionCount

    const tier1 = 2
    const tier2 = 7
    const tier3 = 14
    if (boostValue <= oldBoostValue) return

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
    if (oldBoost !== boost) {
      boostString = `Sekarang dinasti ini mencapai level ${boost.replace(
        "TIER_",
        ""
      )}`
    } else {
      if (boost === "TIER_3")
        boostString = "Dinasti ini sudah mencapai tier maksimal"
      else
        boostString = `Tinggal ${sisaBoost} boost lagi untuk mencapai level ${lvlTujuan}`
    }

    const embed = new MessageEmbed()
      .setDescription(`${user(newMbr.id)} telah ngeboost server ini ♦️`)
      .setFooter(boostString)
      .setColor("PURPLE")
      .setTimestamp(boostedTime || new Date().getTime())

    const channel = newMbr?.guild.channels.cache.get(process.env.BOOST_LOG)
    channel.send({ content: user(newMbr.id), embeds: [embed] })
  })
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Boost Log",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "BOOST LOG",
}
