const Order = require('../models/orderModel');

// Handle placing a new order
const placeOrder = async (req, res) => {
    try {
        const { customerName, address, mobile, items, totalAmount } = req.body;

        if (!customerName || !address || !mobile || !items || !totalAmount) {
            // console.log(customerName , customerName, )
            return res.status(400).json({ message: "All fields are required." });
        }

        const newOrder = await Order.placeOrder(customerName, address, mobile, items, totalAmount);
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// Handle retrieving all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

module.exports = { placeOrder, getAllOrders };
