const UserProgress = require('../models/UserProgress');

// @desc    Get User Analytics
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const progress = await UserProgress.find({ user: userId });
        const completedLabs = progress.filter(p => p.completed).length;
        const totalAttempts = progress.reduce((acc, curr) => acc + (curr.attempts || 0), 0);

        // Calculate pass rate
        const quizPassRate = progress.length > 0 ? (completedLabs / progress.length) * 100 : 0;

        // Mock overall progress for now based on lab count (assuming 200 labs)
        const overallProgress = (completedLabs / 200) * 100;

        res.status(200).json({
            success: true,
            data: {
                quizPassRate,
                labPassRate: quizPassRate, // Using same logic for now
                quizAttempts: totalAttempts,
                labAttempts: totalAttempts,
                overallProgress,
                recentActivity: [], // Populate if needed
                quizHistory: [65, 59, 80, 81, 56, 55, 40] // Mock history for chart
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get Platform Stats
// @route   GET /api/analytics/platform
// @access  Private
exports.getPlatformStats = async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {}
    });
};
