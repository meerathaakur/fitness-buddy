
// services/notification.service.js
const Notification = require('../models/Notification');

class NotificationService {
    static async createNotification(notificationData) {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    static async sendBulkNotifications(notifications) {
        try {
            const createdNotifications = await Notification.insertMany(notifications);
            return createdNotifications;
        } catch (error) {
            console.error('Error sending bulk notifications:', error);
            throw error;
        }
    }

    static async getUserNotifications(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return notifications;
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId) {
        try {
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;
