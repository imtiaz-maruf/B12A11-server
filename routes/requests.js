// ===========================================
// SERVER/routes/requests.js - COMPLETE
// ===========================================
import express from 'express';
import Request from '../models/Request.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// Generate Chef ID
const generateChefId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `chef-${randomNum}`;
};

// Create request
router.post('/', verifyToken, async (req, res) => {
    try {
        // Check if request already exists
        const existing = await Request.findOne({
            userEmail: req.body.userEmail,
            requestType: req.body.requestType,
            requestStatus: 'pending'
        });

        if (existing) {
            return res.status(400).json({ message: 'Request already pending' });
        }

        const request = new Request(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all requests (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const requests = await Request.find().sort({ requestTime: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update request status (Admin only)
router.patch('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update request status
        request.requestStatus = req.body.requestStatus;
        await request.save();

        // If approved, update user role
        if (req.body.requestStatus === 'approved') {
            const updateData = { role: request.requestType };

            // Generate chef ID if request type is chef
            if (request.requestType === 'chef') {
                updateData.chefId = generateChefId();
            }

            await User.findOneAndUpdate(
                { email: request.userEmail },
                updateData
            );
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;