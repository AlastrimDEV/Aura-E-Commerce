const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { initiateEsewaPayment, verifyEsewaPayment, createPaymentOrder, verifyPayment } = require('../controllers/paymentController.js');

router.post("/esewa/initiate", protect, initiateEsewaPayment);
router.post("/esewa/verify", protect, verifyEsewaPayment);

// Legacy/Compatibility routes
router.post("/order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;