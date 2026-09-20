const pool = require('../config/db');

class Product {
    // Get all products with optional filtering
    static async getAll(filters = {}) {
        let query = `
            SELECT p.*, c.category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE 1=1
        `;
        const values = [];
        let valueCounter = 1;

        // Add filters if provided
        if (filters.category_id) {
            query += ` AND p.category_id = $${valueCounter}`;
            values.push(filters.category_id);
            valueCounter++;
        }

        if (filters.min_price) {
            query += ` AND p.price >= $${valueCounter}`;
            values.push(filters.min_price);
            valueCounter++;
        }

        if (filters.max_price) {
            query += ` AND p.price <= $${valueCounter}`;
            values.push(filters.max_price);
            valueCounter++;
        }

        if (filters.search) {
            query += ` AND p.product_name ILIKE $${valueCounter}`;
            values.push(`%${filters.search}%`);
            valueCounter++;
        }

        query += ` ORDER BY p.created_at DESC`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    // Get a single product by ID
    static async getById(productId) {
        const query = `
            SELECT p.*, c.category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = $1
        `;
        const result = await pool.query(query, [productId]);
        return result.rows[0];
    }

    // Create a new product
    static async create(productData) {
        const { product_name, description, price, stock_quantity, category_id, image_urls } = productData;
        const query = `
            INSERT INTO products (product_name, description, price, stock_quantity, category_id, image_urls)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [product_name, description, price, stock_quantity, category_id, image_urls];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Update product stock
    static async updateStock(productId, quantity) {
        const query = `
            UPDATE products 
            SET stock_quantity = stock_quantity - $1
            WHERE product_id = $2 AND stock_quantity >= $1
            RETURNING *
        `;
        const result = await pool.query(query, [quantity, productId]);
        return result.rows[0];
    }


    // Update a product
    static async update(productId, updates) {
        const fields = [];
        const values = [];
        let valueCounter = 1;

        if (updates.product_name !== undefined) {
            fields.push(`product_name = $${valueCounter}`);
            values.push(updates.product_name);
            valueCounter++;
        }
        if (updates.description !== undefined) {
            fields.push(`description = $${valueCounter}`);
            values.push(updates.description);
            valueCounter++;
        }
        if (updates.price !== undefined) {
            fields.push(`price = $${valueCounter}`);
            values.push(updates.price);
            valueCounter++;
        }
        if (updates.stock_quantity !== undefined) {
            fields.push(`stock_quantity = $${valueCounter}`);
            values.push(updates.stock_quantity);
            valueCounter++;
        }
        if (updates.category_id !== undefined) {
            fields.push(`category_id = $${valueCounter}`);
            values.push(updates.category_id);
            valueCounter++;
        }
        if (updates.image_urls !== undefined) {
            fields.push(`image_urls = $${valueCounter}`);
            values.push(updates.image_urls);
            valueCounter++;
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(productId);
        const query = `
        UPDATE products 
        SET ${fields.join(', ')}
        WHERE product_id = $${valueCounter}
        RETURNING *
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

// Delete a product
    static async delete(productId) {
        const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
        const result = await pool.query(query, [productId]);
        return result.rows[0];
    }

}




module.exports = Product;