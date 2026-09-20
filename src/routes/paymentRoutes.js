const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/create-payment-intent', authenticateToken, paymentController.createPaymentIntent);
router.post('/confirm-payment', authenticateToken, paymentController.confirmPayment);

// Webhook endpoint (no authentication, Stripe will call this)
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);

module.exports = router;