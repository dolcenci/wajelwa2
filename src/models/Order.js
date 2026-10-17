const pool = require('../config/db');

class Order {
   
    // Create an order, deduct stock and clear the cart atomically
    static async createOrder(userId, cartId, delivery) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Lock this customer's cart items while checkout runs
            const cartQuery = `
                SELECT
                    ci.cart_item_id,
                    ci.product_id,
                    ci.quantity,
                    ci.color,
                    ci.size,
                    p.product_name,
                    p.price,
                    p.stock_quantity
                FROM cart_items ci
                JOIN products p ON p.product_id = ci.product_id
                JOIN carts c ON c.cart_id = ci.cart_id
                WHERE ci.cart_id = $1
                  AND c.user_id = $2
                ORDER BY ci.cart_item_id
                FOR UPDATE OF ci
            `;

            const cartResult = await client.query(cartQuery, [
                cartId,
                userId
            ]);

            const cartItems = cartResult.rows;

            if (cartItems.length === 0) {
                throw new Error('CART_EMPTY');
            }

            let totalAmount = 0;

            // Deduct stock only if enough stock remains
            for (const item of cartItems) {
                const quantity = Number(item.quantity);
                const price = Number(item.price);

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    !Number.isFinite(price) ||
                    price < 0
                ) {
                    throw new Error('INVALID_CART_ITEM');
                }

                const stockResult = await client.query(
                    `UPDATE products
                     SET stock_quantity = stock_quantity - $1
                     WHERE product_id = $2
                       AND stock_quantity >= $1
                     RETURNING product_id`,
                    [quantity, item.product_id]
                );

                if (stockResult.rowCount !== 1) {
                    throw new Error(
                        `INSUFFICIENT_STOCK:${item.product_name}`
                    );
                }

                totalAmount += price * quantity;
            }

           

// Later this should come from a shared pricing rule.
const shippingAmount = 5;

totalAmount = Number(
    (totalAmount + shippingAmount).toFixed(2)
);
            
const orderResult = await client.query(
    `INSERT INTO orders
        (user_id, total_amount, status, delivery_details)
     VALUES ($1, $2, $3, $4::jsonb)
     RETURNING order_id`,
    [
        userId,
        totalAmount,
        'Pending',
        JSON.stringify(delivery)
    ]
);


            const orderId = orderResult.rows[0].order_id;

            // Save the purchased items
            for (const item of cartItems) {
                await client.query(
                    `INSERT INTO order_items
                        (order_id, product_id, quantity, price_per_unit)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        orderId,
                        item.product_id,
                        item.quantity,
                        item.price
                    ]
                );
            }

            // Remove cart items only after all order operations succeed
            await client.query(
                'DELETE FROM cart_items WHERE cart_id = $1',
                [cartId]
            );

            await client.query('COMMIT');

            return { orderId, totalAmount };
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

   
static async getOrderById(orderId, userId) {
    const query = `
        SELECT
            o.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price_per_unit
                    )
                ) FILTER (
                    WHERE oi.product_id IS NOT NULL
                ),
                '[]'::json
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi
            ON o.order_id = oi.order_id
        WHERE o.order_id = $1
          AND o.user_id = $2
        GROUP BY o.order_id
    `;

    const result = await pool.query(query, [
        orderId,
        userId
    ]);

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