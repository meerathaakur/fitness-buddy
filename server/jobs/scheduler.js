
// jobs/scheduler.js
const cron = require('node-cron');
const GoalService = require('../services/goal.service');
const WorkoutService = require('../services/workout.service');
const EmailHelpers = require('../utils/emailHelpers');
const User = require('../models/User');

class Scheduler {
    static init() {
        // Check goal deadlines daily at 9 AM
        cron.schedule('0 9 * * *', async () => {
            try {
                console.log('Running daily goal deadline check...');
                await GoalService.checkGoalDeadlines();
            } catch (error) {
                console.error('Error in goal deadline check:', error);
            }
        });

        // Send weekly reports every Sunday at 8 PM
        cron.schedule('0 20 * * 0', async () => {
            try {
                console.log('Generating weekly reports...');
                await this.sendWeeklyReports();
            } catch (error) {
                console.error('Error sending weekly reports:', error);
            }
        });

        // Clean up old notifications every week
        cron.schedule('0 2 * * 1', async () => {
            try {
                console.log('Cleaning up old notifications...');
                await this.cleanupOldNotifications();
            } catch (error) {
                console.error('Error cleaning up notifications:', error);
            }
        });

        console.log('Scheduled jobs initialized');
    }

    static async sendWeeklyReports() {
        try {
            const users = await User.find({ emailNotifications: true });
            
            for (const user of users) {
                const report = await WorkoutService.generateWeeklyReport(user._id);
                
                if (report.totalWorkouts > 0) {
                    await EmailHelpers.sendWeeklyReport(
                        user.email,
                        user.name,
                        report
                    );
                }
            }
            
            console.log(`Weekly reports sent to ${users.length} users`);
        } catch (error) {
            console.error('Error sending weekly reports:', error);
        }
    }

    static async cleanupOldNotifications() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const Notification = require('../models/Notification');
            const result = await Notification.deleteMany({
                createdAt: { $lt: thirtyDaysAgo },
                isRead: true
            });
            
            console.log(`Cleaned up ${result.deletedCount} old notifications`);
        } catch (error) {
            console.error('Error cleaning up notifications:', error);
        }
    }
}

module.exports = Scheduler;
