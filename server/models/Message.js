
// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'workout_share', 'challenge_invite'],
        default: 'text'
    },
    metadata: {
        workoutId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workout'
        },
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        imageUrl: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date
}, {
    timestamps: true
});

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
