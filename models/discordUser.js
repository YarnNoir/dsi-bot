const { Schema, model } = require("mongoose")

const userSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  myServer: { type: Schema.Types.Mixed, required: true },
  content: { type: Schema.Types.Mixed, required: true },
})

const DiscordUser = model("Discord", userSchema)
module.exports = { userSchema: DiscordUser }
