// ===========================================
// SERVER/models/Meal.js
// ===========================================
import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    chefName: {
        type: String,
        required: true
    },
    foodImage: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ingredients: [String],
    deliveryArea: String,
    estimatedDeliveryTime: String,
    chefExperience: String,
    chefId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Meal', mealSchema);