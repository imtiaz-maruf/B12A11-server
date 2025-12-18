// ===========================================
// SERVER/models/Payment.js
// ===========================================
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    paymentMethod: String,
    paymentTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);