// ===========================================
// SERVER/routes/meals.js - COMPLETE
// ===========================================
import express from 'express';
import Meal from '../models/Meal.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyChef } from '../middleware/verifyChef.js';

const router = express.Router();

// Get all meals with pagination and sorting
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const meals = await Meal.find()
            .sort({ [sort]: order })
            .skip(skip)
            .limit(limit);

        const total = await Meal.countDocuments();

        res.json({
            meals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMeals: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get meal by ID
router.get('/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get chef's meals
router.get('/chef/:email', verifyToken, async (req, res) => {
    try {
        const meals = await Meal.find({ userEmail: req.params.email });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create meal (Chef only)
router.post('/', verifyToken, verifyChef, async (req, res) => {
    try {
        const meal = new Meal(req.body);
        await meal.save();
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update meal (Chef only)
router.patch('/:id', verifyToken, verifyChef, async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete meal (Chef only)
router.delete('/:id', verifyToken, verifyChef, async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;