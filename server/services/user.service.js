
// services/user.service.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
    static async getUserById(userId, includePrivate = false) {
        try {
            const selectFields = includePrivate ? '' : '-password';
            const user = await User.findById(userId).select(selectFields);
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }

    static async updateUser(userId, updateData) {
        try {
            // Remove sensitive fields from update
            const { password, email, ...safeUpdateData } = updateData;
            
            const user = await User.findByIdAndUpdate(
                userId,
                safeUpdateData,
                { new: true, runValidators: true }
            ).select('-password');

            return user;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findById(userId).select('+password');
            if (!user) throw new Error('User not found');

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash new password
            const saltRounds = 12;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update password
            user.password = hashedNewPassword;
            await user.save();

            return { message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    static async searchUsers(query, currentUserId) {
        try {
            const searchRegex = new RegExp(query, 'i');
            
            const users = await User.find({
                _id: { $ne: currentUserId },
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            })
                .select('-password')
                .limit(20);

            return users;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            const user = await User.findByIdAndDelete(userId);
            return user;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = UserService;
