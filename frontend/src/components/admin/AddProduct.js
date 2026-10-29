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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('product_name', formData.product_name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock_quantity', formData.stock_quantity);
            if (formData.category_id) {
                formDataToSend.append('category_id', formData.category_id);
            }
            images.forEach((image) => formDataToSend.append('images', image));

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create product');
            }

            setSuccess('Product created successfully!');

            setFormData({ product_name: '', description: '', price: '', stock_quantity: '', category_id: '' });
            setImages([]);
            setImagePreviews([]);

            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
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

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111', margin: 0 }}>Add New Product</h1>
                    <Link to="/admin" style={{ color: '#4b5563', textDecoration: 'none' }}>← Back to Dashboard</Link>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
                {success && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Product Name *</label>
                    <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="e.g. Wajelwa Premium Hoodie" style={inputStyle} required />

                    <label style={labelStyle}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product..." rows="4" style={inputStyle} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Price (R) *</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Stock Quantity *</label>
                            <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="0" min="0" style={inputStyle} required />
                        </div>
                    </div>

                    <label style={labelStyle}>Category ID (Optional)</label>
                    <input type="number" name="category_id" value={formData.category_id} onChange={handleChange} placeholder="e.g. 1" min="1" style={inputStyle} />

                    <label style={labelStyle}>Product Images</label>
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '30px', textAlign: 'center', position: 'relative', cursor: 'pointer', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
                        <input type="file" accept="image/*" onChange={handleImageChange} multiple style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <span style={{ fontSize: '24px' }}>📁</span>
                        <p style={{ color: '#4b5563', margin: '10px 0 0 0' }}>Click to upload images</p>
                        <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>PNG, JPG, GIF up to 5MB each</p>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {imagePreviews.map((preview, index) => (
                                <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: '15px', backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Creating Product...' : 'Create Product'}
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

export default AddProduct;