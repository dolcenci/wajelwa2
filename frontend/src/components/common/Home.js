import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            // Take only the first 6 products for the grid
            setProducts(response.data.slice(0, 6) || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    const reviews = [
        { id: 1, name: "Thabo M.", location: "Johannesburg", text: "The quality of the print is insane. I've washed my hoodie 10 times and the design hasn't faded or cracked at all. Will definitely be buying more.", rating: 5, initial: "T" },
        { id: 2, name: "Sarah J.", location: "Cape Town", text: "Finally a local brand that actually gets streetwear right. The fit is perfect, oversized without looking sloppy. Delivery was fast too.", rating: 5, initial: "S" },
        { id: 3, name: "Bongani K.", location: "Durban", text: "I used to buy from them at the market stalls, so happy they have a website now. The checkout was smooth and paying with my card was easy.", rating: 4, initial: "B" }
    ];

    return (
        <div className="wajelwa-home">
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-brand">
                        <img src="/images/wajelwaheroLogo.jpeg" alt="Wajelwa" />
                    </p>
                    <h1>
                        Designed
                        <br />
                        to <span>STAND OUT</span>
                    </h1>
                    <p className="hero-description">
                        Premium designer printed t-shirts and hoodies. Made for those who refuse to blend in.
                    </p>
                    <Link to="/products" className="hero-button">
                        SHOP NOW
                    </Link>
                </div>
                <div className="hero-image">
                    <img src="/images/wajelwaHero.png" alt="Wajelwa Hoodies" />
                </div>
            </section>

            {/* MARQUEE / TICKER */}
            <div className="ticker-wrap">
                <div className="ticker">
                    <span>FREE DELIVERY OVER R500</span>
                    <span>•</span>
                    <span>30 DAY RETURNS</span>
                    <span>•</span>
                    <span>SECURE CHECKOUT</span>
                    <span>•</span>
                    <span>PREMIUM QUALITY</span>
                    <span>•</span>
                    <span>FREE DELIVERY OVER R500</span>
                    <span>•</span>
                    <span>30 DAY RETURNS</span>
                    <span>•</span>
                    <span>SECURE CHECKOUT</span>
                    <span>•</span>
                </div>
            </div>

            {/* SHOP BY CATEGORY (Black Background) */}
            <section className="home-category-section dark-section">
                <div className="section-heading light-text">
                    <p>EXPLORE THE RANGE</p>
                    <h2>SHOP BY CATEGORY</h2>
                </div>

                <div className="home-category-grid">
                    <Link to="/products?category=1" className="home-category-card">
                        <div className="home-category-image">
                            <img src="/images/wajelwa.jpg" alt="T-Shirts" />
                        </div>
                        <div className="home-category-info dark-card-info">
                            <h3>T-Shirts</h3>
                            <span>SHOP NOW →</span>
                        </div>
                    </Link>

                    <Link to="/products?category=2" className="home-category-card">
                        <div className="home-category-image">
                            <img src="/images/wajelwa.jpg" alt="Hoodies" />
                        </div>
                        <div className="home-category-info dark-card-info">
                            <h3>Hoodies</h3>
                            <span>SHOP NOW →</span>
                        </div>
                    </Link>

                    <Link to="/products?category=3" className="home-category-card">
                        <div className="home-category-image">
                            <img src="/images/wajelwa.jpg" alt="Designer Prints" />
                        </div>
                        <div className="home-category-info dark-card-info">
                            <h3>Designer Prints</h3>
                            <span>SHOP NOW →</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* FEATURED PRODUCTS (6 Grid) */}
            <section className="home-featured-section">
                <div className="section-heading">
                    <p>CURATED FOR YOU</p>
                    <h2>FEATURED DROPS</h2>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#111111' }}>Loading products...</p>
                ) : (
                    <div className="home-product-grid">
                        {products.map((product) => (
                            /* FIXED: Added 's' to /products/ */
                            <Link to={`/products/${product.product_id}`} className="home-product-card" key={product.product_id}>
                                <div className="home-product-image">
                                    <img
                                        src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : 'https://via.placeholder.com/400x400?text=No+Image'}
                                        alt={product.product_name}
                                    />
                                    {product.stock_quantity <= 0 && (
                                        <div className="home-sold-out">SOLD OUT</div>
                                    )}
                                </div>
                                <div className="home-product-info">
                                    <h3>{product.product_name}</h3>
                                    <span>R{formatPrice(product.price)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Link to="/products" className="view-all-btn-dark">
                        VIEW ALL PRODUCTS
                    </Link>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="home-testimonials-section">
                <div className="section-heading">
                    <p>REAL PEOPLE, REAL STYLE</p>
                    <h2>WHAT THEY'RE SAYING</h2>
                </div>

                <div className="home-testimonials-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="home-testimonial-card">
                            <div className="home-stars">
                                {'★'.repeat(review.rating)}
                                <span>{'★'.repeat(5 - review.rating)}</span>
                            </div>
                            <p className="home-review-text">"{review.text}"</p>
                            <div className="home-reviewer">
                                <div className="home-reviewer-initial">{review.initial}</div>
                                <div>
                                    <h4>{review.name}</h4>
                                    <p>{review.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* BRAND STORY */}
            <section className="brand-story">
                <div className="story-content">
                    <p>THE WAJELWA WAY</p>
                    <h2>
                        DESIGNED
                        <br />
                        TO STAND OUT
                    </h2>
                    <p className="story-text">
                        Clothing that represents individuality.
                        Pieces created for people who aren't afraid
                        to express who they are.
                    </p>
                    <Link to="/about" className="story-button">
                        OUR STORY →
                    </Link>
                </div>
            </section>

            {/* SEASON CTA */}
            <section className="season-cta">
                <p>THE LATEST DROP</p>
                <h2>
                    NEW SEASON.
                    <br />
                    NEW ENERGY.
                </h2>
                <Link to="/products">
                    SHOP NOW
                </Link>
            </section>
        </div>
    );
};

export default Home;