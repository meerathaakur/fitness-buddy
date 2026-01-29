// models/WorkoutType.js
const mongoose = require('mongoose');

const workoutTypeSchema = new mongoose.Schema({
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutType', workoutTypeSchema);
