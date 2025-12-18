// ===========================================
// SERVER/routes/reviews.js - COMPLETE
// ===========================================
import express from 'express';
import Review from '../models/Review.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Get latest reviews (for home page)
router.get('/latest', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('foodId')
      .sort({ date: -1 })
      .limit(10);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a meal
router.get('/meal/:foodId', async (req, res) => {
  try {
    const reviews = await Review.find({ foodId: req.params.foodId })
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reviews
router.get('/user/:email', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewerEmail: req.params.email })
      .populate('foodId')
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review
router.post('/', verifyToken, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;