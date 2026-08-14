const Order = require('../models/order.js');
const User = require('../models/user.js');
const Product = require("../models/Product.js")

const getAdminStats = async(req, res)=>{
    try {
        const totalOrders = await Order.countDocuments({});
        const totalUsers = await User.countDocuments({ role: "user"});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        
        
        res.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalRevenue
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAdminStats };
