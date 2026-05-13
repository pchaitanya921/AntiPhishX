const User = require('../models/User');
const PhishingCampaign = require('../models/PhishingCampaign');
const AuditLog = require('../models/AuditLog');
const Invoice = require('../models/Invoice');
const UserProgress = require('../models/UserProgress');
const QuizSubmission = require('../models/QuizSubmission');
const Organization = require('../models/Organization');
const Certificate = require('../models/Certificate');
const mongoose = require('mongoose');

class AnalyticsService {
    /**
     * Get Organizational Risk Heatmap (Dept vs Behavioral Dim)
     */
    async getRiskHeatmap(organizationId) {
        const query = organizationId ? { organization: new mongoose.Types.ObjectId(organizationId), active: true } : { active: true };
        return await User.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$department",
                    avgUrgency: { $avg: "$behavioralProfile.urgencySusceptibility" },
                    avgAuthority: { $avg: "$behavioralProfile.authoritySusceptibility" },
                    avgReward: { $avg: "$behavioralProfile.rewardSusceptibility" },
                    avgCuriosity: { $avg: "$behavioralProfile.curiositySusceptibility" },
                    avgFear: { $avg: "$behavioralProfile.fearSusceptibility" },
                    avgRiskScore: { $avg: "$behavioralProfile.riskScore" },
                    userCount: { $sum: 1 }
                }
            },
            { $sort: { avgRiskScore: -1 } }
        ]);
    }

    /**
     * Get Department Drill-down for Advanced Heatmap
     */
    async getDepartmentDrilldown(organizationId, departmentName) {
        const query = organizationId ? { organization: new mongoose.Types.ObjectId(organizationId), department: departmentName, active: true } : { department: departmentName, active: true };
        
        const users = await User.find(query).select('firstName lastName email behavioralProfile');
        
        return users.map(user => ({
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            urgency: user.behavioralProfile?.urgencySusceptibility || 50,
            authority: user.behavioralProfile?.authoritySusceptibility || 50,
            reward: user.behavioralProfile?.rewardSusceptibility || 50,
            curiosity: user.behavioralProfile?.curiositySusceptibility || 50,
            fear: user.behavioralProfile?.fearSusceptibility || 50,
            riskScore: user.behavioralProfile?.riskScore || 50,
            failureVelocity: user.behavioralProfile?.failureVelocity || 0
        })).sort((a, b) => b.riskScore - a.riskScore);
    }

    /**
     * Get Executive KPIs for Board-Level reporting
     */
    async getExecutiveKPIs(organizationId) {
        const query = organizationId ? { organization: organizationId } : {};
        const campaigns = await PhishingCampaign.find(query);
        
        const sorted = campaigns.sort((a, b) => a.createdAt - b.createdAt);
        const initialRate = this.calculateAvgClickRate(sorted.slice(0, 3));
        const currentRate = this.calculateAvgClickRate(sorted.slice(-3));
        
        const riskReduction = initialRate > 0 
            ? ((initialRate - currentRate) / initialRate) * 100 
            : 0;

        const totalReported = campaigns.reduce((acc, c) => acc + (c.metrics?.reported || 0), 0);
        const totalSent = campaigns.reduce((acc, c) => acc + (c.metrics?.emailsSent || 0), 0);
        const reportingRate = totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0;

        const resilienceScore = await this.calculateResilienceScore(organizationId);

        return {
            overallResilienceScore: resilienceScore,
            phishingFailureReduction: Math.round(riskReduction),
            reportingRateImprovement: reportingRate,
            activeCampaigns: campaigns.filter(c => c.status === 'active').length,
            totalSimulationsSent: totalSent
        };
    }

    /**
     * Get Subscription and Revenue Analytics
     */
    async getSubscriptionAnalytics(organizationId) {
        const query = organizationId ? { organization: organizationId } : {};
        
        const [planDistribution, totalRevenue, growth] = await Promise.all([
            User.aggregate([
                { $match: query },
                { $group: { _id: "$currentPlan", count: { $sum: 1 } } }
            ]),
            Invoice.aggregate([
                { $match: { ...query, status: 'paid' } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            User.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ])
        ]);

        return {
            planDistribution,
            totalRevenue: (totalRevenue[0]?.total || 0) / 100, // Amount is usually in cents/paise
            userGrowth: growth,
            subscriptionStatus: await User.countDocuments({ ...query, subscriptionStatus: 'active' }),
            deviceUsage: await User.aggregate([
                { $match: query },
                { $project: { deviceCount: { $size: { $ifNull: ["$activeDevices", []] } } } },
                { $group: { _id: null, total: { $sum: "$deviceCount" } } }
            ]).then(res => res[0]?.total || 0)
        };
    }

    /**
     * Get Real-time Activity Feed
     */
    async getRealTimeActivity(organizationId) {
        const query = organizationId ? { organization: organizationId } : {};
        return await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'firstName lastName email avatar');
    }

    /**
     * Get Detailed Training Metrics
     */
    async getTrainingMetrics(organizationId) {
        const query = organizationId ? { organization: organizationId } : {};
        const usersInOrg = await User.find(query).select('_id');
        const userIds = usersInOrg.map(u => u._id);

        const [labStats, quizStats, certCount] = await Promise.all([
            UserProgress.aggregate([
                { $match: { user: { $in: userIds } } },
                {
                    $group: {
                        _id: "$topic",
                        completed: { $sum: { $cond: ["$completed", 1, 0] } },
                        avgScore: { $avg: "$score" },
                        totalTime: { $sum: "$timeSpent" }
                    }
                }
            ]),
            QuizSubmission.aggregate([
                { $match: { user: { $in: userIds } } },
                {
                    $group: {
                        _id: "$category",
                        passed: { $sum: { $cond: ["$passed", 1, 0] } },
                        avgScore: { $avg: "$percentage" }
                    }
                }
            ]),
            Certificate.countDocuments({ user: { $in: userIds } })
        ]);

        return {
            labStats,
            quizStats,
            totalCertificates: certCount
        };
    }

    /**
     * Predictive Risk Intelligence: Forecast high-risk groups
     */
    async getPredictiveRisk(organizationId) {
        const query = organizationId ? { organization: organizationId } : {};
        const highRiskTargets = await User.find({
            ...query,
            $or: [
                { "behavioralProfile.riskScore": { $gt: 70 } },
                { "behavioralProfile.failureVelocity": { $gt: 50 } }
            ]
        }).select('firstName lastName email department behavioralProfile')
          .limit(10);

        return {
            highRiskForecasting: highRiskTargets,
            vulnerabilityClusters: await this.identifyVulnerabilityClusters(organizationId)
        };
    }

    // Helper methods
    calculateAvgClickRate(campaigns) {
        if (!campaigns.length) return 0;
        const totalSent = campaigns.reduce((acc, c) => acc + (c.metrics?.emailsSent || 0), 0);
        const totalClicked = campaigns.reduce((acc, c) => acc + (c.metrics?.clickedCount || 0), 0);
        return totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    }

    async calculateResilienceScore(organizationId) {
        const query = organizationId ? { organization: new mongoose.Types.ObjectId(organizationId), active: true } : { active: true };
        const avgRisk = await User.aggregate([
            { $match: query },
            { $group: { _id: null, avg: { $avg: "$behavioralProfile.riskScore" } } }
        ]);
        // Inverse risk for resilience
        return avgRisk.length ? Math.round(100 - avgRisk[0].avg) : 100;
    }

    async identifyVulnerabilityClusters(organizationId) {
        const query = organizationId ? { organization: new mongoose.Types.ObjectId(organizationId) } : {};
        return await User.aggregate([
            { $match: query },
            {
                $project: {
                    department: 1,
                    maxSusceptibility: {
                        $max: [
                            "$behavioralProfile.urgencySusceptibility",
                            "$behavioralProfile.authoritySusceptibility",
                            "$behavioralProfile.rewardSusceptibility",
                            "$behavioralProfile.curiositySusceptibility",
                            "$behavioralProfile.fearSusceptibility"
                        ]
                    }
                }
            },
            { $match: { maxSusceptibility: { $gt: 70 } } },
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
    }
}

module.exports = new AnalyticsService();
