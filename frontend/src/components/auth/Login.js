import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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

      <section className="min-h-[550px] lg:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-5 py-12 bg-black text-white">
        <h2 className="text-5xl font-bold mb-8">Login</h2>
        <div className="w-full max-w-[360px] rounded-xl bg-[#c8c8c8] px-7 sm:px-9 py-9 text-black shadow-xl">
          {error && <div role="alert" className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email:</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="Enter email address" className="w-full h-11 rounded-xl bg-white px-4 text-center text-sm outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password:</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} placeholder="Enter Password" className="w-full h-11 rounded-xl bg-white pl-4 pr-12 text-center text-sm outline-none focus:ring-2 focus:ring-black" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl leading-none" >{showPassword ? '◉' : '◎'}</button>
              </div>
            </div>
            <div className="text-center text-sm leading-tight">
              <span>Or<br />Sign in with:</span>
              <div className="flex items-center justify-center gap-6 mt-3" aria-label="Social sign-in options shown in reference">
                <span className="text-2xl font-bold text-blue-600" aria-hidden="true">G</span>
                <span className="text-2xl" aria-hidden="true">●</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4267B2] text-white text-xl font-bold" aria-hidden="true">f</span>
              </div>
            </div>
            <button type="submit" disabled={loading} className="block w-full rounded-full border-2 border-[#292929] bg-[#f6f6f6] py-2 font-bold shadow-[1px_3px_2px_#777] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm">New here? <Link to="/register" className="font-semibold underline">Sign up</Link></p>
        </div>
      </section>
      </div>
    </main>
  );
};

export default Login;