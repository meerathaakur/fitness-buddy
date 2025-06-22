
// utils/validators.js
const validator = require('validator');

class Validators {
    static validateEmail(email) {
        return validator.isEmail(email);
    }

    static validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    static validateName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 50;
    }

    static validateWorkoutType(type) {
        const validTypes = ['cardio', 'strength', 'yoga', 'running', 'cycling', 'swimming', 'other'];
        return validTypes.includes(type);
    }

    static validateGoalType(type) {
        const validTypes = ['workout_count', 'duration', 'calories', 'distance', 'weight_loss', 'weight_gain'];
        return validTypes.includes(type);
    }

    static sanitizeInput(input) {
        if (typeof input === 'string') {
            return input.trim().replace(/[<>]/g, '');
        }
        return input;
    }
}

module.exports = Validators;
