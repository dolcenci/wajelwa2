import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            setProducts(response.data || []);
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

    return (
         <div className="wajelwa-home">
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">

                    <p className="hero-brand"><img src="/images/wajelwaheroLogo.jpeg" alt="Wajelwa" /></p>

                    <h1>
                        Designed
                        <br />
                        to <span>STAND OUT</span>
                    </h1>

                    <Link to="/products" className="hero-button">
                        SHOP NOW
                    </Link>

                </div>

                <div className="hero-image">
                    <img src="/images/wajelwaHero.png" alt="Wajelwa Hoodies" />
                </div>
            </section>
             {/* SHOP BY CATEGORY */}
            <section className="category-section">

                <div className="section-heading">
                    <h2>SHOP BY CATEGORY</h2>
                </div>

                <div className="category-grid">

    <Link 
        to="/products?category=1"
        className="category-card"
    >
        <div className="category-image">
            <img src="/images" alt="Wajelwa T-Shirts" />
        </div>

        <div className="category-info">
            <h3>T-Shirts</h3>
            <span>SHOP →</span>
        </div>
    </Link>


    <Link 
        to="/products?category=2"
        className="category-card"
    >
        <div className="category-image">
            <img src="/images/wajelwaHero.png" alt="Wajelwa Hoodies" />
        </div>

        <div className="category-info">
            <h3>Hoodies</h3>
            <span>SHOP →</span>
        </div>
    </Link>

    <Link 
        to="/products?category=3"
        className="category-card"
    >
        <div className="category-image">
            <img src="/images/sweater.jpg" alt="Wajelwa Sweaters" />
        </div>

        <div className="category-info">
            <h3>Designer Prints</h3>
            <span>SHOP →</span>
        </div>
    </Link>

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


            {/* INSTAGRAM */}
            <section className="instagram-section">

                <div className="section-heading">
                    <p>FOLLOW THE MOVEMENT</p>
                    <h2>@WAJELWA</h2>
                </div>

                <div className="instagram-grid">

                    <div className="instagram-placeholder"></div>
                    <div className="instagram-placeholder"></div>
                    <div className="instagram-placeholder"></div>
                    <div className="instagram-placeholder"></div>
                    <div className="instagram-placeholder"></div>

                </div>

            </section>

            
    
      
            
           
        </div>
    );
};

export default Home;