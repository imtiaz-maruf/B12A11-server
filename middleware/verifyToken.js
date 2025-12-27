// ============================================================================
// 3. SERVER/middleware/verifyToken.js - CORRECTED VERSION
// ============================================================================
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log('🔍 Verifying token...');
    console.log('Cookies received:', Object.keys(req.cookies || {}));
    console.log('Token present:', !!token);
    console.log('Request origin:', req.headers.origin);
    console.log('Request path:', req.path);

    if (!token) {
      console.log('❌ No token provided in cookies');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        authenticated: false
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for:', decoded.email);

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
        authenticated: false
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
        authenticated: false
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      authenticated: false
    });
  }
};

// Optional: Admin verification middleware
export const verifyAdmin = async (req, res, next) => {
  try {
    // Assuming you store role in JWT or fetch from DB
    const userEmail = req.user?.email;

    // TODO: Check if user is admin (fetch from DB)
    // const user = await User.findOne({ email: userEmail });
    // if (user.role !== 'admin') { ... }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};