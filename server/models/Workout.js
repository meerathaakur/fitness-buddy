
// models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['yoga', 'running', 'weightlifting', 'swimming', 'cycling', 'pilates', 'crossfit', 'boxing', 'dancing', 'hiking', 'other'],
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
        distance: Number,
        duration: Number,
        notes: String
    }],
    notes: String,
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    location: {
        type: String,
        enum: ['gym', 'home', 'outdoor', 'studio'],
        default: 'gym'
    },
    buddies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    images: [String],
    isPublic: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    workoutDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
