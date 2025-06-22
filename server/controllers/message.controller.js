
// controllers/message.controller.js
const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content, messageType = 'text', metadata } = req.body;
        
        const message = await Message.create({
            sender: req.user._id,
            recipient: recipientId,
            content,
            messageType,
            metadata
        });

        await message.populate('sender', 'name avatar');
        await message.populate('recipient', 'name avatar');

        // Emit socket event
        const io = req.app.get('io');
        io.to(recipientId).emit('newMessage', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { buddyId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: buddyId },
                { sender: buddyId, recipient: req.user._id }
            ]
        })
        .populate('sender', 'name avatar')
        .populate('recipient', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        // Mark messages as read
        await Message.updateMany(
            { sender: buddyId, recipient: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { recipient: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', req.user._id] },
                            then: '$recipient',
                            else: '$sender'
                        }
                    },
                    lastMessage: { $first: '$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: ['$recipient', req.user._id] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'buddy'
                }
            },
            {
                $unwind: '$buddy'
            },
            {
                $project: {
                    buddy: {
                        _id: '$buddy._id',
                        name: '$buddy.name',
                        avatar: '$buddy.avatar',
                        lastSeen: '$buddy.lastSeen'
                    },
                    lastMessage: '$lastMessage',
                    unreadCount: '$unreadCount'
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ]);

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
