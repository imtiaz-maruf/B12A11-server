// ===========================================
// SERVER/routes/auth.js - HYBRID APPROACH
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

    // ✅ Cookie settings - try without domain first
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
      // ❌ Remove domain - let browser set it automatically
    };

    console.log('🍪 Setting cookie with options:', cookieOptions);
    console.log('🎟️ Token (first 20 chars):', token.substring(0, 20) + '...');

    // ✅ HYBRID: Set cookie AND return token in response
    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Token generated successfully',
        email,
        authenticated: true,
        token // ✅ Return token so client can store it
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

  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    })
    .json({
      success: true,
      message: 'Logged out successfully'
    });
});

export default router;