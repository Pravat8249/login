const express = require("express")
const route = express.Router()
const { registerUser, userLogin} = require("../controllers/userController")

const { userAuthentication } = require("../middlewares/authentication")
const { userAuthorization } = require("../middlewares/authorization")

//User
route.post("/register", registerUser)
route.post("/login", userLogin)

module.exports = route