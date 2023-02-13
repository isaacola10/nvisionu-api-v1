const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const EventController = require("../../app/http/controllers/administrator/event.controller")

router.get("/", EventController.index)
router.get("/:uuid", EventController.show)
router.post("/", EventController.store)
router.put("/:uuid", EventController.update)
router.delete("/:uuid", EventController.destroy)

module.exports = router;