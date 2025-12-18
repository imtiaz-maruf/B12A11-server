// ===========================================
// SERVER/models/Review.js
// ===========================================
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    reviewerName: {
        type: String,
        required: true
    },
    reviewerEmail: {
        type: String,
        required: true
    },
    reviewerImage: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);