const express = require('express');
const { placeOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authenticateUser = require('../middleware/authMiddleware'); // Middleware to verify JWT

const router = express.Router();

console.log("From orderRoute.js - came into it ");

router.post('/place-order', authenticateUser, placeOrder);  // Protect route with JWT
router.get('/orders', getAllOrders);
router.put("/:orderId/status", updateOrderStatus);

module.exports = router;
