import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            const products = response.data || [];

            // Get first 4 products as featured
            setFeaturedProducts(products.slice(0, 4));

            // Get next 4 products as new arrivals
            setNewArrivals(products.slice(4, 8));
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to safely format price
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-badge">Premium Quality</span>
                        <h1>Designer Printed <br />T-Shirts & Hoodies</h1>
                        <p className="hero-description">
                            Discover our exclusive collection of premium designer prints.
                            Each piece is crafted with attention to detail and made to last.
                            Elevate your wardrobe with unique designs you won't find anywhere else.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="hero-btn primary">
                                Shop Now
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/register" className="hero-btn secondary">
                                    Join Wajelwa
                                </Link>
                            )}
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100+</span>
                                <span className="stat-label">Unique Designs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-image-placeholder">
                            <span className="hero-image-icon">👕</span>
                            <span className="hero-image-text">Premium Quality</span>
                            <div className="floating-tag tag-1">🔥 New Drop</div>
                            <div className="floating-tag tag-2">💯 Premium</div>
                            <div className="floating-tag tag-3">✨ Limited</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-header">
                    <div className="section-header-content">
                        <span className="section-tag">Featured</span>
                        <h2>Best Sellers</h2>
                        <p className="section-description">
                            Our most popular designs loved by customers worldwide
                        </p>
                    </div>
                    <Link to="/products" className="view-all-btn">
                        View All
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="product-grid-home">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="product-card-home"
                                onClick={() => navigate(`/product/${product.product_id}`)}
                            >
                                <div className="product-image-home">
                                    <img
                                        src={`https://via.placeholder.com/400x400/667eea/ffffff?text=${product.product_name ? product.product_name.substring(0, 8) : 'Product'}`}
                                        alt={product.product_name || 'Product'}
                                    />
                                    {product.stock_quantity > 0 && (
                                        <span className="product-badge">In Stock</span>
                                    )}
                                    <button
                                        className="quick-view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product/${product.product_id}`);
                                        }}
                                    >
                                        Quick View
                                    </button>
                                </div>
                                <div className="product-info-home">
                                    <h3>{product.product_name || 'Unnamed Product'}</h3>
                                    <div className="product-meta">
                                        <span className="product-price-home">
                                            ${formatPrice(product.price)}
                                        </span>
                                        <div className="product-rating">
                                            <span className="stars">★★★★★</span>
                                            <span className="rating-count">(24)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Free Shipping</h3>
                        <p>On orders over R500. Fast and reliable delivery across South Africa.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Easy Returns</h3>
                        <p>Not satisfied? Return within 30 days for a full refund.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure Payment</h3>
                        <p>Your payment information is protected with industry-standard encryption.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💎</div>
                        <h3>Premium Quality</h3>
                        <p>All products are made with premium materials and exceptional craftsmanship.</p>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="new-arrivals-section">
                <div className="section-header">
                    <div className="section-header-content">
                        <span className="section-tag">New</span>
                        <h2>Just Dropped</h2>
                        <p className="section-description">
                            Fresh designs added to our collection. Be the first to style them.
                        </p>
                    </div>
                    <Link to="/products" className="view-all-btn">
                        View All
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : (
                    <div className="product-grid-home">
                        {newArrivals.map((product) => (
                            <div
                                key={product.product_id}
                                className="product-card-home"
                                onClick={() => navigate(`/product/${product.product_id}`)}
                            >
                                <div className="product-image-home">
                                    <img
                                        src={`https://via.placeholder.com/400x400/764ba2/ffffff?text=${product.product_name ? product.product_name.substring(0, 8) : 'Product'}`}
                                        alt={product.product_name || 'Product'}
                                    />
                                    <span className="product-badge new-badge">New</span>
                                    <button
                                        className="quick-view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product/${product.product_id}`);
                                        }}
                                    >
                                        Quick View
                                    </button>
                                </div>
                                <div className="product-info-home">
                                    <h3>{product.product_name || 'Unnamed Product'}</h3>
                                    <div className="product-meta">
                                        <span className="product-price-home">
                                            ${formatPrice(product.price)}
                                        </span>
                                        <div className="product-rating">
                                            <span className="stars">★★★★☆</span>
                                            <span className="rating-count">(12)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <div className="cta-text">
                        <span className="cta-badge">Join the Community</span>
                        <h2>Ready to Upgrade Your Style?</h2>
                        <p>
                            Join thousands of satisfied customers who've discovered
                            the perfect blend of comfort and style with Wajelwa.
                        </p>
                        <Link to="/products" className="cta-btn">
                            Explore Collection
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <div className="cta-image">
                        <div className="cta-image-placeholder">
                            <span className="cta-image-icon">👕</span>
                            <span className="cta-image-text">Wajelwa</span>
                            <span className="cta-image-sub">Designer Prints</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="newsletter-content">
                    <div className="newsletter-icon">✉️</div>
                    <h2>Stay in the Loop</h2>
                    <p>
                        Subscribe to get exclusive offers, early access to new drops,
                        and style inspiration delivered to your inbox.
                    </p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="newsletter-input"
                            required
                        />
                        <button type="submit" className="newsletter-btn">
                            Subscribe
                        </button>
                    </form>
                    <p className="newsletter-note">No spam, unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;