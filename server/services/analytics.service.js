
// services/analytics.service.js
const User = require('../models/User');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');
const Challenge = require('../models/Challenge');
const Message = require('../models/Message');

class AnalyticsService {
    static async getUserStats(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const totalWorkouts = await Workout.countDocuments({ userId });
            const completedGoals = await Goal.countDocuments({ 
                userId, 
                status: 'completed' 
            });
            const activeGoals = await Goal.countDocuments({ 
                userId, 
                status: 'active' 
            });
            const completedChallenges = await Challenge.countDocuments({ 
                'participants.userId': userId,
                'participants.status': 'completed'
            });

            // Calculate total workout time
            const workouts = await Workout.find({ userId });
            const totalWorkoutTime = workouts.reduce((sum, workout) => 
                sum + (workout.duration || 0), 0);

            // Calculate streak
            const streak = await this.calculateWorkoutStreak(userId);

            return {
                totalWorkouts,
                completedGoals,
                activeGoals,
                completedChallenges,
                totalWorkoutTime,
                streak,
                joinDate: user.createdAt
            };
        } catch (error) {
            console.error('Error getting user stats:', error);
            throw error;
        }
    }

    static async getWorkoutAnalytics(userId, startDate, endDate) {
        try {
            const matchQuery = { userId };
            if (startDate && endDate) {
                matchQuery.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const workoutStats = await Workout.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        totalDuration: { $sum: '$duration' },
                        totalCalories: { $sum: '$caloriesBurned' }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            const weeklyStats = await Workout.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: { $week: '$date' },
                        count: { $sum: 1 },
                        totalDuration: { $sum: '$duration' },
                        totalCalories: { $sum: '$caloriesBurned' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            return { workoutStats, weeklyStats };
        } catch (error) {
            console.error('Error getting workout analytics:', error);
            throw error;
        }
    }

    static async calculateWorkoutStreak(userId) {
        try {
            const workouts = await Workout.find({ userId })
                .sort({ date: -1 })
                .select('date');

            if (workouts.length === 0) return 0;

            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            for (const workout of workouts) {
                const workoutDate = new Date(workout.date);
                workoutDate.setHours(0, 0, 0, 0);

                const diffTime = currentDate - workoutDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0 || diffDays === 1) {
                    streak++;
                    currentDate = workoutDate;
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('Error calculating workout streak:', error);
            throw error;
        }
    }

    static async getAppStats() {
        try {
            const totalUsers = await User.countDocuments();
            const totalWorkouts = await Workout.countDocuments();
            const totalGoals = await Goal.countDocuments();
            const totalChallenges = await Challenge.countDocuments();
            const totalMessages = await Message.countDocuments();

            const activeUsers = await User.countDocuments({
                lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });

            return {
                totalUsers,
                totalWorkouts,
                totalGoals,
                totalChallenges,
                totalMessages,
                activeUsers
            };
        } catch (error) {
            console.error('Error getting app stats:', error);
            throw error;
        }
    }
}

module.exports = AnalyticsService;
