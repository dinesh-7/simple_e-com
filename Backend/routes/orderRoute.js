const express = require('express');
const { placeOrder, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/place-order', placeOrder);  // Endpoint to place an order
router.get('/orders', getAllOrders);  // Endpoint to get all orders

module.exports = router;
