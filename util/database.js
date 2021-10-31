const { connect } = require("mongoose")
require("dotenv/config")

const database = connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
module.exports = { database }
