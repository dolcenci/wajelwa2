const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartId = await Cart.getOrCreateCart(userId);
        const items = await Cart.getCartItems(cartId);

        res.json({ cartId, items });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        // Validate product exists and has stock
        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock_quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const cartId = await Cart.getOrCreateCart(userId);
        const item = await Cart.addItem(cartId, productId, quantity);

        res.status(201).json({
            message: 'Item added to cart',
            item
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const updatedItem = await Cart.updateItemQuantity(parseInt(cartItemId), quantity);

        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({
            message: 'Cart item updated',
            item: updatedItem
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ message: 'Server error updating cart item' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const removedItem = await Cart.removeItem(parseInt(cartItemId));

        if (!removedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({
            message: 'Item removed from cart',
            item: removedItem
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error removing from cart' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartId = await Cart.getOrCreateCart(userId);
        await Cart.clearCart(cartId);

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error clearing cart' });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };