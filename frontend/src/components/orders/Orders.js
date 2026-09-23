import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders();
            setOrders(response.data || []);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) return 0;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
            shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
        };
        return styles[(status || 'pending').toLowerCase()] || styles.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    My Orders
                </h1>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 text-center">
                        <span className="text-6xl">📦</span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                            No orders yet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Your order history will appear here once you place your first order.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const totalAmount = getPriceAsNumber(order.total_amount);
                            const isExpanded = expandedOrder === order.order_id;
                            return (
                                <div
                                    key={order.order_id}
                                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800"
                                >
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}
                                        className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    Order #{order.order_id}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {order.order_date ? new Date(order.order_date).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    }) : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    ${totalAmount.toFixed(2)}
                                                </span>
                                                <span className="text-gray-400">
                                                    {isExpanded ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                                            <OrderProgress currentStatus={order.status} />

                                            <div className="mt-6">
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                    Items in this order
                                                </h4>
                                                <div className="space-y-2">
                                                    {order.items && order.items.length > 0 ? (
                                                        order.items.map((item, index) => {
                                                            const price = getPriceAsNumber(item.price);
                                                            return (
                                                                <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                                    <span>Product #{item.product_id}</span>
                                                                    <span>Qty: {item.quantity}</span>
                                                                    <span className="font-semibold">${price.toFixed(2)}</span>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">No items</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Order Progress Component - Innovative Feature
const OrderProgress = ({ currentStatus }) => {
    const steps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'processing', label: 'Processing', icon: '⚙️' },
        { key: 'shipped', label: 'Shipped', icon: '🚚' },
        { key: 'delivered', label: 'Delivered', icon: '✅' }
    ];

    const currentIndex = steps.findIndex(s => s.key === (currentStatus || 'pending').toLowerCase());
    const progressPercent = currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

    return (
        <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">
                Order Progress
            </h4>
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                {/* Progress Line */}
                <div
                    className="absolute top-5 left-5 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `calc(${progressPercent}% - ${progressPercent > 0 ? '10px' : '0px'})` }}
                />
                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        return (
                            <div key={step.key} className="flex flex-col items-center z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-purple-200 dark:ring-purple-800 scale-110' : ''}`}
                                >
                                    {isCompleted ? step.icon : '○'}
                                </div>
                                <span className={`mt-2 text-xs font-semibold text-center ${
                                    isCompleted
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;