const Order = require("../models/order");
const Product = require("../models/Product");
const sendEmail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, address, totalAmount, paymentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in the order" });
        }

        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "Some products not found" });
        }

        // Decrement stock for each purchased item
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.qty }
            });
        }

        const order = new Order({
            user: req.user._id,
            items,
            address,
            totalAmount,
            paymentId: paymentId || `PAY-${Date.now()}`,
            status: "Pending"
        });

        const createdOrder = await order.save();
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate("user", "name email")
            .populate("items.productId", "name price imageUrl category");

        res.status(201).json(populatedOrder);

        // Send email asynchronously
        try {
            const message = `
            Order Confirmation - AURA
            
            Thank you for your order, ${req.user.name}!
            Order ID: ${createdOrder._id}
            Total Amount: Rs. ${createdOrder.totalAmount}
            Payment ID: ${createdOrder.paymentId}
            Status: ${createdOrder.status}
            `;
            sendEmail(req.user.email, "AURA - Order Confirmation", message).catch(err => console.error("Email error:", err));
        } catch (e) {
            console.error("Email sending skipped", e);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name price imageUrl category")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get orders of logged in user
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("user", "name email")
            .populate("items.productId", "name price imageUrl category")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.productId", "name price imageUrl category");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus };