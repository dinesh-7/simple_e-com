const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
// Handle placing a new order
const register = async (req, res) => {
    try {
        const { customerName, address, mobile, email, password, role } = req.body;

        if (!customerName || !address || !mobile || !email || !password || !role) {
            // console.log(customerName , customerName, )
            return res.status(400).json({ message: "All fields are required." });
        }

        const regUser = await user.register(customerName, address, mobile, email, password, role);
        res.status(201).json({ message: "Register User  successfully!", order: regUser });
    } catch (error) {
        res.status(500).json({ message: "Error Registering user ", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const loginUser = await user.login(email, password);
        if (!loginUser) {
            return res.status(400).json({ message: "Invalid Credentials email or password" });
        }
        const token = jwt.sign({ email: loginUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successfully!", token ,User_Login_Info: loginUser });

    } catch (error) {
        res.status(500).json({ message: "Error Logging In ", error: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "You are not authorized to access this route Token not found"});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        if(!decoded || !decoded.email){
            return res.status(401).json({message: "Email not found in the token"});
        }
        const userInfo = await user.getUserInfo(decoded.email);
        if(!userInfo){
            return res.status(401).json({message: "User not found"});
        }
        const userDetails = {
            customerName: userInfo.customerName,
            address: userInfo.address,
            mobile: userInfo.mobile,
            email: userInfo.email,
        }
        res.status(200).json({message: "User Info", user: userDetails});
    }
    catch(error){
        res.status(500).json({message: "Error Fetching User Info", error: error.message});
    }
}



module.exports = { register, login, getUserInfo };
