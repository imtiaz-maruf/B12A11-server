// ========================================================
// server/routes/auth.js - ENHANCED DEBUG VERSION
// ========================================================
import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

/**
 * POST /api/auth/jwt
 * Generate JWT token for authenticated user
 */
router.post('/jwt', async (req, res) => {
  try {
    console.log('📨 JWT Request Body:', JSON.stringify(req.body));
    const { email } = req.body;

    // Validate email
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured in environment');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error - JWT_SECRET missing'
      });
    }

    console.log('🔐 JWT_SECRET exists:', process.env.JWT_SECRET.substring(0, 10) + '...');

    // Generate JWT token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated successfully');
    console.log('📏 Token length:', token.length);
    console.log('🔍 Token preview:', token.substring(0, 50) + '...');

    // CRITICAL: Build response object
    const response = {
      success: true,
      token: token,
      email: email
    };

    console.log('📦 Response object keys:', Object.keys(response));
    console.log('📦 Response has token?', 'token' in response);
    console.log('📦 Token value exists?', !!response.token);
    console.log('📤 Sending response:', JSON.stringify({
      ...response,
      token: response.token.substring(0, 50) + '...'
    }));

    // Send response
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ JWT Generation Error:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  console.log('🚪 Logout request');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/test
 */
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes working',
    jwtConfigured: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    timestamp: new Date().toISOString()
  });
});

export default router;