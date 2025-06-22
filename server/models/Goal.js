
// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility', 'general_fitness'],
        required: true
    },
    target: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['kg', 'lbs', 'miles', 'kilometers', 'minutes', 'hours', 'reps', 'sets'],
            required: true
        }
    },
    current: {
        type: Number,
        default: 0
    },
    deadline: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active'
    },
    milestones: [{
        title: String,
        target: Number,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
