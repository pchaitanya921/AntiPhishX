const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { deviceEnforcement } = require('../middleware/device.middleware');
const {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getQuizHistory,
    getQuizAttempts,
    getQuizStats
} = require('../controllers/quiz.controller');

// All quiz routes require authentication
router.use(protect);
router.use(deviceEnforcement);

// --- Public/General Routes ---
router.get('/', getQuizzes);
router.get('/:id', getQuizById);

// --- Learner & User Specific Routes ---
router.post('/submit', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/history/:quizId', getQuizAttempts);
router.get('/stats', getQuizStats);

// --- Admin Specific Routes ---
router.post('/', authorize('admin'), createQuiz);
router.put('/:id', authorize('admin'), updateQuiz);
router.delete('/:id', authorize('admin'), deleteQuiz);

module.exports = router;
