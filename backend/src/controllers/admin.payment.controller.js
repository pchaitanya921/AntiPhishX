const Invoice = require('../models/Invoice');
const User = require('../models/User');

/**
 * @desc    Get Payment Analytics for Admin
 * @route   GET /api/admin/payments/analytics
 * @access  Private/Admin
 */
exports.getPaymentAnalytics = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalPaidInvoices = await Invoice.countDocuments({ status: 'paid' });
        const revenueResult = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 2. Active Subscriptions count
        const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active' });

        // 3. Failed Payments count
        const failedPayments = await Invoice.countDocuments({ status: 'failed' });

        // 4. Monthly Recurring Revenue (MRR) - Rough estimate from this month's paid invoices
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const mrrResult = await Invoice.aggregate([
            { $match: { status: 'paid', paidAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const mrr = mrrResult.length > 0 ? mrrResult[0].total : 0;

        // 5. Success Rate
        const totalAttempts = await Invoice.countDocuments();
        const successRate = totalAttempts > 0 ? Math.round((totalPaidInvoices / totalAttempts) * 100) : 0;

        // 6. Revenue Timeline (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const timeline = await Invoice.aggregate([
            { $match: { status: 'paid', paidAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                    amount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 7. Plan Distribution
        const planDist = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: '$planId', value: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                activeSubscriptions,
                failedPayments,
                mrr,
                successRate,
                timeline,
                planDist: planDist.map(p => ({ name: p._id.replace('_', ' ').toUpperCase(), value: p.value }))
            }
        });
    } catch (error) {
        console.error('Payment Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve payment intelligence' });
    }
};

/**
 * @desc    Get Recent Transactions
 * @route   GET /api/admin/payments/recent
 * @access  Private/Admin
 */
exports.getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Invoice.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Recent Transactions Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transaction log' });
    }
};
