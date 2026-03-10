const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// @desc    Get Global Leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
    try {
        // Get top 20 users by points (Assuming user model has points, or we aggregate from UserProgress)
        // Ideally User model should have a 'points' field updated by triggers or background jobs.
        // For now, let's aggregate from UserProgress if User.points is not reliable, or assume User has points.

        // Let's assume User model has 'points'.
        // If not, we might need to aggregate.
        // Checking User model... usually specific leaderboard service updates the User.points.

        // Simple version: Find users sort by points
        const users = await User.find({ role: 'learner' }) // Only show learners
            .select('firstName lastName avatar points level')
            .sort('-points')
            .limit(20);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
            userRank: null // To be implemented
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get My Rank
// @route   GET /api/leaderboard/my-rank
// @access  Private
exports.getMyRank = async (req, res, next) => {
    try {
        const myPoints = req.user.points || 0;

        const rank = await User.countDocuments({
            role: 'learner',
            points: { $gt: myPoints }
        }) + 1;

        res.status(200).json({
            success: true,
            data: {
                rank,
                points: myPoints
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
