// ===========================================
// SERVER/middleware/verifyToken.js
// ===========================================

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Check for token in cookies first, then fallback to Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ Auth Failed: No token found');
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        authenticated: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    const status = error.name === 'TokenExpiredError' ? 401 : 403;
    return res.status(status).json({
      message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      authenticated: false
    });
  }
};
