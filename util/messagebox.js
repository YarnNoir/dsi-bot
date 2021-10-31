const { MessageEmbed } = require("discord.js")
const path = require("path")

const msgBox = (title, desc, type = null) => {
  let color
  let icon

  switch (type) {
    case "info":
      color = "BLUE"
      icon = `https://firebasestorage.googleapis.com/v0/b/dinastishitpost.appspot.com/o/info.png?alt=media&token=42d7555f-e492-4d80-ad72-98d357df2613`
      break
    case "warning":
      color = "YELLOW"
      icon = `https://firebasestorage.googleapis.com/v0/b/dinastishitpost.appspot.com/o/warning.png?alt=media&token=d47a81c6-df22-49e3-ac6c-f380c5d8df1a`
      break
    case "error":
      color = "RED"
      icon = `https://firebasestorage.googleapis.com/v0/b/dinastishitpost.appspot.com/o/error.png?alt=media&token=8155c00e-8119-4bce-a8ed-1584fd6c07d4`
      break
  }

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(icon)
    .setTimestamp(new Date().getTime())
  if (type != null) embed.setDescription(desc).setThumbnail(icon)

  return embed
}

module.exports = { msgBox }
