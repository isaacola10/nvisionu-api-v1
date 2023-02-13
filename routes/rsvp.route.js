const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const RsvpController = require("../app/http/controllers/rsvp.controller")

router.post("/verify", RsvpController.verify)

module.exports = router;