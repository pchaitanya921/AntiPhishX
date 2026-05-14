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
const crypto = require('crypto');

// Initialize express app
const app = express();

// Set static folder for uploads - Consolidated to single path
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Enable CORS — strict production allowlist
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_ALT, // Support for alternate domains/preview urls
].filter(Boolean);

app.use(cors({
    origin: true, // Allow all origins for now to fix the Network Error
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id', 'X-Correlation-ID']
}));

// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://api.razorpay.com", "*.razorpay.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws://localhost:3000", "ws://localhost:5000", "ws://127.0.0.1:3000", "ws://127.0.0.1:5000", "http://localhost:5000", "http://127.0.0.1:5000", "https://api.groq.com", "https://api.resend.com", "https://api.razorpay.com", "*.razorpay.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com", "*.razorpay.com"],
        },
    },
}));

// Correlation ID for Observability
app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    res.setHeader('X-Correlation-ID', req.id);
    next();
});

// Production request logging for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

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

// Apply rate limiting to Auth and SCIM endpoints
app.use('/api/auth', limiter);
app.use('/api/scim/v2', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'SCIM rate limit exceeded'
}));
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

const { protect } = require('./middleware/auth.middleware');
const { deviceEnforcement } = require('./middleware/device.middleware');

// Apply Global Auth Context & Device Tracking to Protected Routes
app.use('/api', (req, res, next) => {
    // Certain routes are public (login, register, etc.)
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/sso/status', '/auth/sso/login', '/auth/sso/callback', '/auth/refresh'];
    const isPublic = publicRoutes.some(route => req.path.startsWith(route));
    
    if (isPublic) return next();
    
    // For all other routes, enforce protection and device limits
    return protect(req, res, () => {
        deviceEnforcement(req, res, next);
    });
});

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
const campaignRoutes = require('./routes/campaign.routes');
const demoRoutes = require('./routes/demo.routes');
const scimRoutes = require('./routes/scim.routes');
const briefingRoutes = require('./routes/briefing.routes');
const certificateRoutes = require('./routes/certificate.routes');
const progressRoutes = require('./routes/progress.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const paymentRoutes = require('./routes/payment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/phishing', phishingRoutes);
app.use('/api/scenario', scenarioRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/scim/v2', scimRoutes);
app.use('/api/briefing', briefingRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/enterprise', require('./routes/enterprise.routes'));
app.use('/api/admin-insights', require('./routes/adminInsight.routes'));
app.use('/api/progress', progressRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);

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
        message: process.env.NODE_ENV === 'development' ? err.message : (err.isOperational ? err.message : 'An unexpected error occurred. Please try again later.')
    });
});

module.exports = app;
