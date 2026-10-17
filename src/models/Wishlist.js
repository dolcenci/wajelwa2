
const pool = require('../config/db');

class Wishlist {
    static async getByUser(userId) {
        const result = await pool.query(
            `SELECT
                w.wishlist_item_id,
                w.product_id,
                w.created_at,
                p.product_name,
                p.price,
                p.image_urls,
                p.stock_quantity
             FROM wishlist_items w
             JOIN products p
                ON p.product_id = w.product_id
             WHERE w.user_id = $1
             ORDER BY w.created_at DESC`,
            [userId]
        );

        return result.rows;
    }

    static async add(userId, productId) {
        const result = await pool.query(
            `INSERT INTO wishlist_items (user_id, product_id)
             SELECT $1, product_id
             FROM products
             WHERE product_id = $2
             ON CONFLICT (user_id, product_id)
             DO UPDATE SET product_id = EXCLUDED.product_id
             RETURNING *`,
            [userId, productId]
        );

        return result.rows[0] || null;
    }

    static async remove(userId, productId) {
        const result = await pool.query(
            `DELETE FROM wishlist_items
             WHERE user_id = $1 AND product_id = $2
             RETURNING *`,
            [userId, productId]
        );

        return result.rows[0] || null;
    }
}

module.exports = Wishlist;
