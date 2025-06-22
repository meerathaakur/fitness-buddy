
// services/auth.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    static async register(userData) {
        try {
            const { email, password, ...otherData } = userData;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword,
                ...otherData
            });

            return { user: this.sanitizeUser(user) };
        } catch (error) {
            console.error('Error in register service:', error);
            throw error;
        }
    }

    static async login(email, password) {
        try {
            // Find user by email
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Update last active
            user.lastActive = new Date();
            await user.save();

            // Generate JWT token
            const token = this.generateToken(user._id);

            return { 
                user: this.sanitizeUser(user), 
                token 
            };
        } catch (error) {
            console.error('Error in login service:', error);
            throw error;
        }
    }

    static generateToken(userId) {
        return jwt.sign(
            { userId }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    static sanitizeUser(user) {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    static async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

module.exports = AuthService;
