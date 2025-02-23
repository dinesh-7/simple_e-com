const Order = require('../models/orderModel');

// Handle placing a new order
const placeOrder = async (req, res) => {
    try {
        const { cart, totalAmount } = req.body;
        const { customerName, address, mobile } = req.user; // Extract user details from middleware

        // const { customerName, address, mobile, items, totalAmount } = req.body;
        if (!cart || !totalAmount) {
            return res.status(400).json({ message: "Cart and total amount are required." });
        }
        if (!customerName || !address || !mobile) {
            // console.log(customerName , customerName, )
            return res.status(400).json({ message: "Middleware didn't return the userInfo" });
        }

        const newOrder = await Order.placeOrder(customerName, address, mobile, cart, totalAmount);
        console.log("New Order Placed Successfully");
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.log("Got error in Placing the Order " + error);
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

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedOrder = await Order.updateOrderStatus(orderId, status );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: `Order marked as ${status}`, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

module.exports = { placeOrder, getAllOrders, updateOrderStatus };
