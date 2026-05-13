const User = require('../models/User');
const { PLANS, PLAN_CONFIG } = require('../config/plans');

/**
 * @desc    Get all subscriptions (Admin)
 * @route   GET /api/v1/subscriptions
 * @access  Private/Admin
 */
exports.getSubscriptions = async (req, res) => {
    try {
        const users = await User.find({ role: 'learner' })
            .select('firstName lastName email currentPlan subscriptionStatus planExpiresAt organization')
            .populate('organization', 'name');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Update user subscription plan
 * @route   PUT /api/v1/subscriptions/:userId
 * @access  Private/Admin
 */
exports.updateUserPlan = async (req, res) => {
    try {
        const { plan, status, expiresAt, resetDevices } = req.body;

        if (plan && !Object.values(PLANS).includes(plan)) {
            return res.status(400).json({ success: false, message: 'Invalid plan level' });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (plan) {
            user.currentPlan = plan;
            user.maxDevices = PLAN_CONFIG[plan].deviceLimit;
        }
        if (status) user.subscriptionStatus = status;
        if (expiresAt) user.planExpiresAt = new Date(expiresAt);
        if (resetDevices) user.activeDevices = [];
        
        user.planActivatedAt = Date.now();

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get subscription analytics
 * @route   GET /api/v1/subscriptions/analytics
 * @access  Private/Admin
 */
exports.getSubscriptionAnalytics = async (req, res) => {
    try {
        const stats = await User.aggregate([
            { $match: { role: 'learner' } },
            {
                $group: {
                    _id: '$currentPlan',
                    count: { $sum: 1 },
                    active: { 
                        $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'active'] }, 1, 0] } 
                    }
                }
            }
        ]);

        // Calculate estimated MRR (Monthly Recurring Revenue)
        const revenueMap = {
            'core_node': 399,
            'neural_advanced': 999,
            'enterprise_lattice': 5000 // Average custom estimate
        };

        const analytics = stats.map(s => ({
            ...s,
            estimatedRevenue: (s.active || 0) * (revenueMap[s._id] || 0)
        }));

        res.status(200).json({
            success: true,
            data: analytics,
            totalEstimatedMRR: analytics.reduce((acc, curr) => acc + curr.estimatedRevenue, 0)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
