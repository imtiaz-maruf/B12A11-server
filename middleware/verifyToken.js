// ===========================================
// SERVER/middleware/verifyToken.js - COMPLETE REWRITE
// ===========================================
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // Debug logging
    console.log('🔍 Token verification attempt');
    console.log('📦 Headers:', req.headers.origin);
    console.log('🍪 Cookies present:', Object.keys(req.cookies || {}));
    console.log('🎟️ Token:', token ? '✅ Present' : '❌ Missing');

    if (!token) {
      console.log('❌ No token in cookies');
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        authenticated: false,
        debug: {
          cookies: Object.keys(req.cookies || {}),
          origin: req.headers.origin
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for:', decoded.email);

    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({
      message: 'Invalid or expired token',
      authenticated: false,
      error: error.message
    });
  }
};