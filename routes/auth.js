import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ Generate JWT
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ✅ FIXED: Production-ready cookie settings
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always true (works on both HTTP and HTTPS in Vercel)
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    };

    console.log('✅ Setting cookie with options:', cookieOptions);
    console.log('✅ Token generated for:', email);

    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Token generated successfully',
        email,
        tokenSet: true
      });

  } catch (error) {
    console.error('❌ JWT Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Logout
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    })
    .json({ success: true, message: 'Logged out successfully' });
});

// ✅ Verify Token (for debugging)
router.get('/verify', (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
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
    res.status(403).json({
      authenticated: false,
      message: 'Invalid token'
    });
  }
});

export default router;