const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/db');
const Order = require('../models/Order');

const CURRENCY = (process.env.STRIPE_CURRENCY || 'zar').toLowerCase();

const createPaymentIntent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'orderId is required.' });
        }

        const orderResult = await pool.query(
            `SELECT order_id, user_id, total_amount, payment_status,
                    stripe_payment_intent_id
             FROM orders
             WHERE order_id = $1 AND user_id = $2`,
            [orderId, userId]
        );

        if (orderResult.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const order = orderResult.rows[0];

        if (order.payment_status === 'paid') {
            return res.status(400).json({ message: 'Order already paid.' });
        }

        // Reuse existing PaymentIntent if it exists and is still unpaid.
        if (order.stripe_payment_intent_id) {
            try {
                const existing = await stripe.paymentIntents.retrieve(
                    order.stripe_payment_intent_id
                );
                if (
                    existing.status !== 'canceled' &&
                    existing.status !== 'succeeded'
                ) {
                    return res.json({
                        clientSecret: existing.client_secret,
                        orderId: order.order_id,
                        totalAmount: Number(order.total_amount)
                    });
                }
            } catch (err) {
                // Intent gone or unreachable, fall through to create a new one.
            }
        }

        const amountMinor = Math.round(Number(order.total_amount) * 100);

        const intent = await stripe.paymentIntents.create({
            amount: amountMinor,
            currency: CURRENCY,
            metadata: {
                orderId: String(order.order_id),
                userId: String(userId)
            },
            automatic_payment_methods: { enabled: true }
        });

        await pool.query(
            `UPDATE orders
             SET stripe_payment_intent_id = $1
             WHERE order_id = $2`,
            [intent.id, order.order_id]
        );

        return res.json({
            clientSecret: intent.client_secret,
            orderId: order.order_id,
            totalAmount: Number(order.total_amount)
        });

    } catch (error) {
        console.error('createPaymentIntent error:', error);
        return res.status(500).json({ message: 'Unable to start payment.' });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ message: 'paymentIntentId is required.' });
        }

        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (intent.status !== 'succeeded') {
            return res.status(400).json({
                message: `Payment not completed. Current status: ${intent.status}`
            });
        }

        const orderId = parseInt(intent.metadata.orderId, 10);
        const userId = parseInt(intent.metadata.userId, 10);

        await Order.finalizeOrder(orderId, userId);

        return res.json({ status: 'succeeded', orderId });

    } catch (error) {
        console.error('confirmPayment error:', error);
        return res.status(500).json({ message: 'Unable to confirm payment.' });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'payment_intent.succeeded') {
            const intent = event.data.object;
            const orderId = parseInt(intent.metadata.orderId, 10);
            const userId = parseInt(intent.metadata.userId, 10);

            await pool.query(
                `UPDATE orders SET payment_status = 'paid' WHERE order_id = $1`,
                [orderId]
            );

            await Order.finalizeOrder(orderId, userId);
            console.log(`Order ${orderId} finalized via webhook.`);
        }

        if (event.type === 'payment_intent.payment_failed') {
            const intent = event.data.object;
            const orderId = parseInt(intent.metadata.orderId, 10);

            await pool.query(
                `UPDATE orders SET payment_status = 'failed' WHERE order_id = $1`,
                [orderId]
            );
            console.log(`Payment failed for order ${orderId}.`);
        }

        return res.json({ received: true });

    } catch (error) {
        console.error('Webhook handler error:', error);
        return res.status(500).json({ received: false });
    }
};

module.exports = { createPaymentIntent, confirmPayment, handleWebhook };