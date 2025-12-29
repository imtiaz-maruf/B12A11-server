// ===========================================
// SERVER/routes/auth.js - FIXED WITH DEBUGGING
// ===========================================

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Generate JWT and return it
router.post('/jwt', async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 POST /api/auth/jwt - Request received');
    console.log('📦 Request body:', req.body);

    const { email } = req.body;

    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({
        success: false,
        message: 'Email required'
      });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET is not defined in environment variables!');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    console.log('🔐 JWT_SECRET exists:', process.env.JWT_SECRET.substring(0, 10) + '...');

    // Generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated successfully');
    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');

    // Prepare response
    const response = {
      success: true,
      token: token,
      email: email
    };

    console.log('📤 Sending response:', {
      success: response.success,
      email: response.email,
      tokenLength: response.token.length
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Send response
    return res.status(200).json(response);

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ JWT Generation Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.message
    });
  }
});

// ✅ Logout endpoint
router.post('/logout', (req, res) => {
  console.log('🚪 Logout request received');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Test endpoint to verify JWT_SECRET
router.get('/test-jwt-secret', (req, res) => {
  const hasSecret = !!process.env.JWT_SECRET;
  res.json({
    hasJwtSecret: hasSecret,
    secretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

export default router;