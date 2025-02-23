const user = require('../models/userModel');

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

// Handle retrieving all orders
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
        res.status(200).json({ message: "Login successfully!", order: loginUser });

    } catch (error) {
        res.status(500).json({ message: "Error Logging In ", error: error.message });
    }
};

module.exports = { register, login };
