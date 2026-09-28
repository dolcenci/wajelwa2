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

        const numPrice =
            typeof price === 'string' ? parseFloat(price) : price;

        return isNaN(numPrice) ? 0 : numPrice;
    };

    const getStatusClass = (status) => {
        const currentStatus = (status || 'pending').toLowerCase();

        switch (currentStatus) {
            case 'processing':
                return 'status-processing';

            case 'shipped':
                return 'status-shipped';

            case 'delivered':
                return 'status-delivered';

            case 'cancelled':
                return 'status-cancelled';

            default:
                return 'status-pending';
        }
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="orders-spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">

                {/* HEADER */}
                <div className="orders-header">
                    <p  style={{ color: '#ffffff' }}className="orders-eyebrow">YOUR WAJELWA ACCOUNT</p>

                    <h1 style={{ color: '#ffffff' }}>My Orders</h1>

                    <p style={{ color: '#ffffff' }} className="orders-subtitle">
                        View your order history and track your purchases.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="orders-error">
                        {error}
                    </div>
                )}

                {/* NO ORDERS */}
                {orders.length === 0 ? (
                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            📦
                        </div>

                        <h2>No orders yet</h2>

                        <p>
                            Your order history will appear here once you
                            place your first order.
                        </p>

                        <a
                            href="/shop"
                            className="shop-orders-btn"
                        >
                            START SHOPPING
                        </a>

                    </div>
                ) : (

                    <div className="orders-list">

                        {/* ORDER COUNT */}
                        <div className="orders-list-header">
                            <h2 style={{ color: '#ffffff' }}>Your Orders</h2>

                            <span style={{ color: '#ffffff' }}>
                                {orders.length}{' '}
                                {orders.length === 1 ? 'order' : 'orders'}
                            </span>
                        </div>

                        {orders.map((order) => {

                            const totalAmount =
                                getPriceAsNumber(order.total_amount);

                            const isExpanded =
                                expandedOrder === order.order_id;

                            return (
                                <div
                                    key={order.order_id}
                                    className={`order-card ${
                                        isExpanded ? 'order-card-expanded' : ''
                                    }`}
                                >

                                    {/* ORDER HEADER */}
                                    <button
                                        onClick={() =>
                                            setExpandedOrder(
                                                isExpanded
                                                    ? null
                                                    : order.order_id
                                            )
                                        }
                                        className="order-header-button"
                                    >

                                        <div className="order-main-info">

                                            <p className="order-number">
                                                ORDER #{order.order_id}
                                            </p>

                                            <p className="order-date">
                                                {order.order_date
                                                    ? new Date(
                                                        order.order_date
                                                    ).toLocaleDateString(
                                                        'en-ZA',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }
                                                    )
                                                    : 'N/A'}
                                            </p>

                                        </div>

                                        <div className="order-header-right">

                                            <span
                                                className={`order-status ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status || 'Pending'}
                                            </span>

                                            <span className="order-total">
                                                R{totalAmount.toFixed(2)}
                                            </span>

                                            <span className="order-arrow">
                                                {isExpanded ? '−' : '+'}
                                            </span>

                                        </div>

                                    </button>

                                    {/* EXPANDED ORDER */}
                                    {isExpanded && (
                                        <div className="order-details">

                                            {/* PROGRESS */}
                                            <OrderProgress
                                                currentStatus={order.status}
                                            />

                                            {/* ITEMS */}
                                            <div className="order-items-section">

                                                <div className="order-section-heading">
                                                    <h3>Items in this order</h3>
                                                </div>

                                                {order.items &&
                                                order.items.length > 0 ? (

                                                    <div className="order-items">

                                                        {order.items.map(
                                                            (item, index) => {

                                                                const price =
                                                                    getPriceAsNumber(
                                                                        item.price
                                                                    );

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="order-item"
                                                                    >

                                                                        <div className="order-item-image">
                                                                            <span>
                                                                                WAJELWA
                                                                            </span>
                                                                        </div>

                                                                        <div className="order-item-info">

                                                                            <h4>
                                                                                Product #
                                                                                {
                                                                                    item.product_id
                                                                                }
                                                                            </h4>

                                                                            <p>
                                                                                Quantity:{' '}
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                        <div className="order-item-price">
                                                                            R
                                                                            {price.toFixed(
                                                                                2
                                                                            )}
                                                                        </div>

                                                                    </div>
                                                                );
                                                            }
                                                        )}

                                                    </div>

                                                ) : (
                                                    <p className="no-order-items">
                                                        No items available.
                                                    </p>
                                                )}

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


/* =========================================
   ORDER PROGRESS
========================================= */

const OrderProgress = ({ currentStatus }) => {

    const steps = [
        {
            key: 'pending',
            label: 'Order Placed',
            icon: '01'
        },
        {
            key: 'processing',
            label: 'Processing',
            icon: '02'
        },
        {
            key: 'shipped',
            label: 'Shipped',
            icon: '03'
        },
        {
            key: 'delivered',
            label: 'Delivered',
            icon: '04'
        }
    ];

    const currentIndex = steps.findIndex(
        step =>
            step.key ===
            (currentStatus || 'pending').toLowerCase()
    );

    const progressPercent =
        currentIndex >= 0
            ? (currentIndex / (steps.length - 1)) * 100
            : 0;

    return (
        <div className="order-progress">

            <h3>Order Progress</h3>

            <div className="progress-container">

                {/* BACKGROUND LINE */}
                <div className="progress-background"></div>

                {/* ACTIVE LINE */}
                <div
                    className="progress-active"
                    style={{
                        width: `${progressPercent}%`
                    }}
                ></div>

                {/* STEPS */}
                <div className="progress-steps">

                    {steps.map((step, index) => {

                        const isCompleted =
                            index <= currentIndex;

                        const isCurrent =
                            index === currentIndex;

                        return (
                            <div
                                key={step.key}
                                className="progress-step"
                            >

                                <div
                                    className={`progress-circle ${
                                        isCompleted
                                            ? 'progress-completed'
                                            : ''
                                    } ${
                                        isCurrent
                                            ? 'progress-current'
                                            : ''
                                    }`}
                                >
                                    {step.icon}
                                </div>

                                <span
                                    className={
                                        isCompleted
                                            ? 'progress-label active'
                                            : 'progress-label'
                                    }
                                >
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

