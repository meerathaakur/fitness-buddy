
// controllers/workout.controller.js
const Workout = require('../models/Workout');
const User = require('../models/User');
const Goal = require('../models/Goal');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.createWorkout = async (req, res) => {
    try {
        const workoutData = {
            ...req.body,
            user: req.user._id
        };

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            const imageUploads = req.files.map(file => uploadToCloudinary(file.path));
            const results = await Promise.all(imageUploads);
            workoutData.images = results.map(result => result.secure_url);
        }

        const workout = await Workout.create(workoutData);

        // Update user stats
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                'stats.totalWorkouts': 1,
                'stats.totalCaloriesBurned': workout.caloriesBurned,
                'stats.totalWorkoutTime': workout.duration
            },
            'stats.lastWorkoutDate': new Date()
        });

        // Check if workout contributes to any goals
        await updateGoalProgress(req.user._id, workout);

        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGoalProgress = async (userId, workout) => {
    const goals = await Goal.find({ user: userId, status: 'active' });

    for (const goal of goals) {
        let progressToAdd = 0;

        switch (goal.target.unit) {
            case 'minutes':
            case 'hours':
                progressToAdd = goal.target.unit === 'hours' ?
                    workout.duration / 60 : workout.duration;
                break;
            case 'workouts':
                progressToAdd = 1;
                break;
        }

        if (progressToAdd > 0) {
            goal.current += progressToAdd;
            if (goal.current >= goal.target.value) {
                goal.status = 'completed';
            }
            await goal.save();
        }
    }
};

exports.getUserWorkouts = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, startDate, endDate } = req.query;

        let query = { user: req.user._id };

        if (type) query.type = type;
        if (startDate || endDate) {
            query.workoutDate = {};
            if (startDate) query.workoutDate.$gte = new Date(startDate);
            if (endDate) query.workoutDate.$lte = new Date(endDate);
        }

        const workouts = await Workout.find(query)
            .populate('buddies', 'name avatar')
            .sort({ workoutDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Workout.countDocuments(query);

        res.json({
            workouts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const workout = await Workout.findById(workoutId)
            .populate('user', 'name avatar')
            .populate('buddies', 'name avatar');

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Check if user has access to this workout
        const hasAccess = workout.user._id.toString() === req.user._id.toString() ||
            workout.buddies.some(buddy => buddy._id.toString() === req.user._id.toString()) ||
            workout.isPublic;

        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const workout = await Workout.findOneAndUpdate(
            { _id: workoutId, user: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;

        const workout = await Workout.findOneAndDelete({ _id: workoutId, user: req.user._id });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Update user stats
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                'stats.totalWorkouts': -1,
                'stats.totalCaloriesBurned': -workout.caloriesBurned,
                'stats.totalWorkoutTime': -workout.duration
            }
        });

        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get weekly workout analytics
exports.getWeeklyAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const workouts = await Workout.find({
            user: userId,
            workoutDate: { $gte: oneWeekAgo, $lte: now }
        }).sort({ workoutDate: 1 });

        // Group by day of week
        const weeklyData = [];
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(oneWeekAgo.getTime() + i * 24 * 60 * 60 * 1000);
            const dayName = daysOfWeek[date.getDay()];

            const dayWorkouts = workouts.filter(workout => {
                const workoutDate = new Date(workout.workoutDate);
                return workoutDate.toDateString() === date.toDateString();
            });

            weeklyData.push({
                date: dayName,
                workouts: dayWorkouts.length,
                calories: dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
                duration: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
            });
        }

        res.json(weeklyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get monthly workout analytics
exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const workouts = await Workout.find({
            user: userId,
            workoutDate: { $gte: oneMonthAgo, $lte: now }
        });

        // Group by week
        const weeklyData = [];
        const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
        const startOfMonth = oneMonthAgo.getTime();
        const endOfMonth = now.getTime();

        for (let weekStart = startOfMonth; weekStart < endOfMonth; weekStart += millisecondsPerWeek) {
            const weekEnd = Math.min(weekStart + millisecondsPerWeek, endOfMonth);
            const weekWorkouts = workouts.filter(workout => {
                const workoutTime = new Date(workout.workoutDate).getTime();
                return workoutTime >= weekStart && workoutTime < weekEnd;
            });

            const weekNumber = Math.floor((weekStart - startOfMonth) / millisecondsPerWeek) + 1;

            weeklyData.push({
                week: `Week ${weekNumber}`,
                workouts: weekWorkouts.length,
                calories: weekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
                duration: weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
            });
        }

        res.json(weeklyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get workout stats summary
exports.getWorkoutStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '7d' } = req.query;

        let startDate;
        const now = new Date();

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case '90d':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
            case '1y':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const workouts = await Workout.find({
            user: userId,
            workoutDate: { $gte: startDate, $lte: now }
        });

        const stats = {
            totalWorkouts: workouts.length,
            totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
            totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            averageCaloriesPerWorkout: workouts.length > 0 ?
                Math.round(workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) / workouts.length) : 0,
            averageDurationPerWorkout: workouts.length > 0 ?
                Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length) : 0,
            workoutsByType: {},
            period: period
        };

        // Count workouts by type
        workouts.forEach(workout => {
            if (workout.type) {
                stats.workoutsByType[workout.type] = (stats.workoutsByType[workout.type] || 0) + 1;
            }
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
