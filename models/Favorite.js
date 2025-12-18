// ===========================================
// SERVER/models/Favorite.js
// ===========================================
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    mealName: String,
    chefId: String,
    chefName: String,
    price: Number,
    addedTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Favorite', favoriteSchema);