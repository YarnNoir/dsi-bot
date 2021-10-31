const { MessageAttachment } = require("discord.js")
const Canvas = require("canvas")
const path = require("path")
const { user: TagUser } = require("./tag")

module.exports = async (guild, user) => {
  const images = Canvas.createCanvas(720, 480)
  const ctx = images.getContext("2d")

  const template = await Canvas.loadImage(
    path.join(__dirname, "../assets/welcome_template.png")
  )
  ctx.drawImage(template, 0, 0, 720, 480)

  await Canvas.registerFont(
    path.join(__dirname, "../assets/InriaSans-Bold.ttf"),
    {
      family: "InriaSans",
    }
  )
  ctx.font = '28px "InriaSans"'
  ctx.textAlign = "center"
  ctx.fillStyle = "#fff"
  ctx.fillText(`${user.username}#${user.discriminator}`, 360, 350)

  ctx.beginPath()
  ctx.arc(360, 200, 100, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.clip()

  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ format: "png", size: 1024 })
  )
  ctx.drawImage(avatar, 260, 100, 200, 200)

  const welcomeChn = guild?.channels.cache.get(process.env.WELCOME_CHANNEL)
  return welcomeChn?.send({
    content: TagUser(user.id),
    files: [
      new MessageAttachment(images.toBuffer(), `welcome-${user.username}.jpeg`),
    ],
  })
}
