// ===========================================
// SERVER/routes/auth.js
// ===========================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // ✅ FIXED: Cookie settings for production
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true for production
      sameSite: 'none', // Required for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    };

    console.log('✅ Setting cookie with options:', cookieOptions);
    console.log('✅ Token generated for:', email);

    res
      .cookie('token', token, cookieOptions)
      .json({ 
        success: true, 
        message: 'Token generated successfully',
        email 
      });
      
  } catch (error) {
    console.error('JWT Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: '.vercel.app'
    })
    .json({ success: true, message: 'Logged out' });
});

export default router;
