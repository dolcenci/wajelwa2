const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.body;

        // Get the order details
        const order = await Order.getOrderWithItems(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the order belongs to the user
        if (order.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if payment already exists
        const existingPayment = await Payment.getPaymentByOrderId(orderId);
        if (existingPayment && existingPayment.payment_status === 'succeeded') {
            return res.status(400).json({ message: 'Order already paid' });
        }

        // Calculate amount in cents (Stripe uses the smallest currency unit)
        const amount = Math.round(parseFloat(order.total_amount) * 100);

        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                orderId: orderId.toString(),
                userId: userId.toString(),
            },
        });

        // Save payment record in database
        const payment = await Payment.createPayment(
            orderId,
            paymentIntent.id,
            amount / 100, // Store in dollars
            'usd',
            'pending'
        );

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            paymentId: payment.payment_id,
            orderId: orderId
        });

    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
};

// Confirm payment (webhook will handle this, but we also provide a manual endpoint)
const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Retrieve the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update payment status in database
            await Payment.updatePaymentStatus(paymentIntentId, 'succeeded');

            // Update order status
            const orderId = parseInt(paymentIntent.metadata.orderId);
            await Order.updateStatus(orderId, 'Processing');

            res.json({
                message: 'Payment confirmed successfully',
                status: 'succeeded'
            });
        } else {
            res.json({
                message: 'Payment not yet completed',
                status: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({
            message: 'Failed to confirm payment',
            error: error.message
        });
    }
};

// Webhook handler for Stripe events
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            // If no webhook secret, just parse the event
            event = req.body;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id);

                // Update payment status in database
                await Payment.updatePaymentStatus(paymentIntent.id, 'succeeded');

                // Update order status
                const orderId = parseInt(paymentIntent.metadata.orderId);
                await Order.updateStatus(orderId, 'Processing');
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                await Payment.updatePaymentStatus(failedPayment.id, 'failed');
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = { createPaymentIntent, confirmPayment, handleWebhook };