
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            return !this.socialLogin;
        }
    },
    avatar: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        address: {
            type: String,
            default: ''
        }
    },
    preferences: {
        workoutTypes: [{
            type: String,
            enum: ['yoga', 'running', 'weightlifting', 'swimming', 'cycling', 'pilates', 'crossfit', 'boxing', 'dancing', 'hiking']
        }],
        fitnessLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        availableTime: [{
            day: {
                type: String,
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            startTime: String,
            endTime: String
        }]
    },
    socialLogin: {
        provider: {
            type: String,
            enum: ['google', 'facebook']
        },
        providerId: String
    },
    buddies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    buddyRequests: {
        sent: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            sentAt: {
                type: Date,
                default: Date.now
            }
        }],
        received: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            receivedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    stats: {
        totalWorkouts: {
            type: Number,
            default: 0
        },
        totalCaloriesBurned: {
            type: Number,
            default: 0
        },
        totalWorkoutTime: {
            type: Number,
            default: 0
        },
        streakDays: {
            type: Number,
            default: 0
        },
        lastWorkoutDate: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
