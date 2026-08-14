const express = require("express");
const {protect, admin} = require("../middleware/authMiddleware");
const { getAdminStats } = require("../controllers/analyticsController.js")

const router = express.Router();

router.get("/", protect, admin, getAdminStats);

module.exports = router;

