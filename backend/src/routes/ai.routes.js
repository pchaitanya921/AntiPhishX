const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');
const { antiCheatFilter } = require('../middleware/antiCheat.middleware');
const { topicFilter } = require('../middleware/topicFilter.middleware');
const { aiChatLimiter, labAssistantLimiter } = require('../middleware/rateLimit.middleware');

/**
 * AI Routes
 * All routes require authentication
 */

// Apply authentication to all AI routes
router.use(protect);

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI
 * @access  Private
 * @middleware  Rate limiting, anti-cheat, topic filter
 */
router.post(
    '/chat',
    aiChatLimiter,
    labAssistantLimiter,
    antiCheatFilter,
    topicFilter,
    aiController.chat
);

/**
 * @route   GET /api/ai/sessions
 * @desc    Get all chat sessions
 * @access  Private
 */
router.get('/sessions', aiController.getSessions);

/**
 * @route   GET /api/ai/sessions/:id
 * @desc    Get specific chat session with messages
 * @access  Private
 */
router.get('/sessions/:id', aiController.getSession);

/**
 * @route   PUT /api/ai/sessions/:id
 * @desc    Update chat session (rename)
 * @access  Private
 */
router.put('/sessions/:id', aiController.updateSession);

/**
 * @route   DELETE /api/ai/sessions/:id
 * @desc    Delete chat session
 * @access  Private
 */
router.delete('/sessions/:id', aiController.deleteSession);

/**
 * @route   GET /api/ai/profile
 * @desc    Get user's cyber profile
 * @access  Private
 */
router.get('/profile', aiController.getCyberProfile);

/**
 * @route   PUT /api/ai/profile
 * @desc    Update user's cyber profile
 * @access  Private
 */
router.put('/profile', aiController.updateCyberProfile);

/**
 * @route   POST /api/ai/risk/violation
 * @desc    Record risk violation
 * @access  Private
 */
router.post('/risk/violation', aiController.recordViolation);

module.exports = router;
