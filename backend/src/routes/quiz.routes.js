const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    submitQuiz,
    getQuizHistory,
    getQuizAttempts,
    getQuizStats
} = require('../controllers/quiz.controller');

// All quiz routes require authentication
router.use(protect);

/**
 * POST   /api/quizzes/submit          Submit a completed quiz attempt
 * GET    /api/quizzes/history         Get all quiz attempts for the user
 * GET    /api/quizzes/history/:quizId Get attempts for a specific quiz
 * GET    /api/quizzes/stats           Get aggregated quiz statistics
 */
router.post('/submit', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/history/:quizId', getQuizAttempts);
router.get('/stats', getQuizStats);

module.exports = router;
