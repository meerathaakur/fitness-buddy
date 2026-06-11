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
const userRoutes = require('./routes/user.routes');
const buddyRoutes = require('./routes/buddy.routes');
const workoutRoutes = require('./routes/workout.routes');
const messageRoutes = require('./routes/message.routes');
const goalRoutes = require('./routes/goal.routes');
const challengeRoutes = require('./routes/challenge.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes')

const app = express();
const httpServer = createServer(app);

// allowed origins for CORS
const allowedOrigins = [
    "http://localhost:3000",
    "https://fitness-buddy-five.vercel.app",
    "https://accounts.google.com"
];

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
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // 👈 explicitly allow only these
    allowedHeaders: ["Content-Type", "Authorization"],  // 👈 useful if sending tokens
    credentials: true,
}));
// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/buddies', buddyRoutes);
app.use('/workouts', workoutRoutes);
app.use('/messages', messageRoutes);
app.use('/goals', goalRoutes);
app.use('/challenges', challengeRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/notifications', notificationRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ message: "This API is Working fine its health is good", status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorMiddleware);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = app