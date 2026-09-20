const pool = require('../config/db');

class Order {
    // Create a new order
    static async createOrder(userId, cartItems, totalAmount) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Create the order
            const orderQuery = `
                INSERT INTO orders (user_id, total_amount, status)
                VALUES ($1, $2, $3)
                RETURNING order_id
            `;
            const orderResult = await client.query(orderQuery, [userId, totalAmount, 'Pending']);
            const orderId = orderResult.rows[0].order_id;

            // Add items to order_items
            for (const item of cartItems) {
                const itemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(itemQuery, [orderId, item.product_id, item.quantity, item.price]);
            }

            await client.query('COMMIT');

            return orderId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Get orders for a user
    static async getUserOrders(userId) {
        const query = `
            SELECT o.*, 
                   array_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price_per_unit)) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.user_id = $1
            GROUP BY o.order_id
            ORDER BY o.order_date DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    // Get a single order by ID
    static async getOrderById(orderId) {
        const query = `
            SELECT o.*, 
                   array_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price_per_unit)) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.order_id = $1
            GROUP BY o.order_id
        `;
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }

    // Update order status (for admin)
    static async updateStatus(orderId, status) {
        const query = 'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *';
        const result = await pool.query(query, [status, orderId]);
        return result.rows[0];
    }





    // Add this method to the Order class
    static async getOrderWithItems(orderId) {
        const query = `
        SELECT o.*, 
               json_agg(json_build_object(
                   'product_id', oi.product_id,
                   'quantity', oi.quantity,
                   'price', oi.price_per_unit
               )) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_id = $1
        GROUP BY o.order_id
    `;
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }



}

module.exports = Order;