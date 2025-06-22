require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const { createServer } = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const errorMiddleware = require('./middlewares/error.middleware');
const Scheduler = require('./jobs/scheduler');
const SocketHandlers = require('./sockets/socketHandlers');

// Import routes
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
// const buddyRoutes = require('./routes/buddy.routes');
// const workoutRoutes = require('./routes/workout.routes');
// const messageRoutes = require('./routes/message.routes');
// const goalRoutes = require('./routes/goal.routes');
// const challengeRoutes = require('./routes/challenge.routes');
// const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
const httpServer = createServer(app);

// Configure Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ['GET', 'POST'],
    },
});

// Attach io to app for use in controllers
app.set('io', io);

// Connect to Database
connectDB();

// Configure Passport
configurePassport(passport);

// Initialize Socket Handlers
SocketHandlers.init(io);

// Initialize Scheduled Jobs
Scheduler.init();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/buddies', buddyRoutes);
// app.use('/api/workouts', workoutRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/goals', goalRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorMiddleware);

// Socket.IO connection handling
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('joinRoom', (room) => {
//         socket.join(room);
//         console.log(`User joined room: ${room}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = app