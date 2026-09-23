import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            
            const response = await productService.getAll(params);
            setProducts(response.data || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const clearFilters = () => {
        setFilters({ search: '', minPrice: '', maxPrice: '' });
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-xl max-w-md text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Our Products
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Browse our collection of designer printed t-shirts and hoodies
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <button 
                            onClick={clearFilters} 
                            className="px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                        <span className="text-6xl">🔍</span>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
                            No products found
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link 
                                key={product.product_id} 
                                to={`/product/${product.product_id}`}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                    <img 
                                        src={`https://via.placeholder.com/400x400/667eea/ffffff?text=${product.product_name ? product.product_name.substring(0, 8) : 'Product'}`}
                                        alt={product.product_name || 'Product'}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.stock_quantity > 0 ? (
                                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {product.product_name || 'Unnamed Product'}
                                    </h3>
                                    <p className="text-purple-600 dark:text-purple-400 font-bold text-lg mt-1">
                                        ${formatPrice(product.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;