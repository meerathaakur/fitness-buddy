
// controllers/analytics.controller.js
const User = require('../models/User');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');
const Challenge = require('../models/Challenge');

exports.getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30' } = req.query; // days
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const workouts = await Workout.find({
            user: userId,
            createdAt: { $gte: startDate }
        });

        const goals = await Goal.find({ user: userId });
        const activeGoals = goals.filter(goal => goal.status === 'active');
        const completedGoals = goals.filter(goal => goal.status === 'completed');

        const analytics = {
            workouts: {
                total: workouts.length,
                totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
                totalCalories: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
                byType: {}
            },
            goals: {
                total: goals.length,
                active: activeGoals.length,
                completed: completedGoals.length,
                completionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0
            },
            streaks: await calculateStreaks(userId),
            weeklyProgress: await getWeeklyProgress(userId)
        };

        // Group workouts by type
        workouts.forEach(workout => {
            if (!analytics.workouts.byType[workout.type]) {
                analytics.workouts.byType[workout.type] = 0;
            }
            analytics.workouts.byType[workout.type]++;
        });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calculateStreaks = async (userId) => {
    const workouts = await Workout.find({ user: userId }).sort({ workoutDate: -1 });
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    const workoutDates = workouts.map(w => new Date(w.workoutDate).toDateString());
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        if (workoutDates.includes(checkDate.toDateString())) {
            tempStreak++;
            if (i === 0 || i === 1) currentStreak = tempStreak; // Allow for today or yesterday
        } else {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 0;
        }
    }
    
    return { current: currentStreak, max: Math.max(maxStreak, tempStreak) };
};

const getWeeklyProgress = async (userId) => {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - (i * 7));
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        
        const workouts = await Workout.find({
            user: userId,
            workoutDate: { $gte: startDate, $lte: endDate }
        });
        
        weeks.unshift({
            week: `Week ${4 - i}`,
            workouts: workouts.length,
            duration: workouts.reduce((sum, w) => sum + w.duration, 0),
            calories: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
        });
    }
    return weeks;
};
