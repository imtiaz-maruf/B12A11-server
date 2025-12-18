// ===========================================
// SERVER/middleware/verifyChef.js
// ===========================================
import User from '../models/User.js';

export const verifyChef = async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user || (user.role !== 'chef' && user.role !== 'admin')) {
            return res.status(403).json({ message: 'Access denied. Chef only.' });
        }

        // Check if user is marked as fraud
        if (user.status === 'fraud') {
            return res.status(403).json({ message: 'Your account has been restricted.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};