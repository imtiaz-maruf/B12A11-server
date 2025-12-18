// ===========================================
// SERVER/routes/auth.js - COMPLETE
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

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout - clear cookie
router.post('/logout', (req, res) => {
    res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        .json({ success: true });
});

export default router;