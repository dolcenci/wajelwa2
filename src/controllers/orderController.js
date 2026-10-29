const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const delivery = req.body?.delivery;
        const pointsToUse = parseInt(req.body?.pointsToUse) || 0;

        if (!delivery || typeof delivery !== 'object' || Array.isArray(delivery)) {
            return res.status(400).json({ message: 'Delivery details are required.' });
        }

        const requiredFields = ['fullName', 'email', 'phone', 'streetAddress', 'suburb', 'city', 'province', 'postalCode'];
        const invalid = requiredFields.some(field => typeof delivery[field] !== 'string' || !delivery[field].trim() || delivery[field].length > 200);
        if (invalid) return res.status(400).json({ message: 'Please complete all required delivery fields.' });

        const cleaned = Object.fromEntries(Object.entries(delivery).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email) || !/^0\d{9}$/.test(cleaned.phone) || !/^\d{4}$/.test(cleaned.postalCode)) {
            return res.status(400).json({ message: 'Please check your delivery information.' });
        }

        const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];
        if (!provinces.includes(cleaned.province)) {
            return res.status(400).json({ message: 'Please select a valid province.' });
        }

        const cartId = await Cart.getOrCreateCart(userId);
        const order = await Order.createPendingOrder(userId, cartId, cleaned, pointsToUse);

        return res.status(201).json({
            message: 'Order created. Proceed to payment.',
            orderId: order.orderId,
            totalAmount: order.totalAmount,
            status: 'Pending Payment'
        });

    } catch (error) {
        if (error.message === 'CART_EMPTY') return res.status(400).json({ message: 'Your cart is empty.' });
        if (error.message === 'INSUFFICIENT_POINTS') return res.status(400).json({ message: 'You do not have enough points.' });
        if (error.message === 'INVALID_CART_ITEM') return res.status(400).json({ message: 'Your cart contains an invalid item.' });
        if (error.message.startsWith('INSUFFICIENT_STOCK:')) return res.status(409).json({ message: error.message.replace('INSUFFICIENT_STOCK:', 'Insufficient stock for: ') });

        console.error('Create order error:', error);
        return res.status(500).json({ message: 'Unable to place your order.' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.getUserOrders(req.user.userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.getOrderById(parseInt(req.params.id), req.user.userId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching order' });
    }
};

module.exports = { createOrder, getOrders, getOrderById };