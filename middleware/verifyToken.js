// ===========================================
// SERVER/middleware/verifyToken.js
// ===========================================
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        authenticated: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        authenticated: false
      });
    }
    
    return res.status(403).json({ 
      message: 'Invalid token',
      authenticated: false
    });
  }
};
