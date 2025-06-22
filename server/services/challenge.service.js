
// services/challenge.service.js
const Challenge = require('../models/Challenge');
const User = require('../models/User');

class ChallengeService {
    static async createChallenge(challengeData) {
        try {
            const challenge = await Challenge.create({
                ...challengeData,
                participants: challengeData.participants || []
            });
            return challenge;
        } catch (error) {
            console.error('Error creating challenge:', error);
            throw error;
        }
    }

    static async joinChallenge(challengeId, userId) {
        try {
            const challenge = await Challenge.findById(challengeId);
            if (!challenge) throw new Error('Challenge not found');

            const alreadyJoined = challenge.participants.some(
                p => p.userId.toString() === userId
            );

            if (alreadyJoined) {
                throw new Error('Already joined this challenge');
            }

            challenge.participants.push({
                userId,
                progress: 0,
                status: 'active'
            });

            await challenge.save();
            return challenge;
        } catch (error) {
            console.error('Error joining challenge:', error);
            throw error;
        }
    }

    static async updateProgress(challengeId, userId, progress) {
        try {
            const challenge = await Challenge.findById(challengeId);
            if (!challenge) throw new Error('Challenge not found');

            const participant = challenge.participants.find(
                p => p.userId.toString() === userId
            );

            if (!participant) {
                throw new Error('User not participating in this challenge');
            }

            participant.progress = progress;
            
            // Check if challenge is completed
            if (progress >= challenge.target) {
                participant.status = 'completed';
                participant.completedAt = new Date();
            }

            await challenge.save();
            return challenge;
        } catch (error) {
            console.error('Error updating challenge progress:', error);
            throw error;
        }
    }

    static async getChallengeLeaderboard(challengeId) {
        try {
            const challenge = await Challenge.findById(challengeId)
                .populate('participants.userId', 'name profilePicture');

            if (!challenge) throw new Error('Challenge not found');

            const leaderboard = challenge.participants
                .sort((a, b) => b.progress - a.progress)
                .map((participant, index) => ({
                    rank: index + 1,
                    user: participant.userId,
                    progress: participant.progress,
                    status: participant.status,
                    completedAt: participant.completedAt
                }));

            return leaderboard;
        } catch (error) {
            console.error('Error getting challenge leaderboard:', error);
            throw error;
        }
    }
}

module.exports = ChallengeService;
