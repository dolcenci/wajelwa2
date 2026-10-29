const Product = require('../models/Product');
const { uploadImage } = require('../config/s3');
const pool = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        const filters = {};
        if (category) filters.category_id = parseInt(category);
        if (minPrice) filters.min_price = parseFloat(minPrice);
        if (maxPrice) filters.max_price = parseFloat(maxPrice);
        if (search) filters.search = search;

        const products = await Product.getAll(filters);
        const formattedProducts = products.map(product => ({
            ...product,
            price: parseFloat(product.price) || 0,
            stock_quantity: parseInt(product.stock_quantity) || 0,
            image_urls: product.image_urls || []
        }));
        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({
            ...product,
            price: parseFloat(product.price) || 0,
            stock_quantity: parseInt(product.stock_quantity) || 0,
            image_urls: product.image_urls || [],
            sizes: product.sizes || [],
            colors: product.colors || []
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { product_name, description, price, stock_quantity, category_id } = req.body;
        if (!product_name || price === undefined || stock_quantity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const url = await uploadImage(file.buffer, file.originalname, file.mimetype);
                imageUrls.push(url);
            }
        }

        const newProduct = await Product.create({
            product_name, description, price: parseFloat(price),
            stock_quantity: parseInt(stock_quantity),
            category_id: category_id ? parseInt(category_id) : null,
            image_urls: imageUrls
        });

        // LOG THE ACTION
        await pool.query(
            'INSERT INTO admin_logs (admin_id, action, details) VALUES ($1, $2, $3)',
            [req.user.userId, 'CREATE_PRODUCT', `Created product: ${product_name} (ID: ${newProduct.product_id})`]
        );

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const existingProduct = await Product.getById(productId);
        if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

        let imageUrls = existingProduct.image_urls || [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const url = await uploadImage(file.buffer, file.originalname, file.mimetype);
                imageUrls.push(url);
            }
        }

        const updates = { ...req.body, image_urls: imageUrls };
        if (updates.price) updates.price = parseFloat(updates.price);
        if (updates.stock_quantity) updates.stock_quantity = parseInt(updates.stock_quantity);
        if (updates.category_id) updates.category_id = parseInt(updates.category_id);

        const updatedProduct = await Product.update(productId, updates);

        // LOG THE ACTION
        await pool.query(
            'INSERT INTO admin_logs (admin_id, action, details) VALUES ($1, $2, $3)',
            [req.user.userId, 'UPDATE_PRODUCT', `Updated product: ${updatedProduct.product_name} (ID: ${productId})`]
        );

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.delete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        // LOG THE ACTION
        await pool.query(
            'INSERT INTO admin_logs (admin_id, action, details) VALUES ($1, $2, $3)',
            [req.user.userId, 'DELETE_PRODUCT', `Deleted product: ${deletedProduct.product_name} (ID: ${deletedProduct.product_id})`]
        );

        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, u.full_name 
            FROM admin_logs a
            JOIN users u ON a.admin_id = u.user_id
            ORDER BY a.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getAuditLogs };