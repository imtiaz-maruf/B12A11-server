// ========================================================
// server/routes/auth.js - COMPLETE FILE - COPY EVERYTHING
// ========================================================

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * POST /api/auth/jwt
 * Generate JWT token for authenticated user
 * Body: { email: string }
 * Returns: { success: boolean, token: string, email: string }
 */
router.post('/jwt', async (req, res) => {
  try {
    console.log('📨 JWT Request:', req.body);

    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated for:', email);

    // CRITICAL: Response MUST include token field
    const response = {
      success: true,
      token: token,        // ← This is the critical field!
      email: email
    };

    console.log('📤 Sending response with token');

    // Return response
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ JWT Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side will remove token)
 * Returns: { success: boolean, message: string }
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
 * Test endpoint to verify auth routes are working
 * Returns: { message: string, jwtConfigured: boolean, timestamp: string }
 */
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes working',
    jwtConfigured: !!process.env.JWT_SECRET,
    timestamp: new Date().toISOString()
  });
});

export default router;

