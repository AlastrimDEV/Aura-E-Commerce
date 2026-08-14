const Order = require("../models/order");
const Product = require("../models/Product");
const sendEmail = require('../utils/sendEmail');

// Create a new order
const createOrder = async (req, res) => {
    try{
        const { items, address, totalAmount, paymentId } = req.body;

        if (!items || items.length === 0){
            return res.status(400).json({message: "No items in the order"});
        }
        const productIds = items.map(item=> item.productId);
        const products = await Product.find({_id: { $in: productIds }});

        if (products.length !== productIds.length){
            return res.status(404).json({message: "Some products not found"});
        }
        const order = new Order({
            user: req.user._id,
            items,
            address,
            totalAmount,
            paymentId,
            status: "Pending"
        })
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

        // send email to user
        const message = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order ID: ${createdOrder._id}</p>
        <p>Total Amount: ${createdOrder.totalAmount}</p>
        <p>Payment ID: ${createdOrder.paymentId}</p>
        <p>Status: ${createdOrder.status}</p>
        `

        await sendEmail(req.user.email, "Order Confirmation", message);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get orders of logged in user
const getMyOrders = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.user._id }).populate("user", "name email");
        res.json(orders);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get order by ID
const getOrderById = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order){
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.user._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Not authorized" });
        }
        res.json(order);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update order status
const updateOrderStatus = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if (!order){
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus };