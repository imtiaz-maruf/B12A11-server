// ========================================================
// server/routes/auth.js - COMPLETE FILE - COPY EVERYTHING
// ========================================================

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Generate JWT and return it (don't use cookies)
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Token generated for:', email);

    // ✅ Return token in response body (client will store it)
    res.json({
      success: true,
      token,
      email
    });

  } catch (error) {
    console.error('❌ JWT Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Logout (client-side will remove token)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
