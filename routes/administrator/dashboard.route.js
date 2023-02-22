const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const DashboardController = require("../../app/http/controllers/administrator/dashboard.controller");

router.get("/", DashboardController.index);
router.post("/tickets", DashboardController.tickets);

module.exports = router;
