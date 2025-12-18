// ===========================================
// SERVER/routes/payment.js - UPDATED
// ===========================================
import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', verifyToken, async (req, res) => {
    try {
        const { amount } = req.body;

        // Initialize Stripe inside the route to ensure process.env is ready
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            payment_method_types: ['card']
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// Save payment
router.post('/save', verifyToken, async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();

        // Update order payment status
        await Order.findByIdAndUpdate(
            req.body.orderId,
            { paymentStatus: 'paid' }
        );

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;