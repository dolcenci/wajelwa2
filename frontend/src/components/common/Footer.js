import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h2>WAJELWA</h2>
                    <p>Designed to stand out.</p>
                </div>

                <div className="footer-column">
                    <h3>SHOP</h3>
                    <Link to="/products?category=2">Hoodies</Link>
                    <Link to="/products?category=1">T-Shirts</Link>
                    <Link to="/products?category=3">Designer Prints</Link>
                </div>

                <div className="footer-column">
                    <h3>CUSTOMER CARE</h3>
                    <Link to="/support">Support</Link>
                    <Link to="/support">Returns</Link>
                    <Link to="/support">FAQs</Link>
                </div>

                <div className="footer-column">
                    <h3>COMPANY</h3>
                    <Link to="/about">About Us</Link>
                    <Link to="/support">Contact</Link>
                </div>

                <div className="footer-column">
                    <h3>FOLLOW US</h3>
                    <a href="#instagram">Instagram</a>
                    <a href="#facebook">Facebook</a>
                    <a href="#twitter">Twitter</a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Wajelwa. All rights reserved.</p>
                <span style={{ color: '#ddd' }}>|</span>
                <Link to="/admin/login" className="footer-admin-link">
                    Admin Portal
                </Link>
            </div>
        </footer>
    );
};

export default Footer;