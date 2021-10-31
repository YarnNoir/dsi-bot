const { Router } = require("express")
const verifyUser = require("@models/verifyUser")
require("dotenv/config")

const { MessageActionRow, MessageButton } = require("discord.js")
const { msgBox } = require("@root/util/messagebox")

const { isAuth } = require("@middle/auth")
const notMember = require("@middle/notMember")
const quarentine = require("@middle/quarentine")
const masyarakat = require("@middle/masyarakat")

const router = Router()

router.get(`/`, isAuth, notMember, quarentine, masyarakat, async (req, res) => {
  const dataVerify = await verifyUser.findOne({ _id: req.member.id })

  res.render("verify/index", {
    title_head: "Verifikasi Dinasti (beta)",
    title: "Verifikasi Dinasti",
    user: req.user,
    verify_id: req.query.id || "",
    data_verify: dataVerify || {},
  })
})

router.post("/", isAuth, async (req, res) => {
  const dataVerify = await verifyUser.findOne({ _id: req.member.id })

  if (!dataVerify) res.redirect("/verify")

  const Role_rakyat = `${process.env.VERIFY_ROLE}`
  await req.member.roles.add(Role_rakyat)

  res.render("verify/verify", {
    title_head: "Verifikasi Dinasti (beta)",
    title: "Verifikasi Dinasti",
    user: req.user,
  })
})

router.get("/send", (req, res) => {
  res.redirect("/verify")
})

router.post("/send", async (req, res) => {
  const verifyUsers = await verifyUser.findOne({ _id: req.member.id })

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setURL(
        `${
          process.env.BASE_URL || `http://127.0.0.1:${process.env.PORT || 3001}`
        }/verify?id=${verifyUsers?.verifyId}`
      )
      .setEmoji("✅")
      .setLabel("Verify Now")
      .setStyle("LINK")
  )

  await req.member.send({
    embeds: [
      msgBox(
        "Verifikasi Member",
        "Klik tombol dibawah untuk verifikasi\nUntuk **Windows 11** jika tidak bisa dibuka, klik kanan pada tombol dibawah, lalu klik **Copy Link** untuk di pastekan di Browser kamu",
        "info"
      ),
    ],
    components: [row],
  })

  res.render("verify/send", {
    title_head: "Verifikasi Dinasti (beta)",
    title: "Verifikasi Dinasti",
    user: req.user,
  })
})

module.exports = { verifyRoute: router }
