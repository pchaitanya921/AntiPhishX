/**
 * Rate Limiting Configuration for AI Endpoints
 * Prevents abuse with 20 requests per minute limit
 */

const rateLimit = require('express-rate-limit');

/**
 * AI Chat Rate Limiter
 * 20 requests per minute per user/IP
 */
const aiChatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per window
    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many AI requests. Please wait a moment before trying again.',
        retryAfter: 60 // seconds
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Use user ID if authenticated, otherwise IP
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },
    skip: (req) => {
        // Skip rate limiting for admin/instructor mode
        return req.user?.role === 'admin' || req.body?.mode === 'instructor';
    }
});

/**
 * Stricter rate limiter for lab mode (prevent hint spamming)
 * 10 requests per minute
 */
const labAssistantLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Please slow down. Take time to analyze the lab before requesting more hints.',
        retryAfter: 60
    },
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => req.body?.mode !== 'lab'
});

module.exports = {
    aiChatLimiter,
    labAssistantLimiter
};
