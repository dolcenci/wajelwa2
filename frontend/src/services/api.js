import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: 'https://wajelwa2.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request if it exists
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    register: (userData) => API.post('/users/register', userData),
    login: (credentials) => API.post('/users/login', credentials),
    getProfile: () => API.get('/users/profile'),
    updateProfile: (data) => API.put('/users/profile', data),
};

// Product Services
export const productService = {
    getAll: (params) => API.get('/products', { params }),
    getById: (id) => API.get(`/products/${id}`),
    create: (data) => API.post('/products', data),
    delete: (id) => API.delete(`/products/${id}`),
};

// Cart Services
export const cartService = {
    getCart: () => API.get('/cart'),
    addItem: (data) => API.post('/cart/add', data),
    updateItem: (cartItemId, data) => API.put(`/cart/${cartItemId}`, data),
    removeItem: (cartItemId) => API.delete(`/cart/${cartItemId}`),
    clearCart: () => API.delete('/cart'),
};

// Order Services
export const orderService = {
    createOrder: (data) => API.post('/orders', data),
    getOrders: () => API.get('/orders'),
    getOrderById: (id) => API.get(`/orders/${id}`),
};

// Profile Services
export const profileService = {
    getProfile: () => API.get('/users/profile'),
    updateProfile: (data) => API.put('/users/profile', data),
    updateAddress: (data) => API.put('/users/profile/address', data),
    updatePassword: (data) => API.put('/users/profile/password', data),
};

// Wishlist Services
export const wishlistService = {
    getAll: () => API.get('/wishlist'),
    add: (productId) => API.post('/wishlist', { productId }),
    remove: (productId) => API.delete(`/wishlist/${productId}`),
};

// Payment Services
export const paymentService = {
    createPaymentIntent: (orderId) => API.post('/payments/create-payment-intent', { orderId }),
    confirmPayment: (paymentIntentId) => API.post('/payments/confirm-payment', { paymentIntentId }),
};

// Chatbot Services (This was missing)
export const chatbotService = {
    sendMessage: (message) => API.post('/chatbot/message', { message })
};

export default API;