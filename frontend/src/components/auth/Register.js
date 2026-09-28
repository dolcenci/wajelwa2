import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
const inputClass = 'w-full h-11 rounded-xl bg-white px-4 text-center text-sm outline-none focus:ring-2 focus:ring-black';

  return (
    <main className="min-h-screen bg-[#e9e9e9] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="grid lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
      <section className="min-h-[280px] lg:min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center px-6 text-[#242424]" aria-label="Wajelwa brand">
        <div className="w-full max-w-[450px] text-center">
          <div className="flex items-end justify-center gap-4 sm:gap-8 mb-3">
            <span className="text-lg sm:text-xl pb-1">EST.</span>
            <span className="block w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[14px] sm:border-[18px] border-[#242424]" aria-hidden="true" />
            <span className="text-lg sm:text-xl pb-1">2019</span>
          </div>
          <h1 className="text-5xl sm:text-6xl tracking-tight font-light leading-none">WAJELWA</h1>
          <p className="mt-2 text-sm">Designed To Stand Out</p>
        </div>
      </section>

      <section className="min-h-[650px] lg:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-5 py-12 bg-black text-white">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8">Register</h2>
        <div className="w-full max-w-[360px] rounded-xl bg-[#c8c8c8] px-7 sm:px-9 py-8 text-black shadow-xl">
          {error && <div role="alert" className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold mb-2">Full Name:</label>
              <input id="full_name" type="text" name="full_name" autoComplete="name" value={formData.full_name} onChange={handleChange} required placeholder="Enter full name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email:</label>
              <input id="email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password:</label>
              <input id="password" type="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" className={inputClass} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password:</label>
              <input id="confirmPassword" type="password" name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat your password" className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className="block w-full rounded-full border-2 border-[#292929] bg-[#f6f6f6] py-2 font-bold shadow-[1px_3px_2px_#777] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm">Already have an account? <Link to="/login" className="font-semibold underline">Sign in</Link></p>
        </div>
      </section>
      </div>
    </main>
  );
};

export default Register;