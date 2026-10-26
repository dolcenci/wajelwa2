const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const profileRoutes = require('./routes/profileRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const paymentController = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Stripe webhook must receive raw body — mount before express.json()
app.post(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' }),
    paymentController.handleWebhook
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Images are served from Neon Object Storage, so the local static route is no longer needed.
// app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/profile', profileRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Wajelwa Backend is running successfully!' });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});