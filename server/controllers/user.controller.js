
// controllers/user.controller.js
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('buddies', 'name avatar');
        console.log("user data fetched getProfile >>>", user)
        res.status(200).json({success:true,user});
    } catch (error) {
        console
        res.status(500).json({success:false, error: error.message });
    }
};

exports.updateProfile = async (req, res) => { // make changes can cause error user can't update directly update profile
    try {
        const updates = req.body;
        console.log("updates:::",updates)
        console.log("req.file",req.file)
        // Handle avatar upload
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            updates.avatar = result.secure_url;
        }

        if (typeof updates.preferences === "string") {
            updates.preferences = JSON.parse(updates.preferences);
        }
        if (typeof updates.location === "string") {
            updates.location = JSON.parse(updates.location);
}

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );
        console
        res.status(200).json({success:true,message:"profile updated sucessfully",user});
    } catch (error) {
        console.log("Error in updateProfile >>>", error);
        res.status(500).json({success:false, error: error.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const updatedPreferences = req.body;
        console.log("updatedPreferences:::", updatedPreferences);
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { preferences: updatedPreferences.preferences } },
            { new: true }
        );
        console.log("user preferences updated >>>", user.preferences);
        res.status(200).json({success:true,preferences:user.preferences});
    } catch (error) {
        console.log("Error in updatePreferences >>>", error);
        res.status(500).json({success:false, error: error.message });
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
        console.log("user location updated >>>", user.location);
        res.status(200).json({success:true, message: 'Location updated successfully', location: user.location });
    } catch (error) {
        console.log("Error in updateLocation >>>", error);
        res.status(500).json({success:false, error: error.message });
    }
};
