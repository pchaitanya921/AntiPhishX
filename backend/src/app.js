const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

// Initialize express app
const app = express();

// Set static folder for uploads - Consolidated to single path
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Enable CORS — explicit allowlist (no wildcard with credentials)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true
}));

// Set security HTTP headers
app.use(helmet());

// Development request logging only
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[REQUEST] ${req.method} ${req.url}`);
        next();
    });
}

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser — 10mb limit (use multipart/streams for large file uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Routes
const authRoutes = require('./routes/auth.routes');
const labRoutes = require('./routes/lab.routes');
const adminRoutes = require('./routes/admin.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const courseRoutes = require('./routes/course.routes');
const instructorRoutes = require('./routes/instructor.routes');
const achievementRoutes = require('./routes/achievement.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const noteRoutes = require('./routes/note.routes');
const aiRoutes = require('./routes/ai.routes');
const phishingRoutes = require('./routes/phishing.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const quizRoutes = require('./routes/quiz.routes');
const notificationRoutes = require('./routes/notification.routes');

app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/phishing', phishingRoutes);
app.use('/api/scenario', scenarioRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notifications', notificationRoutes);


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.send('AntiPhishX Backend API is running');
});

// Handle undefined routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global error handling middleware — never expose stack traces to clients
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    // Log full error internally
    console.error(`[ERROR] ${statusCode} - ${err.message}`, err.stack);

    // Production: safe response only
    res.status(statusCode).json({
        status,
        message: err.isOperational ? err.message : 'An unexpected error occurred. Please try again later.'
    });
});

module.exports = app;
