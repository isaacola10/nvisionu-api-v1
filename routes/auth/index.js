const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const AuthController = require("../../app/http/controllers/auth/login.controller")

router.post("/login", AuthController.login)

module.exports = router;