
// services/buddy.service.js
const User = require('../models/User');
const BuddyRequest = require('../models/Buddy');

class BuddyService {
    static async findPotentialBuddies(userId, filters = {}) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const query = { _id: { $ne: userId } };

            // Apply filters
            if (filters.location) {
                query.location = new RegExp(filters.location, 'i');
            }

            if (filters.workoutTypes && filters.workoutTypes.length > 0) {
                query.workoutTypes = { $in: filters.workoutTypes };
            }

            if (filters.fitnessGoals && filters.fitnessGoals.length > 0) {
                query.fitnessGoals = { $in: filters.fitnessGoals };
            }

            // Get existing connections to exclude
            const existingConnections = await BuddyRequest.find({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            }).select('sender receiver');

            const excludeIds = existingConnections.map(conn => 
                conn.sender.toString() === userId ? conn.receiver : conn.sender
            );

            query._id = { $ne: userId, $nin: excludeIds };

            const potentialBuddies = await User.find(query)
                .select('-password')
                .limit(20);

            // Calculate compatibility scores
            const buddiesWithScores = potentialBuddies.map(buddy => ({
                ...buddy.toObject(),
                compatibilityScore: this.calculateCompatibilityScore(user, buddy)
            }));

            // Sort by compatibility score
            buddiesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

            return buddiesWithScores;
        } catch (error) {
            console.error('Error finding potential buddies:', error);
            throw error;
        }
    }

    static calculateCompatibilityScore(user1, user2) {
        let score = 0;

        // Location match (30 points)
        if (user1.location && user2.location && 
            user1.location.toLowerCase() === user2.location.toLowerCase()) {
            score += 30;
        }

        // Workout types match (40 points)
        const commonWorkoutTypes = user1.workoutTypes?.filter(type => 
            user2.workoutTypes?.includes(type)
        ) || [];
        score += Math.min(commonWorkoutTypes.length * 10, 40);

        // Fitness goals match (30 points)
        const commonGoals = user1.fitnessGoals?.filter(goal => 
            user2.fitnessGoals?.includes(goal)
        ) || [];
        score += Math.min(commonGoals.length * 10, 30);

        return score;
    }

    static async sendBuddyRequest(senderId, receiverId, message = '') {
        try {
            // Check if request already exists
            const existingRequest = await BuddyRequest.findOne({
                sender: senderId,
                receiver: receiverId
            });

            if (existingRequest) {
                throw new Error('Buddy request already sent');
            }

            const buddyRequest = await BuddyRequest.create({
                sender: senderId,
                receiver: receiverId,
                message,
                status: 'pending'
            });

            return buddyRequest;
        } catch (error) {
            console.error('Error sending buddy request:', error);
            throw error;
        }
    }

    static async getUserBuddies(userId) {
        try {
            const acceptedRequests = await BuddyRequest.find({
                $or: [
                    { sender: userId, status: 'accepted' },
                    { receiver: userId, status: 'accepted' }
                ]
            }).populate('sender receiver', '-password');

            const buddies = acceptedRequests.map(request => {
                return request.sender._id.toString() === userId ? 
                    request.receiver : request.sender;
            });

            return buddies;
        } catch (error) {
            console.error('Error getting user buddies:', error);
            throw error;
        }
    }
}

module.exports = BuddyService;
