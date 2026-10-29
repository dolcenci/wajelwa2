const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes (Admin ONLY)
router.get('/admin/logs', verifyAdmin, productController.getAuditLogs);
router.post('/', verifyAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyAdmin, productController.deleteProduct);

module.exports = router;