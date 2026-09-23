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
            setError('Failed to load cart');
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

    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) return 0;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (getPriceAsNumber(item.price) * (item.quantity || 0));
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Shopping Cart
                </h1>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 text-center">
                        <span className="text-6xl">🛒</span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
                            Browse our collection and add items to your cart
                        </p>
                        <Link
                            to="/products"
                            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all transform hover:scale-105"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const price = getPriceAsNumber(item.price);
                                return (
                                    <div
                                        key={item.cart_item_id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 flex items-center gap-4 border border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={`https://via.placeholder.com/100x100/667eea/ffffff?text=${item.product_name ? item.product_name.substring(0, 5) : 'Item'}`}
                                                alt={item.product_name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {item.product_name || 'Unnamed Product'}
                                            </h3>
                                            <p className="text-purple-600 dark:text-purple-400 font-bold mt-1">
                                                ${price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.cart_item_id, (item.quantity || 0) - 1)}
                                                    disabled={updating}
                                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                                >
                                                    −
                                                </button>
                                                <span className="px-4 py-1 text-gray-900 dark:text-white font-medium">
                                                    {item.quantity || 0}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.cart_item_id, (item.quantity || 0) + 1)}
                                                    disabled={updating}
                                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.cart_item_id)}
                                                disabled={updating}
                                                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span>${calculateTotal() > 0 ? '5.00' : '0.00'}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>${(calculateTotal() + (calculateTotal() > 0 ? 5 : 0)).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={updating}
                                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;