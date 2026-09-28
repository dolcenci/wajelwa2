const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        const filters = {};
        if (category) filters.category_id = parseInt(category);
        if (minPrice) filters.min_price = parseFloat(minPrice);
        if (maxPrice) filters.max_price = parseFloat(maxPrice);
        if (search) filters.search = search;

        const products = await Product.getAll(filters);

        // Format products to ensure prices are numbers and add image URLs
        const formattedProducts = products.map(product => ({
            ...product,
            price: parseFloat(product.price) || 0,
            stock_quantity: parseInt(product.stock_quantity) || 0,
            image_urls: product.image_urls || []
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.getById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Format product to ensure prices are numbers
        const formattedProduct = {
    ...product,
    price: parseFloat(product.price) || 0,
    stock_quantity: parseInt(product.stock_quantity) || 0,
    image_urls: product.image_urls || [],
    sizes: product.sizes || [],
    colors: product.colors || []
};

        res.json(formattedProduct);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

// Create a new product with image upload
const createProduct = async (req, res) => {
    try {
        const { product_name, description, price, stock_quantity, category_id } = req.body;

        // Validate required fields
        if (!product_name || price === undefined || stock_quantity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Handle image uploads
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        const newProduct = await Product.create({
            product_name,
            description,
            price: parseFloat(price),
            stock_quantity: parseInt(stock_quantity),
            category_id: category_id ? parseInt(category_id) : null,
            image_urls: imageUrls
        });

        // Format response
        const formattedProduct = {
            ...newProduct,
            price: parseFloat(newProduct.price) || 0,
            stock_quantity: parseInt(newProduct.stock_quantity) || 0,
            image_urls: newProduct.image_urls || []
        };

        res.status(201).json({
            message: 'Product created successfully',
            product: formattedProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { product_name, description, price, stock_quantity, category_id } = req.body;

        // Get existing product
        const existingProduct = await Product.getById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image uploads
        let imageUrls = existingProduct.image_urls || [];
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            imageUrls = [...imageUrls, ...newImages];
        }

        // Build update object
        const updates = {};
        if (product_name) updates.product_name = product_name;
        if (description !== undefined) updates.description = description;
        if (price !== undefined) updates.price = parseFloat(price);
        if (stock_quantity !== undefined) updates.stock_quantity = parseInt(stock_quantity);
        if (category_id !== undefined) updates.category_id = category_id ? parseInt(category_id) : null;
        updates.image_urls = imageUrls;

        const updatedProduct = await Product.update(productId, updates);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const formattedProduct = {
            ...updatedProduct,
            price: parseFloat(updatedProduct.price) || 0,
            stock_quantity: parseInt(updatedProduct.stock_quantity) || 0,
            image_urls: updatedProduct.image_urls || []
        };

        res.json({
            message: 'Product updated successfully',
            product: formattedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.delete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product deleted successfully',
            product: deletedProduct
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};