const UserProgress = require('../models/UserProgress');

// @desc    Get user progress summary and per-lab details
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;

        // Find all progress records for this user
        const progressRecords = await UserProgress.find({ user: userId });

        // Calculate overall stats
        const completedLabs = progressRecords.filter(p => p.completed).length;
        const totalScore = progressRecords.reduce((acc, curr) => acc + (curr.score || 0), 0);
        
        // Mock total lab count for percentage (can be dynamic later)
        const totalLabsAvailable = 200; 
        const completionRate = totalLabsAvailable > 0 ? Math.round((completedLabs / totalLabsAvailable) * 100) : 0;

        res.status(200).json({
            success: true,
            overall: {
                completionRate,
                totalScore,
                completedCount: completedLabs
            },
            labs: progressRecords // This allows the frontend to map labs to their specific progress
        });
    } catch (err) {
        console.error('[PROGRESS_FETCH] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Progress synchronization failed.'
        });
    }
};
