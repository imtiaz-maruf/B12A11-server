// ===========================================
// SERVER/index.js - COMPLETE REWRITE
// ===========================================
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import mealRoutes from './routes/meals.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import requestRoutes from './routes/requests.js';
import paymentRoutes from './routes/payment.js';
import statisticsRoutes from './routes/statistics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CRITICAL: Trust proxy for Vercel
app.set('trust proxy', 1);

// ✅ CRITICAL: CORS Configuration for Production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://b12-a11-client.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174'
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ✅ CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'LocalChefBazaar API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ CORS enabled for: https://b12-a11-client.vercel.app`);
});

export default app;