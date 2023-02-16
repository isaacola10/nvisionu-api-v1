const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const AuthenticateUser = require("../app/http/middleware/authenticate");
const MailjetController = require("../app/http/controllers/test/mailjet.controller");

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// Auth
router.use("/auth", require("./auth"));

// User Route
router.use(require("./users"));

// Admin route
router.use("/administrator", require("./administrator"));

// Rsvp route
router.use("/rsvp", require("./rsvp.route"));

// Test
router.post("/test-mail", MailjetController.index);

module.exports = router;
