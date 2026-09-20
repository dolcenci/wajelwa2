import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
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
            console.error(err);
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

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <Link to="/admin/add-product" className="add-product-btn">
                    + Add New Product
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-number">{products.length}</span>
                    <span className="stat-label">Total Products</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {products.filter(p => p.stock_quantity > 0).length}
                    </span>
                    <span className="stat-label">In Stock</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {products.filter(p => p.stock_quantity === 0).length}
                    </span>
                    <span className="stat-label">Out of Stock</span>
                </div>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-products-msg">
                                No products found. Add your first product!
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.product_id}>
                                <td>
                                    <img
                                        src={product.image_urls && product.image_urls.length > 0
                                            ? `http://localhost:5000${product.image_urls[0]}`
                                            : 'https://via.placeholder.com/50x50?text=No+Image'
                                        }
                                        alt={product.product_name}
                                        className="admin-product-image"
                                    />
                                </td>
                                <td>{product.product_name}</td>
                                <td>${formatPrice(product.price)}</td>
                                <td>
                                        <span className={`stock-badge ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.stock_quantity > 0 ? product.stock_quantity : 'Out of Stock'}
                                        </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/admin/edit-product/${product.product_id}`}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.product_id)}
                                            className="delete-btn"
                                            disabled={deleting === product.product_id}
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
    );
};

export default AdminDashboard;