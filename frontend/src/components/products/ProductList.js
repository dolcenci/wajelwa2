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
            setProducts(response.data);
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

    // Helper function to safely format price
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="products-page">
            <h1>Our Products</h1>

            <div className="filter-section">
                <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <button onClick={clearFilters} className="filter-clear">
                    Clear
                </button>
            </div>

            <div className="product-grid">
                {products.length === 0 ? (
                    <p className="no-products">No products found</p>
                ) : (
                    products.map((product) => (
                        <div key={product.product_id} className="product-card">
                            <Link to={`/product/${product.product_id}`}>
                                <div className="product-image">
                                    <img
                                        src={`https://via.placeholder.com/300x300?text=${product.product_name ? product.product_name.substring(0, 10) : 'Product'}`}
                                        alt={product.product_name || 'Product'}
                                    />
                                </div>
                                <h3 className="product-name">{product.product_name || 'Unnamed Product'}</h3>
                                <p className="product-price">${formatPrice(product.price)}</p>
                                <p className="product-stock">
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;