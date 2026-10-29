import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { cartService, orderService, paymentService } from '../../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'];

const PaymentForm = ({ orderId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState('');

    const handlePay = async (e) => {
        e.preventDefault();
        setPayError('');
        if (!stripe || !elements) { setPayError('Stripe has not loaded yet.'); return; }
        setPaying(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
            if (error) { setPayError(error.message || 'Payment failed.'); return; }
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                await paymentService.confirmPayment(paymentIntent.id);
                onSuccess(orderId);
            } else { setPayError('Payment was not completed.'); }
        } catch (err) {
            setPayError(err.response?.data?.message || err.message || 'Payment error.');
        } finally { setPaying(false); }
    };

    return (
        <div className="checkout-card">
            <div className="checkout-section-title"><span className="checkout-step">02</span><div><h2>Payment</h2><p>Enter your card details to complete your order.</p></div></div>
            <form onSubmit={handlePay}>
                <PaymentElement />
                {payError && <div className="checkout-error" role="alert" style={{ marginTop: '15px' }}>{payError}</div>}
                <button type="submit" className="checkout-place-order" disabled={!stripe || paying} style={{ marginTop: '25px' }}>
                    {paying ? 'PROCESSING PAYMENT...' : 'PAY NOW'}
                </button>
                <p className="checkout-bottom-note">Test card: 4242 4242 4242 4242, any future expiry, any CVC.</p>
            </form>
        </div>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [startingPayment, setStartingPayment] = useState(false);

    // Loyalty points state
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);

    const [delivery, setDelivery] = useState({ fullName: '', email: '', phone: '', streetAddress: '', suburb: '', city: '', province: '', postalCode: '', instructions: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login', { state: { from: '/checkout' } }); return; }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.loyaltyPoints) setUserPoints(user.loyaltyPoints);

        const loadCart = async () => {
            try {
                const response = await cartService.getCart();
                setCartItems(response.data.items || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load your cart.');
            } finally { setLoading(false); }
        };
        loadCart();
    }, [navigate]);

    const handleChange = (e) => setDelivery(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const shipping = cartItems.length > 0 ? 5 : 0;

    // Points discount calculation (1 point = R1)
    const maxPointsAllowed = Math.min(userPoints, Math.floor(subtotal + shipping));
    const discount = Math.min(pointsToUse, maxPointsAllowed);

    const total = Math.max(0, subtotal + shipping - discount);
    const formatPrice = (amount) => Number(amount).toFixed(2);

    const handleCreateOrderAndPayment = async (e) => {
        e.preventDefault();
        setError('');
        if (cartItems.length === 0) { setError('Your cart is empty.'); return; }
        if (!/^0\d{9}$/.test(delivery.phone.replace(/\s/g, ''))) { setError('Enter a valid 10-digit phone number.'); return; }

        setStartingPayment(true);
        try {
            const orderRes = await orderService.createOrder({
                delivery: { ...delivery, phone: delivery.phone.replace(/\s/g, '') },
                pointsToUse: discount
            });

            const createdOrderId = orderRes.data.orderId;
            setOrderId(createdOrderId);

            const payRes = await paymentService.createPaymentIntent(createdOrderId);
            setClientSecret(payRes.data.clientSecret);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Could not start payment.');
        } finally { setStartingPayment(false); }
    };

    if (loading) return <div className="checkout-loading">Loading checkout...</div>;

    if (cartItems.length === 0 && !clientSecret) {
        return (
            <div className="checkout-empty">
                <h2>Your cart is empty</h2>
                <p>Add products before proceeding to checkout.</p>
                <Link to="/products">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-heading">
                    <p className="checkout-eyebrow">WAJELWA / SECURE ORDER</p>
                    <h1>Checkout</h1>
                    <p>Complete your delivery details and pay securely.</p>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-left">
                        {!clientSecret && (
                            <section className="checkout-card">
                                <div className="checkout-section-title"><span className="checkout-step">01</span><div><h2>Delivery Information</h2><p>Where should we send your order?</p></div></div>
                                <form onSubmit={handleCreateOrderAndPayment} className="checkout-fields">
                                    <div className="checkout-field"><label>Full Name *</label><input name="fullName" value={delivery.fullName} onChange={handleChange} required /></div>
                                    <div className="checkout-field"><label>Email Address *</label><input type="email" name="email" value={delivery.email} onChange={handleChange} required /></div>
                                    <div className="checkout-field"><label>Phone Number *</label><input type="tel" name="phone" value={delivery.phone} onChange={handleChange} placeholder="0721234567" required /></div>
                                    <div className="checkout-field"><label>Street Address *</label><input name="streetAddress" value={delivery.streetAddress} onChange={handleChange} required /></div>
                                    <div className="checkout-field"><label>Suburb *</label><input name="suburb" value={delivery.suburb} onChange={handleChange} required /></div>
                                    <div className="checkout-row">
                                        <div className="checkout-field"><label>City / Town *</label><input name="city" value={delivery.city} onChange={handleChange} required /></div>
                                        <div className="checkout-field"><label>Province *</label><select name="province" value={delivery.province} onChange={handleChange} required><option value="">Select province</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                    </div>
                                    <div className="checkout-field"><label>Postal Code *</label><input name="postalCode" value={delivery.postalCode} onChange={handleChange} pattern="[0-9]{4}" maxLength={4} required /></div>

                                    {/* LOYALTY POINTS INPUT */}
                                    {userPoints > 0 && (
                                        <div className="checkout-field" style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                            <label style={{ color: '#166534' }}>You have {userPoints} points available!</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={maxPointsAllowed}
                                                    value={pointsToUse}
                                                    onChange={(e) => setPointsToUse(Number(e.target.value))}
                                                    placeholder="0"
                                                    style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #86efac', color: '#111' }}
                                                />
                                                <span style={{ color: '#166534', fontSize: '14px' }}>points to use (saves R{discount.toFixed(2)})</span>
                                            </div>
                                        </div>
                                    )}

                                    {error && <div className="checkout-error" role="alert">{error}</div>}
                                    <button type="submit" className="checkout-place-order" disabled={startingPayment}>
                                        {startingPayment ? 'PREPARING PAYMENT...' : 'CONTINUE TO PAYMENT'}
                                    </button>
                                </form>
                            </section>
                        )}

                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                <PaymentForm orderId={orderId} onSuccess={(id) => navigate(`/order-confirmation/${id}`, { replace: true })} />
                            </Elements>
                        )}
                    </div>

                    <aside className="checkout-right">
                        <div className="checkout-summary">
                            <h2>Order Summary</h2>
                            {cartItems.map(item => (
                                <div className="checkout-review-item" key={item.cart_item_id}>
                                    <div className="checkout-review-info"><h3>{item.product_name}</h3><p>Qty: {item.quantity}</p>{item.color && <p>Colour: {item.color}</p>}{item.size && <p>Size: {item.size}</p>}</div>
                                    <strong>R{formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                                </div>
                            ))}
                            <div className="checkout-summary-line"><span>Subtotal</span><span>R{formatPrice(subtotal)}</span></div>
                            <div className="checkout-summary-line"><span>Shipping</span><span>R{formatPrice(shipping)}</span></div>

                            {discount > 0 && (
                                <div className="checkout-summary-line" style={{ color: '#166534' }}>
                                    <span>Loyalty Discount</span>
                                    <span>-R{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div className="checkout-summary-divider" />
                            <div className="checkout-summary-total"><span>Total</span><span>R{formatPrice(total)}</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;