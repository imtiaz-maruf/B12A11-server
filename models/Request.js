// ===========================================
// SERVER/models/Request.js
// ===========================================
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        enum: ['chef', 'admin'],
        required: true
    },
    requestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);