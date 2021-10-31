const { Schema, model } = require("mongoose")

const contentSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  vtuber: { type: Boolean, required: true },
  twitter_url: String,
  content_id: { type: String, required: true },
  follower: { type: String, required: true },
  time: { type: Number, required: true },
})

const contentUser = model("Content", contentSchema, "Content")
module.exports = { contentSchema: contentUser }
