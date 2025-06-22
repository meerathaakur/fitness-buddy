
// controllers/goal.controller.js
const Goal = require('../models/Goal');
const { createNotification } = require('../services/notification.service');

exports.createGoal = async (req, res) => {
    try {
        const goal = await Goal.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserGoals = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = { user: req.user._id };
        if (status) query.status = status;

        const goals = await Goal.find(query).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        
        const goal = await Goal.findOneAndUpdate(
            { _id: goalId, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGoalProgress = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { progress } = req.body;

        const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        goal.current = progress;
        
        if (progress >= goal.target.value && goal.status !== 'completed') {
            goal.status = 'completed';
            
            await createNotification({
                user: req.user._id,
                type: 'milestone_achieved',
                title: 'Goal Completed!',
                message: `Congratulations! You completed your goal: ${goal.title}`,
                data: { goalId: goal._id }
            });
        }

        await goal.save();
        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        
        const goal = await Goal.findOneAndDelete({ _id: goalId, user: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
