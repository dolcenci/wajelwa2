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

    res.status(500).json({
        message: 'Server error fetching cart',
        debug: error.message,
        code: error.code
    });
}
}

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity, color, size } = req.body;

        const parsedProductId = Number(productId);
        const parsedQuantity = Number(quantity);

        if (
            !Number.isInteger(parsedProductId) ||
            parsedProductId < 1 ||
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1 ||
            typeof color !== 'string' ||
            !color.trim() ||
            typeof size !== 'string' ||
            !size.trim()
        ) {
            return res.status(400).json({
                message: 'Please provide a valid product, quantity, colour and size.'
            });
        }

        const product = await Product.getById(parsedProductId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        if (Number(product.stock_quantity) < parsedQuantity) {
            return res.status(400).json({
                message: 'Insufficient stock'
            });
        }

        const cartId = await Cart.getOrCreateCart(userId);

        const item = await Cart.addItem(
            cartId,
            parsedProductId,
            parsedQuantity,
            color.trim(),
            size.trim()
        );

        res.status(201).json({
            message: 'Item added to cart',
            item
        });
   } catch (error) {
    
if (error.message === 'INSUFFICIENT_STOCK') {
    return res.status(409).json({
        message: 'Not enough stock available for this quantity.'
    });
}

if (error.message === 'PRODUCT_NOT_FOUND') {
    return res.status(404).json({
        message: 'Product not found.'
    });
}
    console.error('Add to cart error:', error);

    res.status(500).json({
        message: 'Server error adding to cart',
        debug: error.message,
        code: error.code
    });
}
};


const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItemId = Number(req.params.cartItemId);
        const quantity = Number(req.body.quantity);

        if (
            !Number.isInteger(cartItemId) ||
            cartItemId < 1 ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: 'Please provide a valid item ID and quantity.'
            });
        }

        const cartId = await Cart.getOrCreateCart(userId);
        const items = await Cart.getCartItems(cartId);
        const item = items.find(
            entry => Number(entry.cart_item_id) === cartItemId
        );

        if (!item) {
            return res.status(404).json({
                message: 'Cart item not found'
            });
        }

        const product = await Product.getById(item.product_id);

        if (!product || Number(product.stock_quantity) < quantity) {
            return res.status(400).json({
                message: 'Requested quantity exceeds available stock.'
            });
        }

        const updatedItem = await Cart.updateItemQuantity(
            cartItemId,
            cartId,
            quantity
        );

        return res.json({
            message: 'Cart item updated',
            item: updatedItem
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        return res.status(500).json({
            message: 'Server error updating cart item'
        });
    }
};



const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItemId = Number(req.params.cartItemId);

        if (!Number.isInteger(cartItemId) || cartItemId < 1) {
            return res.status(400).json({
                message: 'Invalid cart item ID.'
            });
        }

        const cartId = await Cart.getOrCreateCart(userId);

        const removedItem = await Cart.removeItem(
            cartItemId,
            cartId
        );

        if (!removedItem) {
            return res.status(404).json({
                message: 'Cart item not found'
            });
        }

        return res.json({
            message: 'Item removed from cart',
            item: removedItem
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({
            message: 'Server error removing from cart'
        });
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