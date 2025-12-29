// ========================================================
// server/server.js - COMPLETE VERCEL-READY VERSION
// ========================================================
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import mealRoutes from './routes/meals.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import requestRoutes from './routes/requests.js';
import paymentRoutes from './routes/payment.js';
import statisticsRoutes from './routes/statistics.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CRITICAL: CORS must come FIRST
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://b12-a11-client.vercel.app',
    'https://b12a11client.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle OPTIONS preflight
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// ✅ CRITICAL: Log ALL headers
app.use((req, res, next) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('🌐 Origin:', req.headers.origin);
  console.log('🔑 Authorization:', req.headers.authorization || 'MISSING');
  console.log('📦 All Headers:', JSON.stringify(req.headers, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  next();
});

connectDB();

app.get('/', (req, res) => {
  res.json({
    message: 'LocalChefBazaar API Running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
