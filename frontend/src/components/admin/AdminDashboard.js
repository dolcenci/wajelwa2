import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            setProducts(response.data || []);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            setDeleting(productId);
            await productService.delete(productId);
            setProducts(products.filter(p => p.product_id !== productId));
        } catch (err) {
            setError('Failed to delete product');
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeleting(null);
        }
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage your Wajelwa product catalog
                        </p>
                    </div>
                    <Link
                        to="/admin/add-product"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Product
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Products</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{products.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl">
                                📦
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">In Stock</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {products.filter(p => p.stock_quantity > 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl">
                                ✅
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Out of Stock</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {products.filter(p => p.stock_quantity === 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-2xl">
                                ⚠️
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No products yet. Add your first product!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={product.image_urls && product.image_urls.length > 0
                                                    ? `http://localhost:5000${product.image_urls[0]}`
                                                    : 'https://via.placeholder.com/50x50?text=No+Img'
                                                }
                                                alt={product.product_name}
                                                className="w-14 h-14 object-cover rounded-lg shadow"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {product.product_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                            ${formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    product.stock_quantity > 0
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                                }`}>
                                                    {product.stock_quantity > 0 ? `${product.stock_quantity} units` : 'Out of Stock'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/edit-product/${product.product_id}`}
                                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.product_id)}
                                                    disabled={deleting === product.product_id}
                                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === product.product_id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;