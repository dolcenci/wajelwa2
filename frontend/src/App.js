import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import Home from './components/common/Home';
import AboutUS from './components/common/AboutUs';
import Support from './components/common/Support';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Orders from './components/orders/Orders';
import AdminDashboard from './components/admin/AdminDashboard';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import AdminLogin from './components/admin/AdminLogin';
import AuditLogs from './components/admin/AuditLogs';
import Footer from './components/common/Footer';
import Profile from './components/common/Profile';
import Checkout from './components/cart/checkout';
import OrderConfirmation from './components/orders/OrderConfirmation';
import Wishlist from './components/common/Wishlist';
import Chatbot from './components/common/Chatbot';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    return children;
};

// SECURE ADMIN ROUTE
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // If not logged in at all, send to admin login
    if (!token) {
        return <Navigate to="/admin/login" />;
    }

    // If logged in but NOT an admin, send to home page (unauthorized)
    if (!user.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/about" element={<AboutUS />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

                    {/* SEPARATE ADMIN LOGIN */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* SECURED ADMIN ROUTES */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
                    <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
                    <Route path="/admin/logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
                </Routes>
                <Footer />
                <Chatbot />
            </div>
        </Router>
    );
}

export default App;