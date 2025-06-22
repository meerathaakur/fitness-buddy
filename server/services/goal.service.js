
// services/goal.service.js
const Goal = require('../models/Goal');
const NotificationService = require('./notification.service');

class GoalService {
    static async createGoal(goalData) {
        try {
            const goal = await Goal.create(goalData);
            return goal;
        } catch (error) {
            console.error('Error creating goal:', error);
            throw error;
        }
    }

    static async updateGoalProgress(goalId, progress) {
        try {
            const goal = await Goal.findById(goalId);
            if (!goal) throw new Error('Goal not found');

            goal.progress = progress;
            
            // Check if goal is completed
            if (progress >= goal.target) {
                goal.status = 'completed';
                goal.completedAt = new Date();

                // Send completion notification
                await NotificationService.createNotification({
                    userId: goal.userId,
                    type: 'goal_completed',
                    title: 'Goal Completed!',
                    message: `Congratulations! You've completed your goal: ${goal.title}`,
                    data: { goalId: goal._id }
                });
            }

            await goal.save();
            return goal;
        } catch (error) {
            console.error('Error updating goal progress:', error);
            throw error;
        }
    }

    static async getUserGoals(userId, status = null) {
        try {
            const query = { userId };
            if (status) {
                query.status = status;
            }

            const goals = await Goal.find(query).sort({ createdAt: -1 });
            return goals;
        } catch (error) {
            console.error('Error getting user goals:', error);
            throw error;
        }
    }

    static async checkGoalDeadlines() {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const upcomingGoals = await Goal.find({
                deadline: {
                    $gte: new Date(),
                    $lt: tomorrow
                },
                status: 'active'
            });

            const notifications = upcomingGoals.map(goal => ({
                userId: goal.userId,
                type: 'goal_reminder',
                title: 'Goal Deadline Reminder',
                message: `Your goal "${goal.title}" is due tomorrow!`,
                data: { goalId: goal._id }
            }));

            if (notifications.length > 0) {
                await NotificationService.sendBulkNotifications(notifications);
            }

            return notifications.length;
        } catch (error) {
            console.error('Error checking goal deadlines:', error);
            throw error;
        }
    }
}

module.exports = GoalService;
