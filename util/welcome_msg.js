const { MessageEmbed, MessageAttachment } = require("discord.js")
const { user: userTag, channel } = require("./tag.js")

const welcomeMsg = async (user, guild) => {
  const embed = new MessageEmbed()
    .setColor("#4FC3F7")
    .setDescription(
      `Selamat datang, ${userTag(
        user.id
      )} di server dinasti kami, jika membuat akun maka anda akan dikarantina selama 5 menit sejak masuk server atau seminggu jika anda penguna baru discord (terhitung dari tanggal pembuatan akun). Nanti kami akan mengirimkan link verifikasi di **DM** jika sudah selesai dikarantina.`
    )
    .addFields([
      {
        name: "Baca Aturan Yang Berlaku",
        value: `Baca ${channel("881280968252600340")} untuk aturan yang ada`,
      },
      {
        name: "Mau lihat apa isi channel ini?",
        value: `Baca ${channel(
          "879010982461075496"
        )} untuk melihat isi channel yang ada`,
      },
      {
        name: "Punya pertanyaan?",
        value: `Silahkan bertanya ke staff ke ${channel(
          "884044109055152138"
        )} jika sudah jadi warga terdaftar`,
      },
    ])
    .setFooter("2021 © DSI")
    .setTimestamp(new Date().getTime())

  const image = new MessageAttachment(
    "https://firebasestorage.googleapis.com/v0/b/dinastishitpost.appspot.com/o/welcome.png?alt=media&token=f82b849a-9b0e-4c04-ab9d-08dd91a81860"
  )

  const member = guild?.members.cache.get(user.id)
  member?.send({ files: [image], embeds: [embed] })
}

module.exports = { welcomeMsg }
