const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "You are not authorized to access this route Token not found"});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        if(!decoded || !decoded.email){
            console.log("From Middleware Email not found in the token");
            return res.status(401).json({message: "Email not found in the token"});
        }
        const userInfo = await User.getUserInfo(decoded.email);
        if(!userInfo){
            console.log("From Middleware User not found");
            return res.status(401).json({message: "User not found"});
        }
        // Attach user details to `req.user`
        req.user = {
            customerName: userInfo.customerName,
            address: userInfo.address,
            mobile: userInfo.mobile,
            email: userInfo.email
        };
        next(); // Proceed to the next middleware or controller function
    }
    catch(error){
        res.status(500).json({message: "Error Fetching User Info", error: error.message});
    }
};

module.exports = authenticateUser;
