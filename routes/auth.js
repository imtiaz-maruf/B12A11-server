// ===========================================
// SERVER/routes/auth.js
// ===========================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT token
router.post('/jwt', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const token = jwt.sign(
      { email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Cookie options for production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    };

    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({ 
        success: true, 
        message: 'Token generated successfully'
      });
      
  } catch (error) {
    console.error('JWT Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate token',
      error: error.message 
    });
  }
});

// Verify token (for debugging)
router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  
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
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ 
      authenticated: false,
      message: 'Invalid token' 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  };

  res
    .clearCookie('token', cookieOptions)
    .status(200)
    .json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
});

export default router;
