// models/Preference.js
const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },

  workoutTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutType'
  }],

  fitnessLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FitnessLevel'
  },

  availableTime: [{
    day: {
      type: String,
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]
    },
    startTime: String,
    endTime: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Preference', preferenceSchema);
