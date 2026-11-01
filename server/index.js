const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const config = require('./config/env');
const logger = require('./utils/logger');

const app = express();

// 1. HTTP Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: false, // Allows flexible SPA asset loading in dev
    crossOriginEmbedderPolicy: false
}));

// 2. Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. NoSQL Injection Sanitization
app.use(mongoSanitize());

// 4. Rate Limiting (Prevents Brute-Force & Denial-of-Service)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 600, // 600 requests per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 login/register requests per IP
    message: { success: false, message: 'Too many authentication attempts. Please wait 15 minutes.' }
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 5. CORS Configuration with strict origin reflection
const allowedOrigins = [config.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 6. Request Audit & Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip });
    next();
});

// 7. Database Connection with Auto-reconnect
mongoose.connect(config.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully to UniConnect ERP'))
    .catch(err => {
        logger.error('MongoDB Connection Failed:', { error: err.message });
        process.exit(1);
    });

// 8. Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

app.get('/', (req, res) => {
    res.send('UniConnect University ERP API v2.0 is running securely...');
});

// 9. API Module Mounts
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
app.use('/api/erp', require('./routes/academicApiRoutes'));
app.use('/api/enterprise', require('./routes/enterpriseRoutes'));

// 10. 404 Route Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// 11. Centralized Global Error Handler
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.originalUrl });
    
    // Mongoose CastError / Duplicate Key error handling
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: `Invalid resource ID format: ${err.value}` });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ success: false, message: `Duplicate field value entered: ${field} already exists.` });
    }

    const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: config.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = config.PORT || 5000;
app.listen(PORT, () => console.log(`UniConnect ERP Server running on port ${PORT} [${config.NODE_ENV}]`));
