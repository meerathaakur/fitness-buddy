
// services/message.service.js
const Message = require('../models/Message');
const BuddyService = require('./buddy.service');

class MessageService {
    static async sendMessage(senderId, receiverId, content, type = 'text') {
        try {
            // Verify users are buddies
            const buddies = await BuddyService.getUserBuddies(senderId);
            const isBuddy = buddies.some(buddy => buddy._id.toString() === receiverId);
            
            if (!isBuddy) {
                throw new Error('You can only send messages to your buddies');
            }

            const message = await Message.create({
                sender: senderId,
                receiver: receiverId,
                content,
                type
            });

            return message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    static async getConversation(userId, buddyId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            
            const messages = await Message.find({
                $or: [
                    { sender: userId, receiver: buddyId },
                    { sender: buddyId, receiver: userId }
                ]
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sender', 'name profilePicture')
                .populate('receiver', 'name profilePicture');

            return messages.reverse(); // Return in chronological order
        } catch (error) {
            console.error('Error getting conversation:', error);
            throw error;
        }
    }

    static async markAsRead(messageId, userId) {
        try {
            const message = await Message.findOneAndUpdate(
                { _id: messageId, receiver: userId },
                { isRead: true },
                { new: true }
            );
            return message;
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }

    static async getUnreadCount(userId) {
        try {
            const count = await Message.countDocuments({
                receiver: userId,
                isRead: false
            });
            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }
}

module.exports = MessageService;
