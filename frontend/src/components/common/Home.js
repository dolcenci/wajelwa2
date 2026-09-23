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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-900 dark:to-indigo-900">
                <div className="max-w-6xl mx-auto px-6 py-24">
                    <div className="text-center">
                        <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-4">
                            Premium Quality
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Designer Printed T-Shirts & Hoodies
                        </h1>
                        <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-10">
                            Discover our exclusive collection of premium designer prints. 
                            Each piece is crafted with attention to detail and made to last.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link 
                                to="/products" 
                                className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                            {!isAuthenticated && (
                                <Link 
                                    to="/register" 
                                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-colors"
                                >
                                    Join Wajelwa
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                                500+
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Happy Customers
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                                100+
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Unique Designs
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                                98%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Satisfaction Rate
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">
                        Featured
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Best Sellers
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3">
                        Our most popular designs loved by customers worldwide
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No products available yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product) => (
                            <div 
                                key={product.product_id}
                                onClick={() => navigate(`/product/${product.product_id}`)}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                            >
                                <div className="bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center">
                                    <img 
                                        src={`https://via.placeholder.com/300x300/667eea/ffffff?text=${product.product_name ? product.product_name.substring(0, 8) : 'Product'}`}
                                        alt={product.product_name || 'Product'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                        {product.product_name || 'Product'}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-400 font-bold">
                                        ${formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link 
                        to="/products" 
                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                    >
                        View All Products
                    </Link>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-900 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Why Choose Wajelwa
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-4xl mb-4">🚚</p>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Free Shipping
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                On all orders over R500
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-4xl mb-4">🔄</p>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Easy Returns
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                30-day return policy
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-4xl mb-4">🔒</p>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Secure Payment
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Encrypted transactions
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-4xl mb-4">💎</p>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Premium Quality
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quality craftsmanship
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 rounded-2xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Upgrade Your Style?
                    </h2>
                    <p className="text-purple-100 max-w-2xl mx-auto mb-8">
                        Join thousands of satisfied customers who have discovered the perfect blend 
                        of comfort and style with Wajelwa.
                    </p>
                    <Link 
                        to="/products" 
                        className="inline-block bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Explore Collection
                    </Link>
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white dark:bg-gray-900 py-16">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <p className="text-4xl mb-4">✉️</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Stay in the Loop
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Subscribe for exclusive offers and early access to new drops
                    </p>
                    <form 
                        className="flex flex-col sm:flex-row gap-3" 
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                        No spam, unsubscribe anytime
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;