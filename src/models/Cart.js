const pool = require('../config/db');

class Cart {
    // Get or create a cart for a user
    static async getOrCreateCart(userId) {
        // Check if cart exists
        let query = 'SELECT cart_id FROM carts WHERE user_id = $1';
        let result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            // Create new cart
            query = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id';
            result = await pool.query(query, [userId]);
        }

        return result.rows[0].cart_id;
    }

   
    // Get all items in a cart
    static async getCartItems(cartId) {
        const query = `
            SELECT
                ci.cart_item_id,
                ci.quantity,
                ci.color,
                ci.size,
                p.product_id,
                p.product_name,
                p.price,
                p.image_urls,
                p.stock_quantity
            FROM cart_items ci
            JOIN products p
                ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1
            ORDER BY ci.cart_item_id DESC
        `;

        const result = await pool.query(query, [cartId]);
        return result.rows;
    }


static async addItem(cartId, productId, quantity, color, size) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Lock this customer's cart so concurrent add requests
        // cannot both pass the quantity check.
        const cartResult = await client.query(
            'SELECT cart_id FROM carts WHERE cart_id = $1 FOR UPDATE',
            [cartId]
        );

        if (cartResult.rowCount === 0) {
            throw new Error('CART_NOT_FOUND');
        }

        // Check current product stock.
        const productResult = await client.query(
            `SELECT stock_quantity
             FROM products
             WHERE product_id = $1
             FOR UPDATE`,
            [productId]
        );

        if (productResult.rowCount === 0) {
            throw new Error('PRODUCT_NOT_FOUND');
        }

        const stock = Number(
            productResult.rows[0].stock_quantity
        );

        // Count all quantities for this product already
        // in this customer's cart.
        const quantityResult = await client.query(
            `SELECT COALESCE(SUM(quantity), 0) AS total
             FROM cart_items
             WHERE cart_id = $1
               AND product_id = $2`,
            [cartId, productId]
        );

        const existingTotal = Number(
            quantityResult.rows[0].total
        );

        if (existingTotal + quantity > stock) {
            throw new Error('INSUFFICIENT_STOCK');
        }

        // Check for matching product, colour and size.
        const existingResult = await client.query(
            `SELECT cart_item_id
             FROM cart_items
             WHERE cart_id = $1
               AND product_id = $2
               AND color = $3
               AND size = $4`,
            [cartId, productId, color, size]
        );

        let result;

        if (existingResult.rows.length > 0) {
            result = await client.query(
                `UPDATE cart_items
                 SET quantity = quantity + $1
                 WHERE cart_item_id = $2
                 RETURNING *`,
                [
                    quantity,
                    existingResult.rows[0].cart_item_id
                ]
            );
        } else {
            result = await client.query(
                `INSERT INTO cart_items
                    (cart_id, product_id, quantity, color, size)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [cartId, productId, quantity, color, size]
            );
        }

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


    // Update item quantity only if it belongs to the customer's cart
    static async updateItemQuantity(cartItemId, cartId, quantity) {
        const query = `
            UPDATE cart_items
            SET quantity = $1
            WHERE cart_item_id = $2
              AND cart_id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [
            quantity,
            cartItemId,
            cartId
        ]);

        return result.rows[0];
    }


    // Remove item only if it belongs to the customer's cart
    static async removeItem(cartItemId, cartId) {
        const query = `
            DELETE FROM cart_items
            WHERE cart_item_id = $1
              AND cart_id = $2
            RETURNING *
        `;

        const result = await pool.query(query, [
            cartItemId,
            cartId
        ]);

        return result.rows[0];
    }

    // Clear entire cart
    static async clearCart(cartId) {
        const query = 'DELETE FROM cart_items WHERE cart_id = $1';
        await pool.query(query, [cartId]);
        return true;
    }
}

module.exports = Cart;