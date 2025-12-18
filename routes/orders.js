// ===========================================
// SERVER/routes/orders.js - COMPLETE
// ===========================================
import express from 'express';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create order
router.post('/', verifyToken, async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's orders
router.get('/user/:email', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email })
            .populate('foodId')
            .sort({ orderTime: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get chef's orders
router.get('/chef/:chefId', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ chefId: req.params.chefId })
            .sort({ orderTime: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment status
router.patch('/:id/payment', verifyToken, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: req.body.paymentStatus },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;