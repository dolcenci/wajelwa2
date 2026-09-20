import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            setError('Failed to load cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            setUpdating(true);
            await cartService.updateItem(cartItemId, { quantity: newQuantity });
            await fetchCart();
        } catch (err) {
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
            setError(err.response?.data?.message || 'Failed to create order');
            setTimeout(() => setError(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.price ? parseFloat(item.price) : 0;
            return total + (price * (item.quantity || 0));
        }, 0);
    };

    if (loading) return <div className="loading">Loading cart...</div>;

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            {error && <div className="error-message">{error}</div>}

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button onClick={() => navigate('/products')} className="continue-shopping">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const price = item.price ? parseFloat(item.price) : 0;
                            return (
                                <div key={item.cart_item_id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img
                                            src={`https://via.placeholder.com/100x100?text=${item.product_name ? item.product_name.substring(0, 5) : 'Item'}`}
                                            alt={item.product_name || 'Product'}
                                        />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{item.product_name || 'Unnamed Product'}</h3>
                                        <p className="cart-item-price">${price.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cart_item_id, (item.quantity || 0) - 1)}
                                                disabled={updating}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity || 0}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cart_item_id, (item.quantity || 0) + 1)}
                                                disabled={updating}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.cart_item_id)}
                                            className="remove-btn"
                                            disabled={updating}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>${calculateTotal() > 0 ? '5.00' : '0.00'}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${(calculateTotal() + (calculateTotal() > 0 ? 5 : 0)).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="checkout-btn"
                            disabled={updating}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;