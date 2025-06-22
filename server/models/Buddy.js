
// models/Buddy.js
const mongoose = require('mongoose');

const buddySchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    matchScore: {
        type: Number,
        default: 0
    },
    commonInterests: [String],
    lastInteraction: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

buddySchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Buddy', buddySchema);
