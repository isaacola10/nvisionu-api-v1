const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const EventController = require("../../app/http/controllers/user/event.controller")

// Auth route
router.get("/", EventController.index)
router.post("/rsvp/:uuid", EventController.book)
router.get("/rsvp/:uuid/verify", EventController.verify)

module.exports = router;