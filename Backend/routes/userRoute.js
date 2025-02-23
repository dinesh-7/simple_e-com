const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);  // Endpoint to place an order
router.get('/login', login);  // Endpoint to get all orders

module.exports = router;
