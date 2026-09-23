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

            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Add New Product
                    </h1>
                    <Link
                        to="/admin"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClass}>Product Name *</label>
                            <input
                                type="text"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleChange}
                                placeholder="e.g. Wajelwa Premium Hoodie"
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the product features, material, design..."
                                rows="4"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Price (USD) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Category ID (Optional)</label>
                            <input
                                type="number"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                placeholder="e.g. 1"
                                min="1"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Product Images</label>
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        Click to upload images
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        PNG, JPG, GIF up to 5MB each
                                    </span>
                                </div>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Product...' : 'Create Product'}
                            </button>
                            <Link
                                to="/admin"
                                className="px-8 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;