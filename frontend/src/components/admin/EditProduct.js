import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: ''
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getById(id);
            const product = response.data;

            setFormData({
                product_name: product.product_name || '',
                description: product.description || '',
                price: product.price || '',
                stock_quantity: product.stock_quantity || '',
                category_id: product.category_id || ''
            });

            setExistingImages(product.image_urls || []);
        } catch (err) {
            setError('Failed to load product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.product_name || !formData.price || !formData.stock_quantity) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('product_name', formData.product_name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock_quantity', formData.stock_quantity);
            if (formData.category_id) {
                formDataToSend.append('category_id', formData.category_id);
            }

            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update product');
            }

            setSuccess('Product updated successfully!');

            setTimeout(() => {
                navigate('/admin');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to update product');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading product...</div>;

    return (
        <div className="admin-form-page">
            <div className="admin-form-container">
                <div className="form-header">
                    <h1>Edit Product</h1>
                    <Link to="/admin" className="back-btn">← Back to Dashboard</Link>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category ID (Optional)</label>
                        <input
                            type="number"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            placeholder="Enter category ID"
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Existing Images</label>
                        <div className="existing-images">
                            {existingImages.length > 0 ? (
                                existingImages.map((url, index) => (
                                    <div key={index} className="existing-image-item">
                                        <img
                                            src={`http://localhost:5000${url}`}
                                            alt={`Product ${index + 1}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No existing images</p>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Add New Images</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple
                                className="file-input"
                            />
                            <div className="upload-hint">
                                <span>📁 Click to upload additional images</span>
                                <span className="hint-text">PNG, JPG, GIF up to 5MB each</span>
                            </div>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="image-previews">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="preview-item">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating Product...' : 'Update Product'}
                        </button>
                        <Link to="/admin" className="cancel-btn">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;