const pool = require('../config/db');

class Payment {
    // Create a payment record
    static async createPayment(orderId, stripePaymentIntentId, amount, currency, status) {
        const query = `
            INSERT INTO payments (order_id, payment_method, transaction_id, amount, currency, payment_status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING payment_id, order_id, transaction_id, payment_status, amount
        `;
        const values = [orderId, 'stripe', stripePaymentIntentId, amount, currency, status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Update payment status
    static async updatePaymentStatus(stripePaymentIntentId, status) {
        const query = `
            UPDATE payments 
            SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE transaction_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, stripePaymentIntentId]);
        return result.rows[0];
    }

    // Get payment by order ID
    static async getPaymentByOrderId(orderId) {
        const query = 'SELECT * FROM payments WHERE order_id = $1';
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }
}

module.exports = Payment;