const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const PaymentController = require("../../app/http/controllers/administrator/payment.controller")

router.get("/", PaymentController.index)
router.get("/:uuid", PaymentController.show)

module.exports = router;