// ===========================================
// SERVER/routes/favorites.js - COMPLETE
// ===========================================
import express from 'express';
import Favorite from '../models/Favorite.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Get user's favorites
router.get('/:email', verifyToken, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userEmail: req.params.email })
            .populate('mealId')
            .sort({ addedTime: -1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to favorites
router.post('/', verifyToken, async (req, res) => {
    try {
        // Check if already favorited
        const existing = await Favorite.findOne({
            userEmail: req.body.userEmail,
            mealId: req.body.mealId
        });

        if (existing) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        const favorite = new Favorite(req.body);
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from favorites
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Favorite.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;