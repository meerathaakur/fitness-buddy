// models/Workout.js
const mongoose = require('mongoose');

/* -------------------- MAIN WORKOUT SCHEMA -------------------- */

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: ['yoga', 'strength', 'cardio', 'running', 'weightlifting', 'swimming', 'cycling', 'pilates', 'crossfit', 'boxing', 'dancing', 'hiking', 'other'],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },

    duration: {
        type: Number, // minutes
        required: true
    },

    caloriesBurned: {
        type: Number,
        default: 0
    },

    exercises: [{
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        },
        sets: Number,
        reps: Number,
        weight: Number,
        duration: Number
    }],

    notes: {
        type: String
    },

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

    images: [{
        type: String
    }],

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
        default: Date.now,
        index: true
    }

}, {
    timestamps: true
});

/* -------------------- INDEXES -------------------- */

workoutSchema.index({ user: 1, workoutDate: -1 });

module.exports = mongoose.model('Workout', workoutSchema);