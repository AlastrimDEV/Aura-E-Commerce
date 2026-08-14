const Razorpay = require("razorpay");
const crypto = require("crypto");
dotenv = require("dotenv").config();

const createdOrder = async(req,res)=>{
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex'),
        }

        const order = await instance.orders.create(options);
        res.staus(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}