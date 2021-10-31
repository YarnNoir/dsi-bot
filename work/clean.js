const { userSchema } = require("@models/discordUser")
const { model, Schema } = require("mongoose")

module.exports = (client, instance) => {
  const timeSchema = new Schema({ _id: Number, time: Number })
  const session = new Schema({ _id: String, expires: Date, session: String })

  const time = model("time", timeSchema)

  setInterval(async () => {
    const findtime = await time.findOne({ _id: 0 })

    if (!findtime)
      await time.findOneAndUpdate(
        { _id: 0 },
        { _id: 0, time: Date.now() },
        { upsert: true }
      )
    else {
      if (time.time * 1000 * 60 * 60 * 24 * 30 < Date.now()) {
        await userSchema.deleteMany({})
        await model("session", session).deleteMany({})
        await time.deleteMany({})
        await time.findOneAndUpdate(
          { _id: 0 },
          { _id: 0, time: Date.now() },
          { upsert: true }
        )
      }
    }
  }, 1000 * 60)
}

// Configuration for this feature
module.exports.config = {
  // The display name that server owners will see.
  // This can be changed at any time.
  displayName: "Cleaning",

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: "CLEAN",
}
