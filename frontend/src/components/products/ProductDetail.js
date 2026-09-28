
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
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    const [addingToCart, setAddingToCart] = useState(false);
    const [addMessage, setAddMessage] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('Fetching product ID:', id);

            const response = await productService.getById(id);

            console.log('Product received:', response.data);

            const productData = response.data;
console.log('PRODUCT DATA:', productData);
            setProduct(productData);

            // Select first colour
            if (productData.colors && productData.colors.length > 0) {
                setSelectedColor(productData.colors[0]);
            }

            // Select first size
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[0]);
            }

            // Select first image
            if (
                productData.image_urls &&
                productData.image_urls.length > 0
            ) {
                setSelectedImage(productData.image_urls[0]);
            }

        } catch (err) {
            console.error('Product loading error:', err);
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

        if (!selectedColor) {
            setError('Please select a colour');
            return;
        }

        if (!selectedSize) {
            setError('Please select a size');
            return;
        }

        try {
            setAddingToCart(true);
            setError('');
            setAddMessage('');

            await cartService.addItem({
                productId: parseInt(id),
                quantity: quantity,
                color: selectedColor,
                size: selectedSize
            });

            setAddMessage('Added to cart successfully!');

            setTimeout(() => {
                setAddMessage('');
            }, 3000);

        } catch (err) {
            console.error('Add to cart error:', err);

            setError(
                err.response?.data?.message ||
                'Failed to add product to cart'
            );

            setTimeout(() => {
                setError('');
            }, 3000);

        } finally {
            setAddingToCart(false);
        }
    };

    const formatPrice = (price) => {
        const number = parseFloat(price);

        if (isNaN(number)) {
            return '0.00';
        }

        return number.toFixed(2);
    };

    const getColorClass = (color) => {
        return color.toLowerCase().replace(/\s+/g, '-');
    };

    // Loading
    if (loading) {
        return (
            <div className="loading">
                Loading product...
            </div>
        );
    }

    // Error
    if (error && !product) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    // No product
    if (!product) {
        return (
            <div className="error-message">
                Product not found
            </div>
        );
    }

    const productImages =
        product.image_urls &&
        product.image_urls.length > 0
            ? product.image_urls
            : [];

    return (
        <div className="product-detail-page">

            <div className="product-detail-container">

                {/* =========================
                    LEFT SIDE - PRODUCT IMAGE
                ========================== */}

                <div className="product-gallery">

                    {/* Thumbnails */}
                    {productImages.length > 0 && (
                        <div className="product-thumbnails">

                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${
                                        selectedImage === image
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedImage(image)
                                    }
                                >
                                    <img
                                        src={image}
                                        alt={`${product.product_name} ${index + 1}`}
                                    />
                                </button>
                            ))}

                        </div>
                    )}

                    {/* Main image */}
                    <div className="product-main-image">

                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.product_name}
                            />
                        ) : (
                            <div className="product-image-placeholder">
                                Product Image
                            </div>
                        )}

                    </div>

                </div>


                {/* =========================
                    RIGHT SIDE - PRODUCT INFO
                ========================== */}

                <div className="product-detail-info">

                    {/* Product name */}
                    <h1>
                        {product.product_name}
                    </h1>

                    {/* Category */}
                    {product.category_name && (
                        <p className="product-category">
                            {product.category_name}
                        </p>
                    )}

                    {/* Price */}
                    <h2 className="product-detail-price">
                        R{formatPrice(product.price)}
                    </h2>


                    {/* =========================
                        COLOURS
                    ========================== */}

                    {product.colors &&
                        product.colors.length > 0 && (

                        <div className="product-option">

                            <div className="option-title">
                                <strong>Colour:</strong>
                                <span>
                                    {selectedColor}
                                </span>
                            </div>

                            <div className="color-options">

                                {product.colors.map((color) => (

                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-option ${getColorClass(color)} ${
                                            selectedColor === color
                                                ? 'selected'
                                                : ''
                                        }`}
                                        aria-label={color}
                                        title={color}
                                        onClick={() =>
                                            setSelectedColor(color)
                                        }
                                    />

                                ))}

                            </div>

                        </div>

                    )}


                    {/* =========================
                        SIZES
                    ========================== */}

                    {product.sizes &&
                        product.sizes.length > 0 && (

                        <div className="product-option">

                            <div className="option-title">
                                <strong>Size:</strong>
                                <span>
                                    {selectedSize}
                                </span>
                            </div>

                            <div className="size-options">

                                {product.sizes.map((size) => (

                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-option ${
                                            selectedSize === size
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                    >
                                        {size}
                                    </button>

                                ))}

                            </div>

                        </div>

                    )}


                    {/* =========================
                        DESCRIPTION
                    ========================== */}

                    <p className="product-description">
                        {product.description ||
                            'No description available.'}
                    </p>


                    {/* =========================
                        STOCK
                    ========================== */}

                    <p className="product-stock">

                        {product.stock_quantity > 0
                            ? `${product.stock_quantity} available`
                            : 'Out of Stock'}

                    </p>


                    {/* =========================
                        QUANTITY
                    ========================== */}

                    {product.stock_quantity > 0 && (

                        <div className="quantity-selector">

                            <strong>
                                Quantity:
                            </strong>

                            <div className="quantity-controls">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                quantity - 1
                                            )
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock_quantity,
                                                quantity + 1
                                            )
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    )}


                    {/* =========================
                        ADD TO CART
                    ========================== */}

                    {product.stock_quantity > 0 && (

                        <button
                            type="button"
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                        >

                            {addingToCart
                                ? 'ADDING...'
                                : 'ADD TO CART'}

                        </button>

                    )}


                    {/* Success message */}
                    {addMessage && (
                        <p className="success-message">
                            {addMessage}
                        </p>
                    )}

                    {/* Error message */}
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ProductDetail;
