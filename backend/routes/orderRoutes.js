const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware.js");
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders} = require("../controllers/orderController.js")

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders)
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById)
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;