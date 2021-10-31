const { Router } = require("express")
const { contentSchema } = require("@models/contentUser")
require("dotenv/config")

const router = Router()

const setRoleContent = require("@util/content/role")
const getYTrole = require("@util/api/getYTrole")
const getTwitchRole = require("@util/api/getTwitchRole")

const { isAuth } = require("@middle/auth")
const notMember = require("@middle/notMember")
const quarentine = require("@middle/quarentine")
const verify = require("@middle/verify")

router.get(`/`, isAuth, notMember, quarentine, verify, async (req, res) => {
  const contentUser = await contentSchema.findOne({ _id: req.user._id })

  res.render("ccrole/index", {
    title_head: "Content Creator Role (beta)",
    title: "Content Creator Role",
    user: req.user,
    contentUser: contentUser || null,
  })
})
router.get(`/edit`, isAuth, notMember, quarentine, verify, async (req, res) => {
  const contentUser = await contentSchema.findOne({ _id: req.user._id })

  if (contentUser?.time + 1000 * 60 * 60 * 24 * 7 > Date.now()) {
    return res.render("ccrole/timer", {
      title_head: "Content Creator Role (beta)",
      title: "Content Creator Role",
      user: req.user,
    })
  }
  res.render("ccrole/edit", {
    title_head: "Content Creator Role (beta)",
    title: "Content Creator Role",
    user: req.user,
  })
})

router.get(
  `/how-to`,
  isAuth,
  notMember,
  quarentine,
  verify,
  async (req, res) => {
    res.render("ccrole/how", {
      title_head: "Content Creator Role (beta)",
      title: "Content Creator Role",
      user: req.user,
    })
  }
)
router.get(
  `/connect`,
  isAuth,
  notMember,
  quarentine,
  verify,
  async (req, res) => {
    const isMobile = req.useragent.isMobile

    res.render("ccrole/connect", {
      title_head: "Content Creator Role (beta)",
      title: "Content Creator Role",
      user: req.user,
      isMobile,
    })
  }
)

router.get(
  `/0-followers`,
  isAuth,
  notMember,
  quarentine,
  verify,
  async (req, res) => {
    res.render("ccrole/0-followers", {
      title_head: "Content Creator Role (beta)",
      title: "Content Creator Role",
      user: req.user,
    })
  }
)
router.get(
  `/twitt-err`,
  isAuth,
  notMember,
  quarentine,
  verify,
  async (req, res) => {
    res.render("ccrole/twitt-err", {
      title_head: "Content Creator Role (beta)",
      title: "Content Creator Role",
      user: req.user,
    })
  }
)

router.post("/", isAuth, async (req, res) => {
  const [id, type] = req.body.content.split("/")
  const vtuber = req.body.vtuber === "on"
  const isTwitter = req.body.twitter

  const isATwitter =
    /^(https:\/\/(m|mobile|www)?twitter\.com\/|@)?[A-Za-z0-9_]{4,15}$/g

  if (isTwitter && !isTwitter?.match(isATwitter))
    return res.redirect("/content/twitt-err")

  let content_data
  if (req.body.type === "youtube" || type === "youtube")
    content_data = await getYTrole({
      id: id || req.body.id,
    })
  else
    content_data = await getTwitchRole({
      id: id || req.body.id,
    })

  if (content_data === -1) return res.redirect("/content/0-followers")

  let twitter_url
  if (isTwitter) {
    if (isTwitter.startsWith("http"))
      twitter_url = isTwitter.replace(/\/(m|mobile|www)?t/, "/t")
    else twitter_url = `https://twitter.com/${isTwitter.replace("@", "")}`
  }

  setRoleContent(req.member, content_data.followers)

  if (req.body.content) {
    await contentSchema.findOneAndUpdate(
      { _id: req.member.id },
      {
        _id: req.member.id,
        name: content_data.name,
        type: type,
        vtuber: vtuber,
        twitter_url,
        content_id: content_data.id,
        follower: content_data.followers,
        time: Date.now(),
      },
      { upsert: true, new: true }
    )
  } else {
    await contentSchema.updateOne(
      { _id: req.member.id },
      { follower: content_data.followers, time: Date.now() }
    )
  }

  res.redirect("/content")
})

// router.get(
//   "/instagram",
// passport.authenticate("instagram") (req, res) => {
//     res.send("coming soon")
//   }
// )

// router.get("/instagram/callback", (req, res) => {
//   res.send("ok")
// })

module.exports = { ccroleRoute: router }
