import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartService, orderService } from '../../services/api';


const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape'
];

const Checkout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [delivery, setDelivery] = useState({
        fullName: '',
        email: '',
        phone: '',
        streetAddress: '',
        suburb: '',
        city: '',
        province: '',
        postalCode: '',
        instructions: ''
    });

    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', {
                state: { from: '/checkout' }
            });
            return;
        }

        const loadCart = async () => {
            try {
                const response = await cartService.getCart();
                setCartItems(response.data.items || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your cart.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDelivery(prev => ({
            ...prev,
            [name]: value
        }));

        setConfirmed(false);
    };

    const subtotal = cartItems.reduce((sum, item) => {
        return sum +
            Number(item.price) * Number(item.quantity);
    }, 0);

    // Current cart shipping amount.
    // Backend must use the same rule.
    const shipping = cartItems.length > 0 ? 5 : 0;

    const total = subtotal + shipping;

    const formatPrice = (amount) =>
        Number(amount).toFixed(2);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        if (cartItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        if (!/^0\d{9}$/.test(
            delivery.phone.replace(/\s/g, '')
        )) {
            setError('Enter a valid 10-digit South African phone number.');
            return;
        }

        if (!confirmed) {
            setError(
                'Please confirm your delivery details and order.'
            );
            return;
        }

        try {
            setSubmitting(true);

            // Backend must validate and save these details.
            const response = await orderService.createOrder({
                delivery: {
                    ...delivery,
                    phone: delivery.phone.replace(/\s/g, '')
                }
            });

           
if (response.status === 201 && response.data.orderId) {
    navigate(
        `/order-confirmation/${response.data.orderId}`,
        { replace: true }
    );
} else {
    throw new Error('Order confirmation ID was not returned.');
}


        } catch (err) {
    setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to place your order.'
    );
} finally {
    setSubmitting(false);
}
    };

    if (loading) {
        return (
            <div className="checkout-loading">
                Loading checkout...
            </div>
        );
    }

    if (cartItems.length === 0 && !error) {
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
                    <p className="checkout-eyebrow">
                        WAJELWA / SECURE ORDER
                    </p>
                    <h1>Checkout</h1>
                    <p>
                        Complete your delivery details
                        and review your order.
                    </p>
                </div>

                <form
                    onSubmit={handlePlaceOrder}
                    className="checkout-layout"
                >
                    <div className="checkout-left">

                        <section className="checkout-card">
                            <div className="checkout-section-title">
                                <span className="checkout-step">01</span>
                                <div>
                                    <h2>Delivery Information</h2>
                                    <p>Where should we send your order?</p>
                                </div>
                            </div>

                            <div className="checkout-fields">

                                <div className="checkout-field">
                                    <label>Full Name *</label>
                                    <input
                                        name="fullName"
                                        value={delivery.fullName}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={delivery.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={delivery.phone}
                                        onChange={handleChange}
                                        placeholder="0721234567"
                                        autoComplete="tel"
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>Street Address *</label>
                                    <input
                                        name="streetAddress"
                                        value={delivery.streetAddress}
                                        onChange={handleChange}
                                        placeholder="House number and street"
                                        autoComplete="address-line1"
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>Suburb *</label>
                                    <input
                                        name="suburb"
                                        value={delivery.suburb}
                                        onChange={handleChange}
                                        placeholder="Your suburb"
                                        required
                                    />
                                </div>

                                <div className="checkout-row">
                                    <div className="checkout-field">
                                        <label>City / Town *</label>
                                        <input
                                            name="city"
                                            value={delivery.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            autoComplete="address-level2"
                                            required
                                        />
                                    </div>

                                    <div className="checkout-field">
                                        <label>Province *</label>
                                        <select
                                            name="province"
                                            value={delivery.province}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select province
                                            </option>
                                            {provinces.map(province => (
                                                <option
                                                    key={province}
                                                    value={province}
                                                >
                                                    {province}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="checkout-field">
                                    <label>Postal Code *</label>
                                    <input
                                        name="postalCode"
                                        value={delivery.postalCode}
                                        onChange={handleChange}
                                        placeholder="e.g. 2000"
                                        inputMode="numeric"
                                        pattern="[0-9]{4}"
                                        maxLength={4}
                                        autoComplete="postal-code"
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label>
                                        Delivery Instructions (Optional)
                                    </label>
                                    <textarea
                                        name="instructions"
                                        value={delivery.instructions}
                                        onChange={handleChange}
                                        placeholder="Gate code, building, landmarks..."
                                        rows={4}
                                        maxLength={500}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="checkout-card">
                            <div className="checkout-section-title">
                                <span className="checkout-step">02</span>
                                <div>
                                    <h2>Review Your Order</h2>
                                    <p>Check your items before submitting.</p>
                                </div>
                            </div>

                            <div className="checkout-review-items">
                                {cartItems.map(item => (
                                    <div
                                        className="checkout-review-item"
                                        key={item.cart_item_id}
                                    >
                                        {item.image_urls?.[0] ? (
                                            <img
                                                src={item.image_urls[0]}
                                                alt={item.product_name}
                                            />
                                        ) : (
                                            <div className="checkout-no-image">
                                                WAJELWA
                                            </div>
                                        )}

                                        <div className="checkout-review-info">
                                            <h3>{item.product_name}</h3>
                                            <p>Qty: {item.quantity}</p>
                                            {item.color && (
                                                <p>Colour: {item.color}</p>
                                            )}
                                            {item.size && (
                                                <p>Size: {item.size}</p>
                                            )}
                                        </div>

                                        <strong>
                                            R{formatPrice(
                                                Number(item.price) *
                                                Number(item.quantity)
                                            )}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/cart"
                                className="checkout-edit-cart"
                            >
                                ← Edit Shopping Cart
                            </Link>
                        </section>

                    </div>

                    <aside className="checkout-right">
                        <div className="checkout-summary">
                            <h2>Order Summary</h2>

                            <div className="checkout-summary-line">
                                <span>Subtotal</span>
                                <span>R{formatPrice(subtotal)}</span>
                            </div>

                            <div className="checkout-summary-line">
                                <span>Shipping</span>
                                <span>R{formatPrice(shipping)}</span>
                            </div>

                            <div className="checkout-summary-divider" />

                            <div className="checkout-summary-total">
                                <span>Total</span>
                                <span>R{formatPrice(total)}</span>
                            </div>

                            <p className="checkout-summary-note">
                                Final amounts are verified by
                                Wajelwa when you place the order.
                            </p>

                            <label className="checkout-confirm">
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) =>
                                        setConfirmed(e.target.checked)
                                    }
                                    required
                                />
                                <span>
                                    I confirm that my delivery details
                                    and order information are correct.
                                </span>
                            </label>

                            {error && (
                                <div
                                    className="checkout-error"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="checkout-place-order"
                                disabled={
                                    submitting ||
                                    cartItems.length === 0
                                }
                            >
                                {submitting
                                    ? 'PLACING ORDER...'
                                    : 'PLACE ORDER'}
                            </button>

                            <p className="checkout-bottom-note">
                                Payment is not processed on this page.
                            </p>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default Checkout;

