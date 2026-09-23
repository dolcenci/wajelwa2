import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService, cartService } from '../../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addMessage, setAddMessage] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getById(id);
            setProduct(response.data);
        } catch (err) {
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setAddingToCart(true);
            await cartService.addItem({ productId: parseInt(id), quantity });
            setAddMessage('Added to cart successfully!');
            setTimeout(() => setAddMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to cart');
            setTimeout(() => setError(''), 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) return 0;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <svg className="animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Link to="/products" className="text-purple-600 dark:text-purple-400 hover:underline">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const price = getPriceAsNumber(product.price);
    const inStock = product.stock_quantity > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <Link
                    to="/products"
                    className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
                >
                    ← Back to Products
                </Link>

                {addMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                        {addMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Product Image */}
                        <div className="bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center p-8">
                            <img
                                src={`https://via.placeholder.com/600x600/667eea/ffffff?text=${product.product_name ? product.product_name.substring(0, 10) : 'Product'}`}
                                alt={product.product_name || 'Product'}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="p-8 lg:p-12">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wide">
                                    {product.category_name || 'Uncategorized'}
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.product_name || 'Unnamed Product'}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    ${price.toFixed(2)}
                                </span>
                                {inStock ? (
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        ✓ In Stock ({product.stock_quantity})
                                    </span>
                                ) : (
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        ✗ Out of Stock
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                {product.description || 'No description available for this product.'}
                            </p>

                            {inStock && (
                                <div className="space-y-6">
                                    {/* Quantity Selector */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Quantity
                                        </label>
                                        <div className="inline-flex items-center border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="px-6 py-3 text-gray-900 dark:text-white font-semibold min-w-[60px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;