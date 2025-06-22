
// controllers/challenge.controller.js
const Challenge = require('../models/Challenge');
const { createNotification } = require('../services/notification.service');

exports.createChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.create({
            ...req.body,
            creator: req.user._id,
            participants: [{ user: req.user._id }]
        });

        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllChallenges = async (req, res) => {
    try {
        const { type, category, status = 'active' } = req.query;
        
        let query = { isActive: status === 'active' };
        
        if (type) query.type = type;
        if (category) query.category = category;

        const challenges = await Challenge.find(query)
            .populate('creator', 'name avatar')
            .populate('participants.user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.joinChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.user._id;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const alreadyJoined = challenge.participants.some(
            p => p.user.toString() === userId.toString()
        );

        if (alreadyJoined) {
            return res.status(400).json({ error: 'Already joined this challenge' });
        }

        if (challenge.participants.length >= challenge.maxParticipants) {
            return res.status(400).json({ error: 'Challenge is full' });
        }

        challenge.participants.push({ user: userId });
        await challenge.save();

        res.json({ message: 'Joined challenge successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateChallengeProgress = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { progress } = req.body;
        const userId = req.user._id;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const participant = challenge.participants.find(
            p => p.user.toString() === userId.toString()
        );

        if (!participant) {
            return res.status(400).json({ error: 'Not a participant in this challenge' });
        }

        participant.progress = progress;
        
        if (progress >= challenge.goal.target) {
            participant.completed = true;
            
            await createNotification({
                user: userId,
                type: 'challenge_completed',
                title: 'Challenge Completed!',
                message: `Congratulations! You completed the ${challenge.title} challenge!`,
                data: { challengeId: challenge._id }
            });
        }

        await challenge.save();
        res.json({ message: 'Progress updated successfully', participant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChallengeLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;
        
        const challenge = await Challenge.findById(challengeId)
            .populate('participants.user', 'name avatar');
        
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const leaderboard = challenge.participants
            .sort((a, b) => b.progress - a.progress)
            .map((participant, index) => ({
                rank: index + 1,
                user: participant.user,
                progress: participant.progress,
                completed: participant.completed,
                progressPercentage: (participant.progress / challenge.goal.target) * 100
            }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
