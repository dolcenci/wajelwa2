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
import Footer from './components/common/Footer';


// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
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
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />
                <Route path="/admin/add-product" element={
                    <AdminRoute>
                        <AddProduct />
                    </AdminRoute>
                } />
                <Route path="/admin/edit-product/:id" element={
                    <AdminRoute>
                        <EditProduct />
                    </AdminRoute>
                } />
            </Routes>
            <Footer />
        </div>
    </Router>
);

}

export default App;