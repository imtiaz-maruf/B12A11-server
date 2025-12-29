// ===========================================
// SERVER/routes/auth.js - COPY THIS EXACTLY
// ===========================================

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ JWT Token Generation Route
router.post('/jwt', async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 POST /api/auth/jwt');
    console.log('📦 Body:', req.body);

    const { email } = req.body;

    // Validation
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET not configured!');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error - JWT_SECRET missing'
      });
    }

    console.log('🔐 Generating JWT token for:', email);

    // Generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated');
    console.log('🔑 Token length:', token.length);
    console.log('🔑 Preview:', token.substring(0, 30) + '...');

    // CRITICAL: Build response object with token
    const responseData = {
      success: true,
      token: token,     // ← MUST BE HERE!
      email: email
    };

    // Verify token is in response
    console.log('🔍 Verifying response structure:');
    console.log('   - success:', responseData.success);
    console.log('   - token exists:', !!responseData.token);
    console.log('   - token length:', responseData.token?.length);
    console.log('   - email:', responseData.email);

    if (!responseData.token) {
      console.error('❌ CRITICAL ERROR: Token missing from response!');
      throw new Error('Token not in response object');
    }

    console.log('✅ Response ready to send');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Send response
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ JWT Generation Error');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.message
    });
  }
});

// ✅ Logout Route
router.post('/logout', (req, res) => {
  console.log('🚪 POST /api/auth/logout');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ✅ Test Route (for debugging)
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes working',
    jwtConfigured: !!process.env.JWT_SECRET,
    timestamp: new Date().toISOString()
  });
});

export default router;