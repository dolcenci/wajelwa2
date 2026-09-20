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
            SELECT ci.cart_item_id, ci.quantity, p.product_id, p.product_name, p.price, p.image_urls
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1
        `;
        const result = await pool.query(query, [cartId]);
        return result.rows;
    }

    // Add item to cart
    static async addItem(cartId, productId, quantity) {
        // Check if item already exists in cart
        let query = 'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2';
        let result = await pool.query(query, [cartId, productId]);

        if (result.rows.length > 0) {
            // Update existing item
            const newQuantity = result.rows[0].quantity + quantity;
            query = 'UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2 RETURNING *';
            result = await pool.query(query, [newQuantity, result.rows[0].cart_item_id]);
        } else {
            // Insert new item
            query = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
            result = await pool.query(query, [cartId, productId, quantity]);
        }

        return result.rows[0];
    }

    // Update item quantity
    static async updateItemQuantity(cartItemId, quantity) {
        const query = `
            UPDATE cart_items 
            SET quantity = $1 
            WHERE cart_item_id = $2 
            RETURNING *
        `;
        const result = await pool.query(query, [quantity, cartItemId]);
        return result.rows[0];
    }

    // Remove item from cart
    static async removeItem(cartItemId) {
        const query = 'DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *';
        const result = await pool.query(query, [cartItemId]);
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