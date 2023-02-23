const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const RsvpController = require("../../app/http/controllers/administrator/rsvp.controller");

router.get("/", RsvpController.index);
router.get("/:uuid", RsvpController.show);
router.post("/payment/check", RsvpController.check);
router.get("/event/create", RsvpController.create);
router.post("/store/manual/", RsvpController.store);

module.exports = router;
