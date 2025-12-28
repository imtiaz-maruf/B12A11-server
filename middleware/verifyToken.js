// ===========================================
// SERVER/middleware/verifyToken.js - HYBRID APPROACH
// ===========================================
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // ✅ Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('🎟️ Token from Authorization header');
      }
    } else {
      console.log('🍪 Token from cookie');
    }

    console.log('🔍 Token verification attempt');
    console.log('📦 Origin:', req.headers.origin);
    console.log('🍪 Cookies:', Object.keys(req.cookies || {}));
    console.log('🎟️ Token present:', token ? '✅ Yes' : '❌ No');

    if (!token) {
      console.log('❌ No token found in cookies or headers');
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        authenticated: false,
        debug: {
          hasCookies: !!req.cookies,
          cookieKeys: Object.keys(req.cookies || {}),
          hasAuthHeader: !!req.headers.authorization,
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