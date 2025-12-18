// ===========================================
// SERVER/server.js - UPDATED
// ===========================================
import dotenv from 'dotenv';
// Call config immediately after importing it
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Import routes (These will now have access to process.env)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import mealRoutes from './routes/meals.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import requestRoutes from './routes/requests.js';
import paymentRoutes from './routes/payment.js';
import statisticsRoutes from './routes/statistics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://b12a11server.vercel.app',
        'https://b12a11-imtiaz-local-chef-bazaar.netlify.app', // Your deployed client URL
        process.env.CLIENT_URL,
        process.env.CLIENT_URL_PRODUCTION
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'LocalChefBazaar API is running',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
