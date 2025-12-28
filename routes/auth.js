// ===========================================
// SERVER/routes/auth.js - COMPLETE REWRITE
// ===========================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('📧 JWT request for:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email required'
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ CRITICAL: Production-ready cookie settings
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true in production
      sameSite: 'none', // Required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production'
        ? '.vercel.app'
        : undefined
    };

    console.log('🍪 Setting cookie with options:', {
      ...cookieOptions,
      domain: cookieOptions.domain || 'localhost'
    });

    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Token generated successfully',
        email,
        authenticated: true
      });

  } catch (error) {
    console.error('❌ JWT Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  console.log('👋 Logout request');

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: process.env.NODE_ENV === 'production'
      ? '.vercel.app'
      : undefined
  };

  res
    .clearCookie('token', cookieOptions)
    .json({
      success: true,
      message: 'Logged out successfully'
    });
});

// Verify token endpoint (for debugging)
router.get('/verify', (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({
      authenticated: false,
      message: 'No token found'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      email: decoded.email
    });
  } catch (error) {
    res.json({
      authenticated: false,
      message: 'Invalid token'
    });
  }
});

export default router;