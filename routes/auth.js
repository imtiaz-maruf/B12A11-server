// ============================================================================
// FILE 1: SERVER/routes/auth.js - COMPLETE REPLACEMENT
// ============================================================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ============================================================================
    // 🔥 CRITICAL FIX: These settings will make the cookie work
    // ============================================================================
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: true, // ALWAYS true (required for sameSite: none)
      sameSite: 'none', // REQUIRED for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    };

    // Only add domain in production
    if (isProduction) {
      cookieOptions.domain = '.vercel.app'; // Note the DOT
    }

    console.log('====================================');
    console.log('🍪 SETTING COOKIE');
    console.log('Email:', email);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Cookie Options:', cookieOptions);
    console.log('====================================');

    // Set the cookie
    res.cookie('token', token, cookieOptions);

    // IMPORTANT: Send response AFTER setting cookie
    return res.status(200).json({
      success: true,
      message: 'Token generated and cookie set',
      email,
      cookieSet: true,
      debug: {
        environment: process.env.NODE_ENV,
        domain: cookieOptions.domain || 'localhost',
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite
      }
    });

  } catch (error) {
    console.error('❌ JWT Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.message
    });
  }
});

router.post('/logout', (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    };

    if (isProduction) {
      cookieOptions.domain = '.vercel.app';
    }

    console.log('🔓 Clearing cookie with options:', cookieOptions);

    res.clearCookie('token', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Debug endpoint
router.get('/debug-cookies', (req, res) => {
  console.log('====================================');
  console.log('🔍 DEBUG COOKIES');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('====================================');

  res.json({
    success: true,
    hasCookieParser: typeof req.cookies !== 'undefined',
    cookies: req.cookies || {},
    rawCookie: req.headers.cookie || 'none',
    origin: req.headers.origin,
    host: req.headers.host
  });
});

export default router;