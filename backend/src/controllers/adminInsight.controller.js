const AdminInsight = require('../models/AdminInsight');
const mongoose = require('mongoose');

/**
 * Log an admin interaction with an AI insight
 */
exports.logInsightInteraction = async (req, res) => {
    try {
        const { insightType, targetDepartment, targetUser, actionTaken, metadata } = req.body;
        const organizationId = req.user.organization?._id || req.user.organization;

        if (!organizationId) {
            return res.status(400).json({ success: false, message: 'Admin must belong to an organization' });
        }

        const insight = await AdminInsight.create({
            admin: req.user.id,
            organization: organizationId,
            insightType,
            targetDepartment,
            targetUser,
            actionTaken,
            metadata
        });

        res.status(201).json({ success: true, data: insight });
    } catch (err) {
        console.error('[AdminInsight] Error logging interaction:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Get aggregated engagement metrics for AI insights
 */
exports.getEngagementMetrics = async (req, res) => {
    try {
        const organizationId = req.user.role === 'superAdmin' ? null : (req.user.organization?._id || req.user.organization);
        
        const match = organizationId ? { organization: new mongoose.Types.ObjectId(organizationId) } : {};

        const [totalInteractions, typeBreakdown, actionOverTime] = await Promise.all([
            AdminInsight.countDocuments(match),
            AdminInsight.aggregate([
                { $match: match },
                { $group: { _id: "$insightType", count: { $sum: 1 } } }
            ]),
            AdminInsight.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } },
                { $limit: 30 }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalInteractions,
                typeBreakdown,
                actionOverTime
            }
        });
    } catch (err) {
        console.error('[AdminInsight] Error getting metrics:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
