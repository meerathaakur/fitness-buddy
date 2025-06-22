
// controllers/buddy.controller.js
const User = require('../models/User');
const Buddy = require('../models/Buddy');
const { createNotification } = require('../services/notification.service');

exports.findBuddies = async (req, res) => {
    try {
        const userId = req.user._id;
        const { workoutType, fitnessLevel, maxDistance = 50 } = req.query;

        const user = await User.findById(userId);
        const userLocation = user.location.coordinates;

        let matchQuery = {
            _id: { $ne: userId },
            isActive: true
        };

        if (workoutType) {
            matchQuery['preferences.workoutTypes'] = workoutType;
        }

        if (fitnessLevel) {
            matchQuery['preferences.fitnessLevel'] = fitnessLevel;
        }

        const potentialBuddies = await User.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: userLocation
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistance * 1000, // Convert km to meters
                    spherical: true
                }
            },
            { $match: matchQuery },
            { $limit: 20 }
        ]);

        // Calculate match scores
        const buddiesWithScores = potentialBuddies.map(buddy => {
            const score = calculateMatchScore(user, buddy);
            return { ...buddy, matchScore: score };
        });

        buddiesWithScores.sort((a, b) => b.matchScore - a.matchScore);

        res.json(buddiesWithScores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const calculateMatchScore = (user1, user2) => {
    let score = 0;
    
    // Common workout types
    const commonWorkouts = user1.preferences.workoutTypes.filter(
        type => user2.preferences.workoutTypes.includes(type)
    );
    score += commonWorkouts.length * 20;
    
    // Same fitness level
    if (user1.preferences.fitnessLevel === user2.preferences.fitnessLevel) {
        score += 30;
    }
    
    // Distance factor (closer = higher score)
    const maxDistance = 50000; // 50km
    const distanceFactor = Math.max(0, (maxDistance - user2.distance) / maxDistance);
    score += distanceFactor * 30;
    
    return Math.round(score);
};

exports.sendBuddyRequest = async (req, res) => {
    try {
        const requesterId = req.user._id;
        const { recipientId } = req.body;

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ error: 'Cannot send request to yourself' });
        }

        const existingRequest = await Buddy.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Request already exists' });
        }

        const buddy = await Buddy.create({
            requester: requesterId,
            recipient: recipientId
        });

        await createNotification({
            user: recipientId,
            type: 'buddy_request',
            title: 'New Buddy Request',
            message: `${req.user.name} wants to be your workout buddy!`,
            data: { userId: requesterId }
        });

        res.status(201).json({ message: 'Buddy request sent', buddy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.respondToBuddyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // 'accept' or 'reject'

        const buddy = await Buddy.findById(requestId);
        if (!buddy) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (buddy.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        buddy.status = action === 'accept' ? 'accepted' : 'rejected';
        await buddy.save();

        if (action === 'accept') {
            // Add each other to buddies list
            await User.findByIdAndUpdate(buddy.requester, {
                $addToSet: { buddies: buddy.recipient }
            });
            await User.findByIdAndUpdate(buddy.recipient, {
                $addToSet: { buddies: buddy.requester }
            });

            await createNotification({
                user: buddy.requester,
                type: 'buddy_accepted',
                title: 'Buddy Request Accepted',
                message: `${req.user.name} accepted your buddy request!`,
                data: { userId: req.user._id }
            });
        }

        res.json({ message: `Request ${action}ed successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBuddies = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('buddies', 'name email avatar preferences stats lastSeen');
        res.json(user.buddies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
