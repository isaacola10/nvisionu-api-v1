const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap


// Admin route
router.use("/event", require("./event.route"))

module.exports = router;