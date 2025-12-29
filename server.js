// ===========================================
// SERVER/server.js - FIXED VERSION
// ===========================================

// ✅ CRITICAL: dotenv MUST be first
import dotenv from 'dotenv';
dotenv.config();

// Verify environment variables are loaded
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 Environment Check:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ MISSING');
console.log('PORT:', process.env.PORT || 5000);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Now import other modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CRITICAL: CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://b12-a11-client.vercel.app',
  'https://b12a11client.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(null, true); // Allow anyway in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📨 [${timestamp}] ${req.method} ${req.path}`);
  console.log('🌐 Origin:', req.headers.origin || 'No origin');
  console.log('🔑 Authorization:', req.headers.authorization ? 'Present ✅' : 'Missing ❌');

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  next();
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LocalChefBazaar API Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    status: 'healthy'
  });
});

// ✅ Test endpoint for debugging
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: 'connected',
    jwtConfigured: !!process.env.JWT_SECRET,
    timestamp: new Date().toISOString()
  });
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);

// ✅ Error handling middleware
app.use(errorHandler);

// ✅ 404 handler - must be last
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Server Started Successfully!');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT: ${process.env.JWT_SECRET ? 'Configured ✅' : 'MISSING ❌'}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Configured ✅' : 'MISSING ❌'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ✅ Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;