// const axios = require("axios")
const { google } = require("googleapis")

const client = process.env.YT_CLIENT
const secret = process.env.YT_SECRET
const redirect = "http://localhost:3000/auth/redirect"

const oauth2Client = new google.auth.OAuth2(client, secret, redirect)

const YoutubeRole = async (data) => {
  let { id, username, name } = data
  let followerCount = null

  oauth2Client.setCredentials({
    refresh_token: process.env.YT_TOKEN,
  })

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  })

  const result = await youtube.channels.list(
    id
      ? {
          id,
          part: "statistics,snippet",
        }
      : {
          forUsername: username,
          part: "statistics,snippet",
        }
  )

  if (!result.data) {
    console.log("data not found")
    return false
  }

  followerCount = await result.data.items[0].statistics.subscriberCount

  if (!followerCount) return -1

  return {
    name: name || result.data.items[0].snippet.title,
    followers: followerCount,
    id: id || result.data.items[0].snippet.id,
  }
}

module.exports = YoutubeRole
