import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await API.post('/users/admin-login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin login failed.');
        } finally {
            setLoading(false);
        }
    };

    // Inline styles to guarantee visibility
    const inputStyle = {
        backgroundColor: '#ffffff',
        color: '#111111',
        WebkitTextFillColor: '#111111',
        border: '1px solid #d1d5db',
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        marginTop: '5px'
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold" style={{ color: '#111111' }}>Admin Portal</h2>
                    <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Restricted Access</p>
                </div>
                {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded text-sm text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label style={{ color: '#374151', fontWeight: 'bold', display: 'block' }}>Admin Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ color: '#374151', fontWeight: 'bold', display: 'block' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 rounded-md transition"
                        style={{ backgroundColor: '#111111', color: '#ffffff', fontWeight: 'bold' }}
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;