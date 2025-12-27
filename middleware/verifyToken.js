// ============================================================================
// CRITICAL FIX 4: Verify Backend is Reading Cookies
// SERVER/middleware/verifyToken.js
// ============================================================================

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // ✅ Log EVERYTHING for debugging
    console.log('==========================================');
    console.log('🔍 TOKEN VERIFICATION ATTEMPT');
    console.log('==========================================');
    console.log('Request URL:', req.method, req.originalUrl);
    console.log('Request Origin:', req.headers.origin);
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw Cookies:', req.headers.cookie);
    console.log('Parsed Cookies:', req.cookies);
    console.log('==========================================');
    
    const token = req.cookies?.token;
    
    if (!token) {
      console.log('❌ NO TOKEN FOUND');
      console.log('Available cookies:', Object.keys(req.cookies || {}));
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided',
        authenticated: false,
        debug: {
          cookiesReceived: Object.keys(req.cookies || {}),
          headerCookie: req.headers.cookie || 'none'
        }
      });
    }

    console.log('✅ Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for:', decoded.email);
    
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired',
        authenticated: false
      });
    }
    
    return res.status(403).json({ 
      success: false,
      message: 'Invalid token',
      authenticated: false
    });
  }
};