const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.get('/', authenticateToken, cartController.getCart);
router.post('/add', authenticateToken, cartController.addToCart);
router.put('/:cartItemId', authenticateToken, cartController.updateCartItem);
router.delete('/:cartItemId', authenticateToken, cartController.removeFromCart);
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;