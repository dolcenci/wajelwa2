import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { profileService, orderService } from '../../services/api';

const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-gray-300';
const buttonClass = 'rounded-full border-2 border-black bg-white px-6 py-2 font-semibold text-black shadow-[2px_3px_0_#888] hover:bg-gray-100 disabled:opacity-50';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [address, setAddress] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled([profileService.getProfile(), orderService.getOrders()]).then(([p, o]) => {
      if (!active) return;
      if (p.status === 'fulfilled') {
        const data = p.value.data;
        setProfile(data);
        setForm({ full_name: data.full_name || '', email: data.email || '' });
        setAddress(data.shipping_address || '');
      } else {
        setError(p.reason.response?.data?.message || 'Failed to load profile');
      }
      if (o.status === 'fulfilled') setOrders(Array.isArray(o.value.data) ? o.value.data : o.value.data?.orders || []);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const runSave = async (section, request, onSuccess) => {
    setSaving(section);
    setError('');
    setMessage('');
    try {
      const response = await request();
      onSuccess(response.data);
      setMessage(section === 'password' ? 'Password updated successfully' : 'Changes saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes. Please try again.');
    } finally {
      setSaving('');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-[#e9e9e9] grid place-items-center">Loading profile...</div>;

  return (
    <main className="min-h-screen bg-[#e9e9e9] p-4 sm:p-6 lg:p-8 text-[#242424]">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="bg-black px-6 py-8 text-white sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-light tracking-tight">WAJELWA</Link>
            <button onClick={logout} className="rounded-full border border-white px-5 py-2 text-sm hover:bg-white hover:text-black">Logout</button>
          </div>
          <h1 className="mt-8 text-4xl font-bold">My Profile</h1>
          <p className="mt-2 text-gray-300">Your details, delivery address and orders</p>
        </header>

        <div className="space-y-6 p-5 sm:p-8 lg:p-10">
          {message && <div role="status" className="rounded-xl bg-green-100 p-4 text-green-800">{message}</div>}
          {error && <div role="alert" className="rounded-xl bg-red-100 p-4 text-red-800">{error}</div>}
          {!profile ? <p>Profile unavailable. Please sign in again.</p> : <>
            <section className="rounded-2xl bg-[#c8c8c8] p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-black text-2xl font-semibold text-white" aria-hidden="true">{profile.full_name?.charAt(0)?.toUpperCase() || 'W'}</div>
                <div className="min-w-0"><h2 className="break-words text-2xl font-bold">{profile.full_name}</h2><p className="break-all text-sm">{profile.email}</p><p className="mt-1 text-xs">Customer</p></div>
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Personal information</h2>{!editingProfile && <button className="text-sm font-semibold underline" onClick={() => setEditingProfile(true)}>Edit</button>}</div>
                {editingProfile ? <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); runSave('profile', () => profileService.updateProfile(form), (data) => { setProfile(data); setForm({ full_name: data.full_name, email: data.email }); setEditingProfile(false); }); }}>
                  <label className="block text-sm font-semibold">Full name<input required maxLength={100} autoComplete="name" className={`${inputClass} mt-2`} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></label>
                  <label className="block text-sm font-semibold">Email<input required type="email" maxLength={100} autoComplete="email" className={`${inputClass} mt-2`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                  <div className="flex flex-wrap gap-3"><button className={buttonClass} disabled={!!saving}>{saving === 'profile' ? 'Saving...' : 'Save'}</button><button type="button" className="px-3 underline" onClick={() => { setForm({ full_name: profile.full_name, email: profile.email }); setEditingProfile(false); }}>Cancel</button></div>
                </form> : <dl className="space-y-4"><div><dt className="text-sm text-gray-600">Full name</dt><dd className="font-medium">{profile.full_name}</dd></div><div><dt className="text-sm text-gray-600">Email</dt><dd className="break-all font-medium">{profile.email}</dd></div></dl>}
              </section>

              <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Delivery address</h2>{!editingAddress && <button className="text-sm font-semibold underline" onClick={() => setEditingAddress(true)}>Edit</button>}</div>
                {editingAddress ? <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); runSave('address', () => profileService.updateAddress({ shipping_address: address }), (data) => { setProfile(data); setAddress(data.shipping_address || ''); setEditingAddress(false); }); }}>
                  <label className="block text-sm font-semibold">Shipping address<textarea rows={4} maxLength={1000} className={`${inputClass} mt-2`} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, suburb, city, province, postal code" /></label>
                  <div className="flex flex-wrap gap-3"><button className={buttonClass} disabled={!!saving}>{saving === 'address' ? 'Saving...' : 'Save address'}</button><button type="button" className="px-3 underline" onClick={() => { setAddress(profile.shipping_address || ''); setEditingAddress(false); }}>Cancel</button></div>
                </form> : <p className="whitespace-pre-line text-gray-700">{profile.shipping_address || 'No delivery address saved yet.'}</p>}
              </section>

              <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">Recent orders</h2>
                {orders.length ? <div className="divide-y divide-gray-200">{orders.slice(0, 3).map((order) => <div key={order.order_id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="font-semibold">#WJ{String(order.order_id).padStart(5, '0')}</span><span>R{Number(order.total_amount || 0).toFixed(2)}</span><span className="text-gray-600">{order.status || 'Pending'}</span></div>)}</div> : <p className="text-gray-600">No orders yet.</p>}
                <Link to="/orders" className="mt-5 inline-block font-semibold underline">View all orders</Link>
              </section>

              <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">Security</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (passwords.newPassword.length < 6) { setError('Password must be at least 6 characters'); return; } runSave('password', () => profileService.updatePassword(passwords), () => setPasswords({ currentPassword: '', newPassword: '' })); }}>
                  <label className="block text-sm font-semibold">Current password<input required type="password" autoComplete="current-password" className={`${inputClass} mt-2`} value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label>
                  <label className="block text-sm font-semibold">New password<input required minLength={6} type="password" autoComplete="new-password" className={`${inputClass} mt-2`} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label>
                  <button className={buttonClass} disabled={!!saving}>{saving === 'password' ? 'Updating...' : 'Update password'}</button>
                </form>
              </section>
            </div>
          </>}
        </div>
      </div>
    </main>
  );
};

export default Profile;