import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: (userData) => API.post('/users/register', userData),
    login: (credentials) => API.post('/users/login', credentials),
    getProfile: () => API.get('/users/profile'),
    updateProfile: (data) => API.put('/users/profile', data),
};

export const productService = {
    getAll: (params) => API.get('/products', { params }),
    getById: (id) => API.get(`/products/${id}`),
    create: (data) => API.post('/products', data),
    delete: (id) => API.delete(`/products/${id}`),
};

export const cartService = {
    getCart: () => API.get('/cart'),
    addItem: (data) => API.post('/cart/add', data),
    updateItem: (cartItemId, data) => API.put(`/cart/${cartItemId}`, data),
    removeItem: (cartItemId) => API.delete(`/cart/${cartItemId}`),
    clearCart: () => API.delete('/cart'),
};

export const orderService = {
    createOrder: (data) => API.post('/orders', data),
    getOrders: () => API.get('/orders'),
    getOrderById: (id) => API.get(`/orders/${id}`),
};

export const profileService = {
    getProfile: () => API.get('/users/profile'),
    updateProfile: (data) => API.put('/users/profile', data),
    updateAddress: (data) => API.put('/users/profile/address', data),
    updatePassword: (data) => API.put('/users/profile/password', data),
};

export const wishlistService = {
    getAll: () => API.get('/wishlist'),
    add: (productId) => API.post('/wishlist', { productId }),
    remove: (productId) => API.delete(`/wishlist/${productId}`),
};

export const paymentService = {
    createPaymentIntent: (orderId) =>
        API.post('/payments/create-payment-intent', { orderId }),
    confirmPayment: (paymentIntentId) =>
        API.post('/payments/confirm-payment', { paymentIntentId }),
};

export const chatbotService = {
    sendMessage: (message) => API.post('/chatbot/message', { message })
};

export default API;