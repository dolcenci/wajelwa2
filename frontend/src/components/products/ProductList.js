import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Link, useSearchParams } from 'react-router-dom';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: '',
});
    useEffect(() => {
    fetchProducts();
}, [filters, searchParams]);

useEffect(() => {
    const categoryFromURL = searchParams.get('category') || '';

    setFilters(prev => ({
        ...prev,
        category: categoryFromURL
    }));
}, [searchParams]);

    const fetchProducts = async () => {
    try {
        setLoading(true);
        setError('');

        const response = await productService.getAll();

        let productList = response.data;

        // CATEGORY FILTER
        if (filters.category) {
            productList = productList.filter(
                product =>
                    Number(product.category_id) === Number(filters.category)
            );
        }

        // PRICE SORTING
        if (filters.sort === 'low-high') {
            productList.sort(
                (a, b) => Number(a.price) - Number(b.price)
            );
        }

        if (filters.sort === 'high-low') {
            productList.sort(
                (a, b) => Number(b.price) - Number(a.price)
            );
        }

        setProducts(productList);

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
    setFilters({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });
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

   <select
    name="category"
    value={filters.category}
    onChange={handleFilterChange}
    className="filter-input"
>
    <option value="">All Categories</option>
    <option value="1">T-Shirts</option>
    <option value="2">Hoodies</option>
    <option value="3">Designer Prints</option>
</select>

    <select
        name="sort"
        value={filters.sort}
        onChange={handleFilterChange}
        className="filter-input"
    >
        <option value="">Sort By</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
    </select>

    <button
        onClick={clearFilters}
        className="filter-clear"
    >
        Clear
    </button>

</div>

            <div className="product-grid">
    {products.length === 0 ? (
        <p className="no-products">No products found</p>
    ) : (
        products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.product_id}`}>
    <div className="product-image">
        {product.image_urls && product.image_urls.length > 0 ? (
            <img
                src={product.image_urls[0]}
                alt={product.product_name}
            />
        ) : (
            <div className="product-image-placeholder">
                No Image
            </div>
        )}
    </div>

    <h3 className="product-name">
        {product.product_name || 'Unnamed Product'}
    </h3>

    <p className="product-price">
        R{formatPrice(product.price)}
    </p>

    <p className="product-stock">
        {product.stock_quantity > 0
            ? 'In Stock'
            : 'Out of Stock'}
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