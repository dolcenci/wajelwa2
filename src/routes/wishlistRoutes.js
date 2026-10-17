
const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const controller = require('../controllers/wishlistController');

router.get('/', authenticateToken, controller.getWishlist);
router.post('/', authenticateToken, controller.addToWishlist);
router.delete(
    '/:productId',
    authenticateToken,
    controller.removeFromWishlist
);

module.exports = router;
