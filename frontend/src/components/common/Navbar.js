import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [shopOpen, setShopOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="navbar">

            <div className="nav-container">
<div className="nav-actions">
                {/* LOGO / HOME */}
                <Link to="/" className="nav-logo">
                   <img src="/images/wajelwaLogo.png" alt="Wajelwa" className="nav-logo-image"/>
                </Link>

                {/* NAVIGATION */}
               
                    {/* SHOP DROPDOWN */}
                    <div
                        className="nav-dropdown"
                        onMouseEnter={() => setShopOpen(true)}
                        onMouseLeave={() => setShopOpen(false)}
                    >
                        <button className="nav-item shop-button">
                            Shop 
                            <span className="dropdown-arrow">⌄</span>
                        </button>

                        {shopOpen && (
                            <div className="dropdown-menu">

                                <Link to="/products">
                                    All Products
                                </Link>

                                <Link to="/products?category=1">
                                    T-Shirts
                                </Link>

                                <Link to="/products?category=2">
                                    Hoodies
                                </Link>

                                <Link to="/products?category=3">
                                    Designer Prints
                                </Link>

                            </div>
                        )}
                    </div>

                    <Link to="/about" className="nav-item">
                        About Us
                    </Link>

                    <Link to="/support" className="nav-item">
                        Support
                    </Link>
</div>
                

                {/* RIGHT SIDE ICONS */}
                <div className="nav-actions">

                    {/* SEARCH */}
                    <button
                        className="nav-icon"
                        aria-label="Search"
                        onClick={() => navigate('/products')}
                    >
                        <svg viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7"></circle>
                            <line x1="16.5" y1="16.5" x2="22" y2="22"></line>
                        </svg>
                    </button>

                    {/* ACCOUNT */}
                    <button
                        className="nav-icon"
                        aria-label="Account"
                        onClick={() =>
                            navigate(isAuthenticated ? '/profile' : '/login')
                        }
                    >
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4"></circle>
                            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"></path>
                        </svg>
                    </button>

                    {/* CART */}
                    <button
                        className="nav-icon cart-icon"
                        aria-label="Cart"
                        onClick={() => navigate('/cart')}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M3 4h2l2 12h10l3-9H6"></path>
                            <circle cx="9" cy="20" r="1"></circle>
                            <circle cx="17" cy="20" r="1"></circle>
                        </svg>
                    </button>

                </div>

            </div>
        </header>
    );
};

export default Navbar;