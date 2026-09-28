import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-top">

                {/* BRAND */}
                <div className="footer-brand">
                    <h2>WAJELWA</h2>
                    <p>
                        Designed to stand out.
                    </p>
                </div>


                {/* SHOP */}
                <div className="footer-column">
                    <h3>SHOP</h3>

                    <Link to="/products?category=hoodies">
                        Hoodies
                    </Link>

                    <Link to="/products?category=tshirts">
                        T-Shirts
                    </Link>

                    <Link to="/products?category=sweaters">
                        Sweaters
                    </Link>
                </div>


                {/* CUSTOMER CARE */}
                <div className="footer-column">
                    <h3>CUSTOMER CARE</h3>

                    <Link to="/support">
                        Support
                    </Link>

                    <Link to="/support">
                        Returns
                    </Link>

                    <Link to="/support">
                        FAQs
                    </Link>
                </div>


                {/* COMPANY */}
                <div className="footer-column">
                    <h3>COMPANY</h3>

                    <Link to="/about">
                        About Us
                    </Link>

                    <Link to="/support">
                        Contact
                    </Link>
                </div>


                {/* FOLLOW US */}
                <div className="footer-column">
                    <h3>FOLLOW US</h3>

                    <a href="#instagram">
                        Instagram
                    </a>

                    <a href="#facebook">
                        Facebook
                    </a>

                    <a href="#twitter">
                        Twitter
                    </a>
                </div>

            </div>


            {/* BOTTOM */}
            <div className="footer-bottom">
                <p>
                    © 2026 Wajelwa. All rights reserved.
                </p>
            </div>

        </footer>
    );
};

export default Footer;