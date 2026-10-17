const Order = require('../models/Order');
const Cart = require('../models/Cart');


const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const delivery = req.body?.delivery;

        if (!delivery || typeof delivery !== 'object' ||
            Array.isArray(delivery)) {
            return res.status(400).json({
                message: 'Delivery details are required.'
            });
        }

        const requiredFields = [
            'fullName',
            'email',
            'phone',
            'streetAddress',
            'suburb',
            'city',
            'province',
            'postalCode'
        ];

        const invalid = requiredFields.some(field =>
            typeof delivery[field] !== 'string' ||
            !delivery[field].trim() ||
            delivery[field].length > 200
        );

        if (invalid) {
            return res.status(400).json({
                message: 'Please complete all required delivery fields.'
            });
        }

        const cleaned = Object.fromEntries(
            Object.entries(delivery).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value
            ])
        );

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email) ||
            !/^0\d{9}$/.test(cleaned.phone) ||
            !/^\d{4}$/.test(cleaned.postalCode) ||
            (typeof cleaned.instructions !== 'undefined' &&
             (typeof cleaned.instructions !== 'string' ||
              cleaned.instructions.length > 500))) {
            return res.status(400).json({
                message: 'Please check your delivery information.'
            });
        }

        const provinces = [
            'Eastern Cape', 'Free State', 'Gauteng',
            'KwaZulu-Natal', 'Limpopo', 'Mpumalanga',
            'North West', 'Northern Cape', 'Western Cape'
        ];

        if (!provinces.includes(cleaned.province)) {
            return res.status(400).json({
                message: 'Please select a valid province.'
            });
        }

        // Reuse the existing transactional order logic.
        const cartId = await Cart.getOrCreateCart(userId);

        const order = await Order.getOrderById(
    parseInt(orderId, 10),
    req.user.userId
);

        return res.status(201).json({
            message: 'Order placed successfully',
            orderId: order.orderId,
            totalAmount: order.totalAmount
        });

    } catch (error) {
        if (error.message === 'CART_EMPTY') {
            return res.status(400).json({
                message: 'Your cart is empty.'
            });
        }

        if (error.message === 'INVALID_CART_ITEM') {
            return res.status(400).json({
                message: 'Your cart contains an invalid item.'
            });
        }

        if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
            return res.status(409).json({
                message: error.message.replace(
                    'INSUFFICIENT_STOCK:',
                    'Insufficient stock for: '
                )
            });
        }

        console.error('Create order error:', error);

        return res.status(500).json({
            message: 'Unable to place your order.'
        });
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