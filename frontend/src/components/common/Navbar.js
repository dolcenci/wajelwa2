import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🛍️ Wajelwa
                </Link>

                <div className="nav-links">
                    <Link to="/products" className="nav-link">Products</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="nav-link">Cart</Link>
                            <Link to="/orders" className="nav-link">Orders</Link>
                            <Link to="/admin" className="nav-link nav-admin">Admin</Link>
                            <span className="nav-user">👋 {user?.fullName || 'User'}</span>
                            <button onClick={handleLogout} className="nav-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link nav-register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;