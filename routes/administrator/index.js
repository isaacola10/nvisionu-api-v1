const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

router.use("/event", require("./event.route"))
router.use("/payment", require("./payment.route"))
router.use("/rsvp", require("./rsvp.route"))

module.exports = router;