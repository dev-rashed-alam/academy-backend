const express = require("express");
const {doStripePayment} = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/common/authMiddleware");
const router = express.Router();

router.post('/stripe', authMiddleware ,doStripePayment)

module.exports = router
