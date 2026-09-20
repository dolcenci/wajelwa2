import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
            console.error(err);
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
            await cartService.addItem({
                productId: parseInt(id),
                quantity: quantity
            });
            setAddMessage('Added to cart successfully!');
            setTimeout(() => setAddMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to cart');
            setTimeout(() => setError(''), 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    // Helper function to safely format price
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0.00';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    // Helper function to safely get price as number
    const getPriceAsNumber = (price) => {
        if (price === undefined || price === null) return 0;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    if (loading) return <div className="loading">Loading product...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Product not found</div>;

    const price = getPriceAsNumber(product.price);

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <div className="product-detail-image">
                    <img
                        src={`https://via.placeholder.com/500x500?text=${product.product_name ? product.product_name.substring(0, 10) : 'Product'}`}
                        alt={product.product_name || 'Product'}
                    />
                </div>

                <div className="product-detail-info">
                    <h1>{product.product_name || 'Unnamed Product'}</h1>
                    <p className="product-category">Category: {product.category_name || 'Uncategorized'}</p>
                    <p className="product-price">${formatPrice(product.price)}</p>
                    <p className="product-description">{product.description || 'No description available'}</p>
                    <p className="product-stock">
                        {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                    </p>

                    {product.stock_quantity > 0 && (
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock_quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock_quantity))}
                                />
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="add-to-cart-btn"
                                disabled={addingToCart}
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>

                            {addMessage && <p className="success-message">{addMessage}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;