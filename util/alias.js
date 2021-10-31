const alias = require("module-alias")
const path = require("path")

alias.addAlias("@root", path.join(__dirname, ".."))
alias.addAlias("@serve", path.join(__dirname, "../src"))
alias.addAlias("@util", path.join(__dirname, "./"))
alias.addAlias("@middle", path.join(__dirname, "../src/middleware"))
alias.addAlias("@routes", path.join(__dirname, "../src/routes"))
alias.addAlias("@models", path.join(__dirname, "../models"))
alias.addAlias("@com", path.join(__dirname, "../command_function"))