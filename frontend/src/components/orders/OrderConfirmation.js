
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../../services/api';


const OrderConfirmation = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);

                const response = await orderService.getOrderById(orderId);
                setOrder(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load order confirmation.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="confirmation-loading">
                Loading your order confirmation...
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="confirmation-page">
                <div className="confirmation-container">
                    <h2>Order confirmation unavailable</h2>
                    <p>{error || 'Order not found.'}</p>
                    <Link to="/orders" className="confirmation-btn">
                        View My Orders
                    </Link>
                </div>
            </div>
        );
    }

    const amount = Number(order.total_amount || 0);
    const delivery = order.delivery_details;

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <div className="confirmation-icon">✓</div>

                    <p className="confirmation-eyebrow">
                        WAJELWA / ORDER CONFIRMATION
                    </p>

                    <h1>Order Placed!</h1>

                    <p className="confirmation-subtitle">
                        Thank you for shopping with Wajelwa.
                        Your order has been submitted successfully.
                    </p>

                    <div className="confirmation-order-box">
                        <div className="confirmation-row">
                            <span>Order Number</span>
                            <strong>#{order.order_id}</strong>
                        </div>

                        <div className="confirmation-row">
                            <span>Order Status</span>
                            <strong>{order.status || 'Pending'}</strong>
                        </div>

                        <div className="confirmation-row">
                            <span>Order Total</span>
                            <strong>R{amount.toFixed(2)}</strong>
                        </div>
                    </div>

                    {delivery && (
                        <div className="confirmation-delivery">
                            <h2>Delivery Address</h2>
                            <p>{delivery.fullName}</p>
                            <p>{delivery.streetAddress}</p>
                            <p>{delivery.suburb}</p>
                            <p>
                                {delivery.city}, {delivery.province}
                            </p>
                            <p>{delivery.postalCode}</p>
                        </div>
                    )}

                    <p className="confirmation-notice">
                        Your order is awaiting processing.
                        This confirmation does not indicate
                        that payment has been received.
                    </p>

                    <div className="confirmation-actions">
                        <Link to="/orders" className="confirmation-btn">
                            VIEW MY ORDERS
                        </Link>

                        <Link
                            to="/products"
                            className="confirmation-secondary-btn"
                        >
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
