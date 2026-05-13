const QuizSubmission = require('../models/QuizSubmission');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationHelper');

/**
 * GET /api/quizzes
 * Fetch all quizzes. Learners only see 'published' quizzes.
 */
exports.getQuizzes = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { status: 'published' };
        const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

        // NEW: Add locked status based on user plan
        const { canAccessLevel } = require('../config/plans');
        const userPlan = req.user?.currentPlan || 'core_node';

        const quizzesWithAccess = quizzes.map(quiz => {
            const quizObj = quiz.toObject();
            quizObj.isLocked = !canAccessLevel(userPlan, quiz.difficulty);
            return quizObj;
        });

        res.status(200).json({ success: true, count: quizzesWithAccess.length, data: quizzesWithAccess });
    } catch (err) {
        console.error('[QuizController] getQuizzes error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
    }
};

/**
 * GET /api/quizzes/:id
 * Fetch a specific quiz by ID.
 */
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // NEW: Enforce Plan Restriction for single quiz access
        const { canAccessLevel } = require('../config/plans');
        const userPlan = req.user?.currentPlan || 'core_node';
        if (!canAccessLevel(userPlan, quiz.difficulty) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `The ${quiz.difficulty.toUpperCase()} quiz '${quiz.title}' is locked. Please upgrade your plan to unlock.`,
                code: 'INSUFFICIENT_PLAN',
                requiredLevel: quiz.difficulty
            });
        }

        res.status(200).json({ success: true, data: quiz });
    } catch (err) {
        console.error('[QuizController] getQuizById error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
    }
};

/**
 * POST /api/quizzes
 * Create a new quiz (Admin Only).
 */
exports.createQuiz = async (req, res) => {
    try {
        const quizData = {
            ...req.body,
            createdBy: req.user._id
        };
        const quiz = await Quiz.create(quizData);
        res.status(201).json({ success: true, data: quiz });
    } catch (err) {
        console.error('[QuizController] createQuiz error:', err);
        res.status(500).json({ success: false, message: 'Failed to create quiz' });
    }
};

/**
 * PUT /api/quizzes/:id
 * Update an existing quiz (Admin Only).
 */
exports.updateQuiz = async (req, res) => {
    try {
        let quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: quiz });
    } catch (err) {
        console.error('[QuizController] updateQuiz error:', err);
        res.status(500).json({ success: false, message: 'Failed to update quiz' });
    }
};

/**
 * DELETE /api/quizzes/:id
 * Delete a quiz (Admin Only).
 */
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        await quiz.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('[QuizController] deleteQuiz error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete quiz' });
    }
};

/**
 * POST /api/quizzes/submit
 * Submit a completed quiz, persist the attempt, award XP to the user,
 * and fire a notification.
 */
exports.submitQuiz = async (req, res) => {
    try {
        const {
            quizId,
            quizTitle,
            category,
            difficulty,
            answers,         // { "0": 2, "1": 0, ... }
            score,
            total,
            xpEarned,
            timeTakenSeconds,
            autoSubmitted
        } = req.body;

        // NEW: Enforce Plan Restriction for submission
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const { canAccessLevel } = require('../config/plans');
        const userPlan = req.user?.currentPlan || 'core_node';
        if (!canAccessLevel(userPlan, quiz.difficulty) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Subscription plan insufficient for this quiz module.',
                code: 'INSUFFICIENT_PLAN'
            });
        }

        // --- Validate required fields ---
        if (!quizId || !quizTitle || score === undefined || !total) {
            return res.status(400).json({
                success: false,
                message: 'quizId, quizTitle, score, and total are required'
            });
        }

        const percentage = Math.round((score / total) * 100);
        const passed = percentage >= 70;

        // --- Persist submission ---
        const submission = await QuizSubmission.create({
            user: req.user._id,
            quizId,
            quizTitle,
            category,
            difficulty,
            answers: answers || {},
            score,
            total,
            percentage,
            passed,
            xpEarned: xpEarned || 0,
            timeTakenSeconds: timeTakenSeconds || 0,
            autoSubmitted: autoSubmitted || false
        });

        // --- Award XP to user ---
        if (xpEarned && xpEarned > 0) {
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { points: xpEarned }
            });
        }

        // --- Send in-app notification ---
        if (passed) {
            await createNotification(req.user._id, {
                title: `Quiz Passed! 🎉`,
                message: `You scored ${percentage}% on "${quizTitle}" and earned ${xpEarned} XP!`,
                type: 'quiz',
                icon: '🎯',
                link: '/quizzes'
            });
        } else {
            await createNotification(req.user._id, {
                title: `Quiz Complete`,
                message: `You scored ${percentage}% on "${quizTitle}". Keep practising!`,
                type: 'quiz',
                icon: '📝',
                link: '/quizzes'
            });
        }

        res.status(201).json({
            success: true,
            data: submission
        });

    } catch (err) {
        console.error('[QuizController] submitQuiz error:', err);
        res.status(500).json({ success: false, message: 'Failed to save quiz submission' });
    }
};

/**
 * GET /api/quizzes/history
 * Returns all quiz submissions for the authenticated user (most recent first).
 */
exports.getQuizHistory = async (req, res) => {
    try {
        const submissions = await QuizSubmission.find({ user: req.user._id })
            .sort({ submittedAt: -1 })
            .limit(50)
            .select('-answers'); // omit large answers map for list view

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (err) {
        console.error('[QuizController] getQuizHistory error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz history' });
    }
};

/**
 * GET /api/quizzes/history/:quizId
 * Returns all attempts for a specific quiz by the authenticated user.
 */
exports.getQuizAttempts = async (req, res) => {
    try {
        const { quizId } = req.params;
        const submissions = await QuizSubmission.find({
            user: req.user._id,
            quizId
        }).sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
            bestScore: submissions.length > 0
                ? Math.max(...submissions.map(s => s.percentage))
                : 0
        });
    } catch (err) {
        console.error('[QuizController] getQuizAttempts error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz attempts' });
    }
};

/**
 * GET /api/quizzes/stats
 * Returns aggregated statistics for the authenticated user across all quizzes.
 */
exports.getQuizStats = async (req, res) => {
    try {
        const [stats] = await QuizSubmission.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalAttempts: { $sum: 1 },
                    totalPassed: { $sum: { $cond: ['$passed', 1, 0] } },
                    totalXPEarned: { $sum: '$xpEarned' },
                    avgPercentage: { $avg: '$percentage' },
                    avgTimeTaken: { $avg: '$timeTakenSeconds' },
                    uniqueQuizzes: { $addToSet: '$quizId' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAttempts: 1,
                    totalPassed: 1,
                    totalXPEarned: 1,
                    avgPercentage: { $round: ['$avgPercentage', 1] },
                    avgTimeTaken: { $round: ['$avgTimeTaken', 0] },
                    uniqueQuizzesAttempted: { $size: '$uniqueQuizzes' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats || {
                totalAttempts: 0,
                totalPassed: 0,
                totalXPEarned: 0,
                avgPercentage: 0,
                avgTimeTaken: 0,
                uniqueQuizzesAttempted: 0
            }
        });
    } catch (err) {
        console.error('[QuizController] getQuizStats error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz statistics' });
    }
};
