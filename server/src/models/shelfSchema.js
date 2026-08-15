import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema({
    shelfId: {
        type: String,
        required: true,
        unique: true
    },
    section: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    occupied: {
        type: Number
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.model('Shelf', shelfSchema);