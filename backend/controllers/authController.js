const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;                                                                 
    try{
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }
        const exisitingUser = await User.findOne ({ email });
        if (exisitingUser){
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });
        if (user){
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = otp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000;
            user.otpSentAt = Date.now()
            await user.save();

            const message = `Your OTP for AURA registration is ${otp} . It will expire in 10 minutes.`;

            await sendEmail(email, "AURA OTP Verification", message);
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
        } else{
            res.status(400).json({ message: "Invalid User" })
        }
    }catch(error){
        res.status(500).json({ message: "Internal server error" })
    }
}

const verifyOtp = async(req, res)=>{
    const {email, otp} = req.body;
    try{
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({ message: "User not found!"});
        }
        if(!user.otpExpiry || Date.now() > user.otpExpiry){
            return res.status(400).json({message: "OTP has expired!"})
        }
        if (otp !== user.otp){
            return res.status(400).json({message: "Invalid OTP"})
        }
        user.verified = true;
        user.otp = ''
        user.otpExpiry = null;
        user.otpSentAt = null;
        await user.save();
        res.status(200).json({ message: "OTP verified successfully" })
    }catch(error){
        res.status(500).json({ message: "Internal server error" })
    }
}

const resendOtp = async(req, res)=>{
    const {email} = req.body;
    try {
       const user = await User.findOne({ email });
       if (!user){
        return res.status(400).json({ message: "User not found!"});
    }
    if (user.verified) {
        return res.status(400).json({
            message: "User already verified"
        });
    }
    if ( user.otpSentAt && Date.now() - user.otpSentAt < 60*1000){
        return res.status(429).json({
            message: "Please wait 60 seconds before requesting another OTP"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10*60*1000;
    user.otpSentAt = Date.now();
    await user.save();

    const message = `Your new OTP for AURA registration is ${otp} . It will expire in 10 minutes.`;

    await sendEmail(email, "AURA OTP Verification", message);

    res.status(200).json({
        message: "OTP sent successfully"
    });

    
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });   
    }
}


const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    try{
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({ message: "User not found!"});
        }
        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email first"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    }catch(error){
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUsers = async (req, res)=>{
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {registerUser, verifyOtp, resendOtp, loginUser, getUsers};