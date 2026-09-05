const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers, verifyOtp, resendOtp} = require("../controllers/authController")
const { protect, admin, verifyUser } = require("../middleware/authMiddleware.js");

router.post("/register", registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers)



module.exports = router;