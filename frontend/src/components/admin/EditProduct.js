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
    const [formData, setFormData] = useState({ product_name: '', description: '', price: '', stock_quantity: '', category_id: '' });
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
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
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
            if (formData.category_id) formDataToSend.append('category_id', formData.category_id);
            images.forEach((image) => formDataToSend.append('images', image));

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataToSend
            });

            if (!response.ok) throw new Error('Failed to update product');

            setSuccess('Product updated successfully!');
            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    // INLINE STYLES TO GUARANTEE VISIBILITY
    const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#111111' };
    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#111111',
        WebkitTextFillColor: '#111111',
        marginBottom: '20px'
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#111111' }}>Loading product...</div>;

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111', margin: 0 }}>Edit Product</h1>
                    <Link to="/admin" style={{ color: '#4b5563', textDecoration: 'none' }}>← Back to Dashboard</Link>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
                {success && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Product Name *</label>
                    <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} style={inputStyle} required />

                    <label style={labelStyle}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={inputStyle} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Price (R) *</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Stock Quantity *</label>
                            <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} min="0" style={inputStyle} required />
                        </div>
                    </div>

                    <label style={labelStyle}>Category ID (Optional)</label>
                    <input type="number" name="category_id" value={formData.category_id} onChange={handleChange} min="1" style={inputStyle} />

                    {existingImages.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Existing Images</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {existingImages.map((url, index) => (
                                    <img key={index} src={url} alt={`Product ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #27ae60' }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <label style={labelStyle}>Add New Images</label>
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '30px', textAlign: 'center', position: 'relative', cursor: 'pointer', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
                        <input type="file" accept="image/*" onChange={handleImageChange} multiple style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <span style={{ fontSize: '24px' }}>📁</span>
                        <p style={{ color: '#4b5563', margin: '10px 0 0 0' }}>Click to upload additional images</p>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {imagePreviews.map((preview, index) => (
                                <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button type="submit" disabled={submitting} style={{ flex: 1, padding: '15px', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                            {submitting ? 'Updating Product...' : 'Update Product'}
                        </button>
                        <Link to="/admin" style={{ padding: '15px 30px', backgroundColor: '#e5e7eb', color: '#111111', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;