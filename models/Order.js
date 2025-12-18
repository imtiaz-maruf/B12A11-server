// ===========================================
// SERVER/models/Order.js
// ===========================================
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    mealName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    chefId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'accepted', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'paid'],
        default: 'Pending'
    },
    orderTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);