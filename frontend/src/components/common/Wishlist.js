import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlistService } from '../../services/api';


const Wishlist = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        loadWishlist();
    }, [navigate]);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await wishlistService.getAll();
            setItems(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Could not load your wishlist.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            setRemovingId(productId);
            setError('');

            await wishlistService.remove(productId);

            setItems(current =>
                current.filter(item =>
                    Number(item.product_id) !== Number(productId)
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Could not remove the product.'
            );
        } finally {
            setRemovingId(null);
        }
    };

    const handleMoveToCart = (productId) => {
        navigate(`/products/${productId}?from=wishlist`);
    };

    if (loading) {
        return (
            <div className="wishlist-page">
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <p>YOUR WAJELWA ACCOUNT</p>
                    <h1>My Wishlist ♡</h1>
                    <span>
                        {items.length} saved
                        {items.length === 1 ? ' product' : ' products'}
                    </span>
                </div>

                {error && (
                    <div className="wishlist-error" role="alert">
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="wishlist-empty-icon">♡</div>
                        <h2>Your wishlist is empty</h2>
                        <p>
                            Explore Wajelwa and save your favourite styles.
                        </p>
                        <Link
                            to="/products"
                            className="wishlist-shop-btn"
                        >
                            EXPLORE PRODUCTS
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {items.map(item => {
                            const outOfStock =
                                Number(item.stock_quantity) <= 0;

                            return (
                                <div
                                    className="wishlist-card"
                                    key={item.wishlist_item_id}
                                >
                                    <Link
                                        to={`/products/${item.product_id}`}
                                        className="wishlist-image-link"
                                    >
                                        {item.image_urls?.length > 0 ? (
                                            <img
                                                src={item.image_urls[0]}
                                                alt={item.product_name}
                                            />
                                        ) : (
                                            <div className="wishlist-no-image">
                                                WAJELWA
                                            </div>
                                        )}
                                    </Link>

                                    <div className="wishlist-info">
                                        <h3>{item.product_name}</h3>

                                        <p className="wishlist-price">
                                            R{Number(item.price).toFixed(2)}
                                        </p>

                                        {outOfStock && (
                                            <p className="wishlist-stock">
                                                Out of Stock
                                            </p>
                                        )}

                                        <button
                                            className="wishlist-move-btn"
                                            disabled={outOfStock}
                                            onClick={() =>
                                                handleMoveToCart(
                                                    item.product_id
                                                )
                                            }
                                        >
                                            {outOfStock
                                                ? 'UNAVAILABLE'
                                                : 'MOVE TO CART'}
                                        </button>

                                        <button
                                            className="wishlist-remove-btn"
                                            disabled={
                                                removingId === item.product_id
                                            }
                                            onClick={() =>
                                                handleRemove(
                                                    item.product_id
                                                )
                                            }
                                        >
                                            {removingId === item.product_id
                                                ? 'Removing...'
                                                : '♡ Remove from Wishlist'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
