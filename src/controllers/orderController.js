const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order from cart
const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get cart items
        const cartId = await Cart.getOrCreateCart(userId);
        const cartItems = await Cart.getCartItems(cartId);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total and check stock
        let totalAmount = 0;
        for (const item of cartItems) {
            const product = await Product.getById(item.product_id);
            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product: ${product.product_name}`
                });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create order
        const orderId = await Order.createOrder(userId, cartItems, totalAmount);

        // Update product stock
        for (const item of cartItems) {
            await Product.updateStock(item.product_id, item.quantity);
        }

        // Clear the cart
        await Cart.clearCart(cartId);

        res.status(201).json({
            message: 'Order created successfully',
            orderId
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};

// Get user's orders
const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.getUserOrders(userId);

        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.getOrderById(parseInt(orderId));

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

module.exports = { createOrder, getOrders, getOrderById };