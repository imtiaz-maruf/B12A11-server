// ===========================================
// SERVER/models/User.js
// ===========================================
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    photoURL: String,
    address: String,
    role: {
        type: String,
        enum: ['user', 'chef', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'fraud'],
        default: 'active'
    },
    chefId: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);