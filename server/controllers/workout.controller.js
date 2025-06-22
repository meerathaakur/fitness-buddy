
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
        const { page = 1, limit = 20, type, startDate, endDate } = req.query;

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
            req.body,
            { new: true }
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
