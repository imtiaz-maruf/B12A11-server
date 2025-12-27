// ============================================================================
// 2. SERVER/routes/auth.js - CORRECTED VERSION
// ============================================================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT and set cookie
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ FIXED: Production-ready cookie settings
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true (HTTP will fail anyway)
      sameSite: 'none', // Required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      ...(isProduction && { domain: '.vercel.app' }) // Only set in production
    };

    console.log('✅ Setting cookie with options:', cookieOptions);
    console.log('✅ Token generated for:', email);
    console.log('✅ Token expires in: 7 days');

    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Token generated successfully',
        email,
        expiresIn: '7d'
      });

  } catch (error) {
    console.error('❌ JWT generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate token',
      error: error.message
    });
  }
});

// Logout and clear cookie
router.post('/logout', (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      ...(isProduction && { domain: '.vercel.app' })
    };

    console.log('✅ Clearing cookie');

    res
      .clearCookie('token', cookieOptions)
      .json({
        success: true,
        message: 'Logged out successfully'
      });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Verify token (optional - for debugging)
router.get('/verify', (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.json({
        authenticated: false,
        message: 'No token found'
      });
    }

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