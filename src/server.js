const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route files
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


// Serve static files (uploaded images) - THIS IS THE NEW LINE
//app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);



// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Wajelwa Backend is running successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Wajelwa Backend is running on http://localhost:${PORT}`);
    console.log(` API is available at http://localhost:${PORT}/api/`);
});