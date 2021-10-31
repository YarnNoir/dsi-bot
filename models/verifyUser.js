const { Schema, model } = require("mongoose")

const verifySchema = new Schema({
  _id: { type: String, required: true },
  verifyId: { type: String, required: true },
  date: { type: Number, required: true }
})

const verifyUser = model("verifyUser", verifySchema)
module.exports = verifyUser
