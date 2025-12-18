// ===========================================
// SERVER/middleware/verifyAdmin.js
// ===========================================
import User from '../models/User.js';

export const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};