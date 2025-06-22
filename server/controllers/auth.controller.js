// controllers/auth.controller.js
const User = require('../models/User');
const OTP = require('../models/Otp.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmailHelper = require('../utils/emailHelpers');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        // Generate OTP for email verification
        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            type: 'email_verification'
        });

        // Send verification email using EmailHelper
        await EmailHelper.sendVerificationEmail({email, name, otp});

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        user.lastSeen = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({
            email,
            otp,
            type: 'email_verification',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        await User.findOneAndUpdate({ email }, { emailVerified: true });
        otpRecord.isUsed = true;
        await otpRecord.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            type: 'password_reset'
        });

        // Send password reset email using EmailHelper
        await EmailHelper.sendPasswordResetEmail(email, user.name, otp);

        res.json({ message: 'Password reset code sent to your email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const otpRecord = await OTP.findOne({
            email,
            otp,
            type: 'password_reset',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        user.password = newPassword;
        await user.save();

        otpRecord.isUsed = true;
        await otpRecord.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};