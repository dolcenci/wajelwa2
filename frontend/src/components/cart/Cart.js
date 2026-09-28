
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartService, orderService } from '../../services/api';

const Cart = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);

            const response = await cartService.getCart();

            setCartItems(response.data.items || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdating(true);

            await cartService.updateItem(cartItemId, {
                quantity: newQuantity
            });

            await fetchCart();
        } catch (err) {
            console.error(err);
            setError('Failed to update quantity');

            setTimeout(() => setError(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            setUpdating(true);

            await cartService.removeItem(cartItemId);

            await fetchCart();
        } catch (err) {
            console.error(err);
            setError('Failed to remove item');

            setTimeout(() => setError(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setUpdating(true);

            await orderService.createOrder();

            navigate('/orders');
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                'Failed to create order'
            );

            setTimeout(() => setError(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) {
            return 0;
        }

        const number =
            typeof price === 'string'
                ? parseFloat(price)
                : price;

        return isNaN(number) ? 0 : number;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return (
                total +
                getPriceAsNumber(item.price) *
                (item.quantity || 0)
            );
        }, 0);
    };

    const subtotal = calculateTotal();
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="cart-loading">
                <div className="cart-spinner"></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    return (
        <div className="cart-page">

            <div className="cart-container">

                {/* PAGE HEADER */}
                <div className="cart-header">
                    <p style={{ color: '#ffffff' }} className="cart-eyebrow">
                        YOUR SHOPPING BAG
                    </p>

                    <h1>
                        Shopping Cart
                    </h1>

                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="cart-error">
                        {error}
                    </div>
                )}

                {/* EMPTY CART */}
                {cartItems.length === 0 ? (

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            🛍
                        </div>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Looks like you haven't added anything
                            to your cart yet.
                        </p>

                        <Link
                            to="/products"
                            className="continue-shopping-btn"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                ) : (

                    <div className="cart-layout">

                        {/* CART ITEMS */}
                        <div className="cart-items-section">

                            <div className="cart-items-header">
                                <h2 style={{ color: '#ffffff' }}>
                                    Your Items
                                </h2>

                                <span style={{ color: '#ffffff' }}>
                                    {cartItems.length}{' '}
                                    {cartItems.length === 1
                                        ? 'item'
                                        : 'items'}
                                </span>
                            </div>

                            <div className="cart-items">

                                {cartItems.map((item) => {

                                    const price =
                                        getPriceAsNumber(
                                            item.price
                                        );

                                    const image =
                                        item.image_urls &&
                                        item.image_urls.length > 0
                                            ? item.image_urls[0]
                                            : null;

                                    return (
                                        <div
                                            key={item.cart_item_id}
                                            className="cart-item"
                                        >

                                            {/* PRODUCT IMAGE */}
                                            <div className="cart-item-image">

                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={
                                                            item.product_name ||
                                                            'Product'
                                                        }
                                                    />
                                                ) : (
                                                    <div className="cart-image-placeholder">
                                                        WAJELWA
                                                    </div>
                                                )}

                                            </div>

                                            {/* PRODUCT INFO */}
                                            <div className="cart-item-info">

                                                <h3>
                                                    {item.product_name ||
                                                        'Unnamed Product'}
                                                </h3>

                                                {item.color && (
                                                    <p>
                                                        Colour:{' '}
                                                        <span>
                                                            {item.color}
                                                        </span>
                                                    </p>
                                                )}

                                                {item.size && (
                                                    <p>
                                                        Size:{' '}
                                                        <span>
                                                            {item.size}
                                                        </span>
                                                    </p>
                                                )}

                                                <p className="cart-item-price">
                                                    R
                                                    {price.toFixed(2)}
                                                </p>

                                            </div>

                                            {/* QUANTITY */}
                                            <div className="cart-item-actions">

                                                <div className="quantity-control">

                                                    <button
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.cart_item_id,
                                                                (item.quantity ||
                                                                    0) - 1
                                                            )
                                                        }
                                                        disabled={updating}
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {item.quantity || 0}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.cart_item_id,
                                                                (item.quantity ||
                                                                    0) + 1
                                                            )
                                                        }
                                                        disabled={updating}
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                                <button
                                                    className="remove-item"
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.cart_item_id
                                                        )
                                                    }
                                                    disabled={updating}
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                            {/* CONTINUE SHOPPING */}
                            <Link
                                to="/products"
                                className="back-to-shop"
                            >
                                ← Continue Shopping
                            </Link>

                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="cart-summary">

                            <div className="summary-card">

                                <p className="summary-eyebrow">
                                    ORDER SUMMARY
                                </p>

                                <h2>
                                    Your Order
                                </h2>

                                <div className="summary-line">
                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        R{subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="summary-line">
                                    <span>
                                        Shipping
                                    </span>

                                    <span>
                                        R{shipping.toFixed(2)}
                                    </span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>
                                        Total
                                    </span>

                                    <span>
                                        R{total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={updating}
                                >
                                    {updating
                                        ? 'PROCESSING...'
                                        : 'PROCEED TO CHECKOUT'}
                                </button>

                                <p className="secure-checkout">
                                    Secure checkout
                                </p>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Cart;

