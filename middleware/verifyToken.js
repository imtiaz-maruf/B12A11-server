// ===========================================
// SERVER/middleware/verifyToken.js
// ===========================================

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log('🔍 Verifying token...');
    console.log('📦 Cookies received:', Object.keys(req.cookies || {}));
    console.log('🔑 Token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        authenticated: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for:', decoded.email);

    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please login again.',
        authenticated: false
      });
    }

    return res.status(403).json({
      message: 'Invalid token',
      authenticated: false
    });
  }
};