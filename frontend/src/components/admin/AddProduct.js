import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        if (!formData.product_name || !formData.price || !formData.stock_quantity) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart/form-data upload
            const formDataToSend = new FormData();
            formDataToSend.append('product_name', formData.product_name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock_quantity', formData.stock_quantity);
            if (formData.category_id) {
                formDataToSend.append('category_id', formData.category_id);
            }

            // Append images
            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            // Use fetch with the token
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create product');
            }

            const data = await response.json();
            setSuccess('Product created successfully!');

            // Reset form
            setFormData({
                product_name: '',
                description: '',
                price: '',
                stock_quantity: '',
                category_id: ''
            });
            setImages([]);
            setImagePreviews([]);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/admin');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to create product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-page">
            <div className="admin-form-container">
                <div className="form-header">
                    <h1>Add New Product</h1>
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
                        <label>Product Images</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple
                                className="file-input"
                            />
                            <div className="upload-hint">
                                <span>📁 Click to upload images</span>
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
                            disabled={loading}
                        >
                            {loading ? 'Creating Product...' : 'Create Product'}
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

export default AddProduct;