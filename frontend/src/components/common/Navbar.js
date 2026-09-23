import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive(path)
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-gray-800'
        }`;

    return (
        <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            Wajelwa
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/products" className={navLinkClass('/products')}>Products</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className={navLinkClass('/cart')}>Cart</Link>
                                <Link to="/orders" className={navLinkClass('/orders')}>Orders</Link>
                                <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
                                <div className="flex items-center space-x-2 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {user?.fullName || 'User'}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 ml-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        <div className="ml-2">
                            <DarkModeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <DarkModeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                        <div className="flex flex-col space-y-2">
                            <Link to="/products" className={navLinkClass('/products')}>Products</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/cart" className={navLinkClass('/cart')}>Cart</Link>
                                    <Link to="/orders" className={navLinkClass('/orders')}>Orders</Link>
                                    <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className={navLinkClass('/login')}>Login</Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-center"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;