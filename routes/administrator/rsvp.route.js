const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const RsvpController = require("../../app/http/controllers/administrator/rsvp.controller")

router.get("/", RsvpController.index)
router.get("/:uuid", RsvpController.show)

module.exports = router;