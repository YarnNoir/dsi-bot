const { contentSchema } = require("@root/models/contentUser")
const axios = require("axios")

const TwitchRole = async (data) => {
  let { id, username } = data
  let followerCount = null

  const accessToken = await axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_secret=${process.env.TWITCH_SECRET}&client_id=${process.env.TWITCH_KEY}&grant_type=client_credentials`
    )
    .then((req) => req.data.access_token)

  if (!id)
    id = await axios
      .get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          "Client-ID": process.env.TWITCH_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((req) => req.data.data[0].id)

  const response = await axios
    .get(`https://api.twitch.tv/helix/users/follows?to_id=${id}`, {
      headers: {
        "Client-ID": process.env.TWITCH_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((req) => req.data)

  if (!response) {
    console.log("data not found")
    return false
  }

  followerCount = response.total

  return {
    name: username,
    followers: followerCount,
    id: id,
  }
}

module.exports = TwitchRole
