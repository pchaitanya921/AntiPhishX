const UserProgress = require('../models/UserProgress');
const Lab = require('../models/Lab');
const AuditLog = require('../models/AuditLog');
const QuizSubmission = require('../models/QuizSubmission');
const analyticsService = require('../services/analytics.service');

// @desc    Get User Analytics
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const progress = await UserProgress.find({ user: userId });
        const quizSubmissions = await QuizSubmission.find({ user: userId });

        const completedLabs = progress.filter(p => p.completed).length;
        const totalLabAttempts = progress.reduce((acc, curr) => acc + (curr.attempts || 0), 0);

        const passedQuizzes = quizSubmissions.filter(q => q.passed).length;
        const totalQuizAttempts = quizSubmissions.length;

        // Calculate pass rates
        const labPassRate = progress.length > 0 ? Math.round((completedLabs / progress.length) * 100) : 0;
        const quizPassRate = totalQuizAttempts > 0 ? Math.round((passedQuizzes / totalQuizAttempts) * 100) : 0;

        // Calculate real overall progress based on live lab count
        const totalLabs = await Lab.countDocuments({ status: 'published' });
        const overallProgress = totalLabs > 0 ? Math.round((completedLabs / totalLabs) * 100) : 0;

        // Calculate real quiz history (last 7 completed sessions)
        const quizHistory = quizSubmissions
            .sort((a, b) => b.submittedAt - a.submittedAt)
            .slice(0, 7)
            .map(q => q.percentage)
            .reverse();

        // Combined activity (Labs + Quizzes)
        const combinedActivity = [
            ...progress.map(p => ({
                _id: p._id,
                action: 'LAB_COMPLETED',
                topic: p.topic,
                level: p.level,
                score: p.score,
                completed: p.completed,
                timestamp: p.lastAttemptAt
            })),
            ...quizSubmissions.map(q => ({
                _id: q._id,
                action: 'QUIZ_COMPLETED',
                topic: q.category || 'General',
                level: q.difficulty || 'Beginner',
                score: q.score,
                completed: q.passed,
                timestamp: q.submittedAt
            }))
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                quizPassRate,
                labPassRate,
                quizAttempts: totalQuizAttempts,
                labAttempts: totalLabAttempts,
                overallProgress,
                recentActivity: combinedActivity,
                quizHistory: quizHistory.length > 0 ? quizHistory : [0, 0, 0, 0, 0, 0, 0]
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

// @desc    Get Organization Analytics
// @route   GET /api/analytics/organization
// @access  Private (Admin only)
exports.getOrganizationAnalytics = async (req, res, next) => {
    try {
        if (!req.user.organization) {
            return res.status(400).json({ success: false, message: 'User does not belong to an organization' });
        }

        const orgId = req.user.organization._id;

        // Find all users in this organization
        const User = require('../models/User');
        const users = await User.find({ organization: orgId });
        const userIds = users.map(u => u._id);

        // Aggregate UserProgress for these users
        const progress = await UserProgress.find({ user: { $in: userIds } });
        
        const completedLabs = progress.filter(p => p.completed).length;
        const totalAttempts = progress.reduce((acc, curr) => acc + (curr.attempts || 0), 0);
        const passRate = progress.length > 0 ? Math.round((completedLabs / progress.length) * 100) : 0;
        
        // Mock algorithmic risk score (inverse of pass rate + some base risk)
        const riskScore = Math.max(0, 100 - passRate);

        // Calculate departmental breakdown
        const departmentVulnerability = {};
        users.forEach(u => {
            const dep = u.department || 'Other';
            if (!departmentVulnerability[dep]) departmentVulnerability[dep] = { total: 0, failed: 0 };
            
            departmentVulnerability[dep].total += 1;
            
            // Mock fail condition for now: if a user hasn't completed any labs, they are considered "vulnerable"
            const userCompleted = progress.some(p => p.user.toString() === u._id.toString() && p.completed);
            if (!userCompleted) {
                departmentVulnerability[dep].failed += 1;
            }
        });

        const formattedDepVulnerability = Object.keys(departmentVulnerability).map(dep => ({
            department: dep,
            averageRiskScore: departmentVulnerability[dep].total > 0 
                ? Math.round((departmentVulnerability[dep].failed / departmentVulnerability[dep].total) * 100)
                : 0,
            averageAccuracy: passRate // Simplified for MVP
        }));

        // Calculate real average response time from telemetry
        const avgResponseTime = progress.length > 0 
            ? Math.round(progress.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0) / progress.length)
            : 0;

        // Aggregate real top vulnerabilities from AuditLogs
        const vulnerabilityStats = await AuditLog.aggregate([
            { $match: { organization: orgId, eventType: 'PHISHING_CLICKED' } },
            { $group: { _id: "$details.templateType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const topVulnerabilities = vulnerabilityStats.map(v => ({
            type: v._id || 'Unknown_Vector',
            count: v.count
        }));

        res.status(200).json({
            success: true,
            data: {
                platformStats: {
                    averageRiskScore: riskScore,
                    averageAccuracy: passRate,
                    averageResponseTime: avgResponseTime,
                    totalLearners: users.length
                },
                departmentData: formattedDepVulnerability,
                topVulnerabilities: topVulnerabilities.length > 0 ? topVulnerabilities : [
                    { type: 'No_Simulations_Run', count: 0 }
                ]
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

// @desc    Get CISO Executive Dashboard Summary
// @route   GET /api/analytics/executive-summary
// @access  Private (Admin)
exports.getExecutiveSummary = async (req, res) => {
    try {
        const organizationId = req.user.organization?._id || req.user.organization;
        
        const [kpis, heatmap, predictive] = await Promise.all([
            analyticsService.getExecutiveKPIs(organizationId),
            analyticsService.getRiskHeatmap(organizationId),
            analyticsService.getPredictiveRisk(organizationId)
        ]);

        res.status(200).json({
            success: true,
            data: {
                kpis,
                heatmap,
                predictive
            }
        });
    } catch (err) {
        console.error('Executive Summary Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Detailed Risk Heatmap
// @route   GET /api/analytics/heatmap
// @access  Private (Admin)
exports.getDetailedHeatmap = async (req, res) => {
    try {
        const organizationId = req.user.organization?._id || req.user.organization;
        const heatmap = await analyticsService.getRiskHeatmap(organizationId);
        res.status(200).json({ success: true, data: heatmap });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Department Drill-down for Heatmap
// @route   GET /api/analytics/heatmap/department/:department
// @access  Private (Admin)
exports.getDepartmentDrilldown = async (req, res) => {
    try {
        const organizationId = req.user.organization?._id || req.user.organization;
        const { department } = req.params;
        
        const drilldown = await analyticsService.getDepartmentDrilldown(organizationId, department);
        
        res.status(200).json({ success: true, data: drilldown });
    } catch (err) {
        console.error('Department Drilldown Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Export Board-Level Report Data
// @route   GET /api/analytics/export-report
// @access  Private (Admin)
exports.exportReport = async (req, res) => {
    try {
        const organizationId = req.user.organization?._id || req.user.organization;
        const data = await analyticsService.getExecutiveKPIs(organizationId);
        res.status(200).json({
            success: true,
            reportName: `Risk_Posture_Report_${new Date().toISOString().split('T')[0]}`,
            data
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// @desc    Get Detailed Human Risk Intelligence (HRI) Profile
// @route   GET /api/analytics/hri
// @access  Private
exports.getHumanRiskIntelligence = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const hri = user.behavioralProfile || {
            urgencySusceptibility: 0,
            authoritySusceptibility: 0,
            rewardSusceptibility: 0,
            curiositySusceptibility: 0,
            fearSusceptibility: 0,
            socialPressureSusceptibility: 0,
            detectionSpeed: 0,
            neutralizationAccuracy: 0,
            failureVelocity: 0,
            riskScore: 50,
            domainExpertise: {
                executive_intelligence: 0,
                tactical_defense: 0,
                cognitive_security: 0,
                advanced_ai_adaptive: 0
            }
        };

        res.status(200).json({
            success: true,
            data: hri
        });
    } catch (err) {
        console.error('HRI Fetch Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get All Enterprise Analytics for Executive Dashboard
 * @route   GET /api/analytics/enterprise-executive
 * @access  Private (Admin/SuperAdmin)
 */
exports.getEnterpriseExecutiveSummary = async (req, res) => {
    try {
        const organizationId = req.user.role === 'superAdmin' ? null : (req.user.organization?._id || req.user.organization);
        
        const [kpis, heatmap, subscriptions, activity, training, predictive] = await Promise.all([
            analyticsService.getExecutiveKPIs(organizationId),
            analyticsService.getRiskHeatmap(organizationId),
            analyticsService.getSubscriptionAnalytics(organizationId),
            analyticsService.getRealTimeActivity(organizationId),
            analyticsService.getTrainingMetrics(organizationId),
            analyticsService.getPredictiveRisk(organizationId)
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: kpis,
                riskHeatmap: heatmap,
                growthAndRevenue: subscriptions,
                activityFeed: activity,
                trainingEfficiency: training,
                riskForecasting: predictive
            }
        });
    } catch (err) {
        console.error('Enterprise Executive Summary Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
