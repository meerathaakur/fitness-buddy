
// controllers/user.controller.js
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('buddies', 'name avatar');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Handle avatar upload
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            updates.avatar = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const updatedPreferences = req.body;
        console.log(updatedPreferences);
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { preferences: updatedPreferences.preferences } },
            { new: true }
        );

        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                    address
                }
            },
            { new: true }
        );

        res.json({ message: 'Location updated successfully', location: user.location });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
