const pool = require('../config/db');

class User {
    static async create(userData) {
        const { full_name, email, password_hash } = userData;
        const query = `
            INSERT INTO users (full_name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING user_id, full_name, email, created_at, loyalty_points
        `;
        const values = [full_name, email, password_hash];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(userId) {
        const query = 'SELECT user_id, full_name, email, shipping_address, created_at, loyalty_points FROM users WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    static async update(userId, updates) {
        const { full_name, shipping_address } = updates;
        const query = `
            UPDATE users 
            SET full_name = $1, shipping_address = $2
            WHERE user_id = $3
            RETURNING user_id, full_name, email, shipping_address, loyalty_points
        `;
        const values = [full_name, shipping_address, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // NEW: Method to add points
    static async addPoints(userId, points) {
        const query = `
            UPDATE users 
            SET loyalty_points = loyalty_points + $1
            WHERE user_id = $2
            RETURNING loyalty_points
        `;
        const result = await pool.query(query, [points, userId]);
        return result.rows[0];
    }

    // NEW: Method to deduct points
    static async deductPoints(userId, points) {
        const query = `
            UPDATE users 
            SET loyalty_points = loyalty_points - $1
            WHERE user_id = $2 AND loyalty_points >= $1
            RETURNING loyalty_points
        `;
        const result = await pool.query(query, [points, userId]);
        return result.rows[0];
    }
}

module.exports = User;