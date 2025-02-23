const express = require('express');
const { register, login, getUserInfo} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);  // Endpoint to place an order
router.post('/login', login);  // Endpoint to get all orders
router.get('/profile', getUserInfo);  // Endpoint to get user info

module.exports = router;
