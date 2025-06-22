
// sockets/socketHandlers.js
const MessageService = require('../services/message.service');
const NotificationService = require('../services/notification.service');

class SocketHandlers {
    static init(io) {
        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            // Join user to their personal room
            socket.on('join', (userId) => {
                socket.join(`user_${userId}`);
                socket.userId = userId;
                console.log(`User ${userId} joined their room`);
            });

            // Handle private messages
            socket.on('sendMessage', async (data) => {
                try {
                    const { receiverId, content, type = 'text' } = data;
                    
                    const message = await MessageService.sendMessage(
                        socket.userId,
                        receiverId,
                        content,
                        type
                    );

                    // Send to receiver
                    io.to(`user_${receiverId}`).emit('newMessage', message);
                    
                    // Send confirmation to sender
                    socket.emit('messageSent', message);
                } catch (error) {
                    socket.emit('messageError', error.message);
                }
            });

            // Handle typing indicators
            socket.on('typing', (data) => {
                const { receiverId } = data;
                io.to(`user_${receiverId}`).emit('userTyping', {
                    userId: socket.userId,
                    isTyping: true
                });
            });

            socket.on('stopTyping', (data) => {
                const { receiverId } = data;
                io.to(`user_${receiverId}`).emit('userTyping', {
                    userId: socket.userId,
                    isTyping: false
                });
            });

            // Handle workout sharing
            socket.on('shareWorkout', (data) => {
                const { buddyIds, workoutData } = data;
                
                buddyIds.forEach(buddyId => {
                    io.to(`user_${buddyId}`).emit('workoutShared', {
                        fromUser: socket.userId,
                        workout: workoutData
                    });
                });
            });

            // Handle challenge invitations
            socket.on('challengeInvite', (data) => {
                const { userIds, challengeData } = data;
                
                userIds.forEach(userId => {
                    io.to(`user_${userId}`).emit('challengeInvitation', {
                        fromUser: socket.userId,
                        challenge: challengeData
                    });
                });
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
}

module.exports = SocketHandlers;
