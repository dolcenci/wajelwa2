const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes (admin only - requires authentication)
router.post('/', authenticateToken, upload.array('images', 5), productController.createProduct);
router.put('/:id', authenticateToken, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;