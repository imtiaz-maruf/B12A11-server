// ===========================================
// FIX 3: SERVER/routes/auth.js - UPDATE COOKIE SETTINGS
// ===========================================
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT token
router.post('/jwt', async (req, res) => {
    try {
        const { email } = req.body;
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });

        // ✅ FIXED COOKIE SETTINGS FOR PRODUCTION
        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            })
            .json({ success: true, message: 'Token set successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        })
        .json({ success: true, message: 'Logged out successfully' });
});

export default router;
