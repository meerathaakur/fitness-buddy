
// models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['individual', 'group', 'community'],
        required: true
    },
    category: {
        type: String,
        enum: ['running', 'weightlifting', 'yoga', 'swimming', 'cycling', 'general'],
        required: true
    },
    goal: {
        target: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['miles', 'kilometers', 'minutes', 'hours', 'reps', 'sets', 'workouts'],
            required: true
        }
    },
    duration: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        progress: {
            type: Number,
            default: 0
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    rewards: {
        badge: String,
        points: {
            type: Number,
            default: 0
        },
        title: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    maxParticipants: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
