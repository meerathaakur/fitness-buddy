
// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'buddy_request',
            'buddy_accepted',
            'workout_reminder',
            'goal_deadline',
            'challenge_invite',
            'challenge_completed',
            'milestone_achieved',
            'weekly_report'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        userId: mongoose.Schema.Types.ObjectId,
        workoutId: mongoose.Schema.Types.ObjectId,
        goalId: mongoose.Schema.Types.ObjectId,
        challengeId: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
