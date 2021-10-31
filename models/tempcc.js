const { Schema, model } = require("mongoose")

const tempCCscema = new Schema({
  _id: { type: String, required: true },
  expiredAt: { type: Number, required: true },
  vtuber: { type: Boolean, default: false },
  url: { type: String, required: true },
  twitter_url: String,
})

const UserQuarentine = model(
  "temporaryContent",
  tempCCscema,
  "temporaryContent"
)
module.exports = { tempCCscema: UserQuarentine }
