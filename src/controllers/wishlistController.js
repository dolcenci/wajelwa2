
const Wishlist = require('../models/Wishlist');

const validId = value =>
    Number.isSafeInteger(Number(value)) && Number(value) > 0;

const getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.getByUser(req.user.userId);
        res.json(items);
    } catch (error) {
        console.error('Wishlist error:', error);
        res.status(500).json({
            message: 'Unable to load wishlist.'
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!validId(productId)) {
            return res.status(400).json({
                message: 'Invalid product ID.'
            });
        }

        const item = await Wishlist.add(
            req.user.userId,
            Number(productId)
        );

        if (!item) {
            return res.status(404).json({
                message: 'Product not found.'
            });
        }

        res.status(201).json({
            message: 'Product saved to wishlist.',
            item
        });
    } catch (error) {
        console.error('Add wishlist error:', error);
        res.status(500).json({
            message: 'Unable to save product.'
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!validId(productId)) {
            return res.status(400).json({
                message: 'Invalid product ID.'
            });
        }

        const item = await Wishlist.remove(
            req.user.userId,
            Number(productId)
        );

        if (!item) {
            return res.status(404).json({
                message: 'Wishlist item not found.'
            });
        }

        res.json({ message: 'Product removed from wishlist.' });
    } catch (error) {
        console.error('Remove wishlist error:', error);
        res.status(500).json({
            message: 'Unable to remove product.'
        });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
