// controllers/auth.controller.js
const User = require('../models/User');
const OTP = require('../models/Otp.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmailHelper = require('../utils/emailHelpers');
const { oauth2Client } = require('../utils/googleHelper.js');
const axios = require('axios');

const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || 3600
    });
};

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, location, fitnessLevel } = req.body; // location can be object or string will update later

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role: 'user', preferences: { location, fitnessLevel } });

        // Generate OTP for email verification
        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            type: 'email_verification'
        });

        // Send verification email using EmailHelper
        await EmailHelper.sendVerificationEmail({ email, name, otp });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            preferences: user.preferences || {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        user.lastSeen = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                avatar: user?.avatar,
                preferences: user?.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        await User.findOneAndUpdate({ email }, { emailVerified: true });
        otpRecord.isUsed = true;
        await otpRecord.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            type: 'password_reset'
        });

        // Send password reset email using EmailHelper
        await EmailHelper.sendPasswordResetEmail(email, user.name, otp);

        res.status(200).json({ success: true, message: 'Password reset code sent to your email' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        user.password = newPassword;
        await user.save();

        otpRecord.isUsed = true;
        await otpRecord.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        console.log("Google Response:", googleRes);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userRes.data;
        console.log("Google User Data:", userRes.data);
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                role: 'user',
                avatar: picture,
            });
        }
        // const { _id, role } = user;
        console.log("Google User:", user);
        const token = generateToken(user?._id, user?.role || 'user');



        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.log("🔥 GOOGLE AUTH ERROR:", err.response?.data || err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}