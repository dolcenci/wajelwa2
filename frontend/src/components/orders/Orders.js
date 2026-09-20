import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to safely get price as number
    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) return 0;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    if (loading) return <div className="loading">Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="orders-page">
            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const totalAmount = getPriceAsNumber(order.total_amount);
                        return (
                            <div key={order.order_id} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">Order #{order.order_id}</span>
                                    <span className="order-date">
                                        {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                                    </span>
                                    <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="order-items">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => {
                                            const price = getPriceAsNumber(item.price);
                                            return (
                                                <div key={index} className="order-item">
                                                    <span>Product ID: {item.product_id}</span>
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>${price.toFixed(2)}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No items in this order</p>
                                    )}
                                </div>
                                <div className="order-total">
                                    <strong>Total: ${totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;