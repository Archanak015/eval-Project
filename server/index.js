const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Security & Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS setup
const allowedOrigins = process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

// Basic Security Header Middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('X-Powered-By');
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Failed:', err);
        process.exit(1);
    });

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Root Route
app.get('/', (req, res) => {
    res.send('UniConnect API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/academic', require('./routes/courseRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/tracker', require('./routes/academicTrackerRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/faculty', require('./routes/facultyStudentRoutes'));
app.use('/api/admin/academic', require('./routes/adminAcademicRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('--- Global Error Logger ---', err.message);
    const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
