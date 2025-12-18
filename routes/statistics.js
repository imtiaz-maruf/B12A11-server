// ===========================================
// SERVER/routes/statistics.js - COMPLETE
// ===========================================
import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// Get platform statistics (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const ordersPending = await Order.countDocuments({
            orderStatus: 'pending'
        });

        const ordersDelivered = await Order.countDocuments({
            orderStatus: 'delivered'
        });

        const payments = await Payment.find();
        const totalPaymentAmount = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        res.json({
            totalUsers,
            ordersPending,
            ordersDelivered,
            totalPaymentAmount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;