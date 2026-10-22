const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// The webhook is mounted separately in server.js with express.raw() — not here.
router.post(
    '/create-payment-intent',
    authenticateToken,
    paymentController.createPaymentIntent
);

router.post(
    '/confirm-payment',
    authenticateToken,
    paymentController.confirmPayment
);

module.exports = router;