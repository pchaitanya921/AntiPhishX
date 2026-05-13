const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const UserProgress = require('../models/UserProgress');
const LabSubmission = require('../models/LabSubmission');
const LabSession = require('../models/LabSession');
const Enrollment = require('../models/Enrollment');
const UserBehavior = require('../models/UserBehavior');
const { updateCourseProgress } = require('../utils/courseCompletion');
const certificateService = require('../services/certificate.service');
const llmService = require('../services/llm.service');

// @desc    Get all labs
// @route   GET /api/labs
// @access  Private
exports.getLabs = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };
        console.log('[DEBUG] getLabs Query:', req.query);
        console.log('[DEBUG] User Role:', req.user ? req.user.role : 'Guest');

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Parsing the query string back to JSON
        let queryObj = JSON.parse(queryStr);

        // RBAC: If not admin, force status: 'published'
        // Defensive check: ensure req.user exists (it should via protect middleware)
        if (req.user && req.user.role !== 'admin') {
            queryObj.status = 'published';
        } else if (!req.user) {
            // Fallback for safety - if no user, only show published
            queryObj.status = 'published';
        }

        // Finding resource
        query = Lab.find(queryObj);

        // If admin/instructor, include the correct answer
        if (req.user && (req.user.role === 'admin' || req.user.role === 'instructor')) {
            query = query.select('+correctAnswer');
        }

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Lab.countDocuments(queryObj);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const labs = await query;

        // NEW: Add locked status based on unified access logic
        const { canAccessResource } = require('../config/plans');
        
        const labsWithAccess = labs.map(lab => {
            const labObj = lab.toObject();
            labObj.isLocked = !canAccessResource(req.user, lab.level, lab.topic);
            return labObj;
        });

        // Pagination result
        const pagination = {};
        
        // ... (rest of pagination)
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: labsWithAccess.length,
            pagination,
            data: labsWithAccess
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Get single lab
// @route   GET /api/labs/:id
// @access  Private
exports.getLab = async (req, res, next) => {
    try {
        let query = Lab.findById(req.params.id);

        // If admin/instructor, include the correct answer
        if (req.user && (req.user.role === 'admin' || req.user.role === 'instructor')) {
            query = query.select('+correctAnswer');
        }

        const lab = await query;

        if (!lab) {
            return res.status(404).json({
                success: false,
                message: `Lab not found with id of ${req.params.id}`
            });
        }

        // NEW: Enforce Plan Restriction for single lab access
        const { canAccessResource } = require('../config/plans');
        
        if (!canAccessResource(req.user, lab.level, lab.topic)) {
            return res.status(403).json({
                success: false,
                message: req.user?.subscriptionStatus === 'expired' 
                    ? 'Your subscription has expired. Please upgrade to unlock this lab.'
                    : `The ${lab.level.toUpperCase()} lab '${lab.title}' is locked. Please upgrade your plan to unlock.`,
                code: 'INSUFFICIENT_PLAN',
            });
        }

        // --- NEW: Inject Adaptive Difficulty ---
        const UserBehavior = require('../models/UserBehavior');
        const behavior = await UserBehavior.findOne({ user: req.user.id });
        const adaptiveDifficulty = behavior?.adaptiveDifficulty || 5;

        // Clone to plain object and inject adaptive parameters
        const labObj = lab.toObject();
        labObj.adaptiveParams = {
            difficulty: adaptiveDifficulty,
            timeMultiplier: adaptiveDifficulty > 7 ? 0.8 : (adaptiveDifficulty < 3 ? 1.5 : 1.0),
            hintsRestricted: adaptiveDifficulty > 8,
            dynamicComplexity: adaptiveDifficulty
        };

        res.status(200).json({
            success: true,
            data: labObj
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

/**
 * @desc    Get Next Recommended Lab (AI Smart Start)
 * @route   GET /api/labs/adaptive/next
 * @access  Private
 */
exports.getAdaptiveRecommendation = async (req, res) => {
    try {
        const orchestrationService = require('../services/orchestration.service');
        const lab = await orchestrationService.getNextRecommendedLab(req.user.id);
        
        if (!lab) {
            return res.status(404).json({
                success: false,
                message: 'No suitable adaptive modules found for your profile.'
            });
        }

        res.status(200).json({
            success: true,
            data: lab
        });
    } catch (err) {
        console.error('Adaptive Recommendation Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get Neural Training Roadmap
 * @route   GET /api/labs/adaptive/roadmap
 * @access  Private
 */
exports.getNeuralRoadmap = async (req, res) => {
    try {
        const orchestrationService = require('../services/orchestration.service');
        const roadmap = await orchestrationService.getNeuralRoadmap(req.user.id);
        
        res.status(200).json({
            success: true,
            data: roadmap
        });
    } catch (err) {
        console.error('Neural Roadmap Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Submit lab results
// @route   POST /api/labs/:id/submit
// @access  Private
exports.submitLab = async (req, res, next) => {
    try {
        // Find lab including the hidden correctAnswer field
        const lab = await Lab.findById(req.params.id).select('+correctAnswer');

        if (!lab) {
            return res.status(404).json({
                success: false,
                message: `Lab not found with id of ${req.params.id}`
            });
        }

        // NEW: Enforce Plan Restriction for submission
        const { canAccessResource } = require('../config/plans');
        if (!canAccessResource(req.user, lab.level, lab.topic)) {
            return res.status(403).json({
                success: false,
                message: 'Subscription plan insufficient for this intelligence module.',
                code: 'INSUFFICIENT_PLAN'
            });
        }

        const { answer, timeSpent, telemetry } = req.body;
        const userId = req.user?.id || req.user?._id;
        console.log(`[SUBMIT] Data: lab=${req.params.id}, user=${userId}, answer=${answer}, timeSpent=${timeSpent}`);

        // Perform Intelligent AI Evaluation
        console.log('[SUBMIT] Initiating Tactical AI Evaluation...');
        const evaluation = await llmService.evaluateLabSubmission(lab, answer, telemetry);
        
        const isCorrect = evaluation.isCorrect;
        const aiScore = evaluation.score; // 0 to 100
        const explanation = evaluation.explanation;

        console.log(`[SUBMIT] AI Result: isCorrect=${isCorrect}, score=${aiScore}, explanation=${explanation.substring(0, 50)}...`);

        // Calculate final platform score based on AI judgment
        const score = isCorrect ? Math.round((aiScore / 100) * lab.points) : 0;
        const completed = isCorrect;

        // NEW: Create detailed submission record
        console.log('[SUBMIT] Creating submission record...');
        await LabSubmission.create({
            user: userId,
            lab: req.params.id,
            answer,
            isCorrect,
            score,
            timeSpent: timeSpent || 0,
            hintsUsed: req.body.hintsUsed || 0,
            aiExplanation: explanation,
            telemetry: telemetry || {}
        });
        console.log('[SUBMIT] Submission record created successfully');

        // NEW: Calculate stars (1-3) based on performance
        let stars = 0;
        if (completed) {
            stars = 3;
            if (req.body.hintsUsed > 0) stars--;
            if (timeSpent > lab.timeLimit / 2) stars--;
            if (stars < 1) stars = 1;
        }

        // Atomic update for UserProgress
        console.log('[SUBMIT] Syncing user progress and telemetry...');
        const existingProgress = await UserProgress.findOne({ user: userId, lab: req.params.id });
        
        const behaviorUpdate = {
            $set: {
                topic: lab.topic,
                level: lab.level,
                completed: existingProgress?.completed || completed,
                score: Math.max(existingProgress?.score || 0, isCorrect ? score : 0),
                stars: Math.max(existingProgress?.stars || 0, stars),
                lastAttemptAt: Date.now(),
                telemetry: req.body.telemetry || {}
            },
            $inc: { attempts: 1 }
        };

        // Only add timeSpent if not already completed or if we want to accumulate (depending on req)
        if (!existingProgress?.completed) {
            behaviorUpdate.$inc.timeSpent = timeSpent;
        }

        const updatedProgress = await UserProgress.findOneAndUpdate(
            { user: userId, lab: req.params.id },
            behaviorUpdate,
            { upsert: true, new: true }
        );

        // --- NEW: Process AI Behavioral Telemetry ---
        try {
            const telemetryService = require('../services/telemetry.service');
            await telemetryService.processSimulationTelemetry(userId, {
                ...req.body.telemetry,
                timeSpent: timeSpent,
                success: completed
            });
        } catch (telemetryErr) {
            console.error('[AI_ERROR] Telemetry extraction failed:', telemetryErr);
        }
        // ---------------------------------------------

        if (completed && !existingProgress?.completedAt) {
            behaviorUpdate.$set.completedAt = Date.now();
        }

        const progress = await UserProgress.findOneAndUpdate(
            { user: userId, lab: req.params.id },
            behaviorUpdate,
            { upsert: true, new: true }
        );
        console.log('[SUBMIT] Telemetry synchronized');

        // NEW: Process HRI profile update via RiskService
        const riskService = require('../services/risk.service');
        await riskService.processLabSubmission(userId, lab, {
            isCorrect,
            timeSpent: timeSpent || 0,
            telemetry: req.body.telemetry || {}
        });

        // 🔔 Notify User
        const notificationService = require('../services/notification.service');
        if (isCorrect) {
            await notificationService.trainingAlert(
                userId,
                'Lab Completed Successfully',
                `You've successfully neutralized the ${lab.title} threat with a score of ${score}%.`,
                `/dashboard/labs`
            );
        } else {
            await notificationService.securityAlert(
                userId,
                'Security Gap Detected',
                `You were susceptible to the ${lab.title} simulation. Review the cognitive analysis to harden your defense.`,
                `/dashboard/labs`
            );
        }

        // Trigger course progress update if the lab was completed
        if (completed) {
            const courses = await Enrollment.find({ user: userId }).populate('course');
            for (const enrollment of courses) {
                if (!enrollment?.course) continue;
                const hasLab = enrollment.course?.modules?.some(m =>
                    m.labs?.some(lId => lId?.toString() === lab._id.toString())
                );
                if (hasLab) {
                    await updateCourseProgress(userId, enrollment.course._id);
                }
            }
            // Auto-check and issue certificate if eligible
            try {
                const certService = require('../services/certificate.service');
                await certService.issueCertificate(userId, lab.topic, lab.level);
            } catch (e) {
                // Not yet eligible or already issued, continue
            }
        }

        res.status(200).json({
            success: true,
            correct: isCorrect,
            explanation: explanation || lab.explanation,
            score: isCorrect ? score : 0,
            pointsEarned: isCorrect ? score : 0,
            data: progress
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Create Lab (Admin only)
// @route   POST /api/labs
// @access  Private/Admin
exports.createLab = async (req, res, next) => {
    try {
        const lab = await Lab.create(req.body);

        res.status(201).json({
            success: true,
            data: lab
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Update Lab (Admin only)
// @route   PUT /api/labs/:id
// @access  Private/Admin
exports.updateLab = async (req, res, next) => {
    try {
        let lab = await Lab.findById(req.params.id);

        if (!lab) {
            return res.status(404).json({
                success: false,
                message: `Lab not found with id of ${req.params.id}`
            });
        }

        lab = await Lab.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: lab
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Delete Lab (Admin only)
// @route   DELETE /api/labs/:id
// @access  Private/Admin
exports.deleteLab = async (req, res, next) => {
    try {
        const lab = await Lab.findById(req.params.id);

        if (!lab) {
            return res.status(404).json({
                success: false,
                message: `Lab not found with id of ${req.params.id}`
            });
        }

        await lab.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Get Lab Analytics (Admin/Instructor)
// @route   GET /api/labs/:id/analytics
// @access  Private (Admin/Instructor)
exports.getLabAnalytics = async (req, res, next) => {
    try {
        const labId = req.params.id;

        // 1. Total Attempts
        const totalAttempts = await LabSubmission.countDocuments({ lab: labId });

        // 2. Pass/Fail Ratio
        const passedAttempts = await LabSubmission.countDocuments({ lab: labId, isCorrect: true });
        const passRate = totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : 0;

        // 3. Average Time & Hint Usage
        const stats = await LabSubmission.aggregate([
            { $match: { lab: new mongoose.Types.ObjectId(labId) } },
            {
                $group: {
                    _id: '$lab',
                    avgTime: { $avg: '$timeSpent' },
                    avgHints: { $avg: '$hintsUsed' }
                }
            }
        ]);

        const avgTime = stats.length > 0 ? Math.round(stats[0].avgTime) : 0;
        const avgHints = stats.length > 0 ? stats[0].avgHints.toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalAttempts,
                passedAttempts,
                failedAttempts: totalAttempts - passedAttempts,
                passRate,
                avgTime,
                avgHints
            }
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Get Lab Submissions (Admin/Instructor)
// @route   GET /api/labs/:id/submissions
// @access  Private (Admin/Instructor)
exports.getLabSubmissions = async (req, res, next) => {
    try {
        const submissions = await LabSubmission.find({ lab: req.params.id })
            .populate('user', 'name email')
            .sort('-submittedAt')
            .limit(100); // hard limit for now

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({
            success: false,
            message: 'Internal System Exception: Intelligence synchronization failed.'
        });
    }
};

// @desc    Start multi-stage lab session
// @route   POST /api/labs/:id/session
// @access  Private
exports.startSession = async (req, res, next) => {
    try {
        const lab = await Lab.findById(req.params.id);
        if (!lab || !lab.isMultiStage) {
            return res.status(400).json({ success: false, message: 'Invalid multi-stage lab' });
        }

        // Check if session exists
        let session = await LabSession.findOne({ user: req.user.id, lab: lab._id, status: 'in_progress' });
        
        if (!session) {
            session = await LabSession.create({
                user: req.user.id,
                lab: lab._id,
                currentStageId: lab.stages[0]?.stageId || 'stage_1'
            });
        }

        // Return current stage data without exposing consequences/points of all options
        const stage = lab.stages.find(s => s.stageId === session.currentStageId);

        res.status(200).json({
            success: true,
            data: {
                sessionId: session._id,
                currentStageId: session.currentStageId,
                stageData: stage
            }
        });
    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({ success: false, message: 'Internal System Exception: Intelligence synchronization failed.' });
    }
};

// @desc    Submit option for current stage
// @route   POST /api/labs/:id/session/submit
// @access  Private
exports.submitStage = async (req, res, next) => {
    try {
        const { optionIndex } = req.body;
        const lab = await Lab.findById(req.params.id);
        const session = await LabSession.findOne({ user: req.user.id, lab: req.params.id, status: 'in_progress' });

        if (!session || !lab) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        const currentStage = lab.stages.find(s => s.stageId === session.currentStageId);
        const selectedOption = currentStage.options[optionIndex];

        if (!selectedOption) {
            return res.status(400).json({ success: false, message: 'Invalid option' });
        }

        session.totalScore += (selectedOption.outcomePoints || 0);
        session.history.push({
            stageId: session.currentStageId,
            actionTaken: selectedOption.text,
            pointsChange: selectedOption.outcomePoints || 0,
            consequenceTriggered: selectedOption.triggerConsequence || false
        });

        let consequence = null;
        if (selectedOption.triggerConsequence) {
            consequence = lab.consequences.find(c => c.stageId === session.currentStageId);
        }

        if (selectedOption.nextStageId === 'end' || !selectedOption.nextStageId) {
            session.status = 'completed';
            session.completedAt = Date.now();
        } else {
            session.currentStageId = selectedOption.nextStageId;
        }

        await session.save();

        res.status(200).json({
            success: true,
            data: {
                sessionState: session.status,
                nextStageId: session.currentStageId,
                consequence,
                pointsChange: selectedOption.outcomePoints || 0
            }
        });

    } catch (err) {
        console.error('[CRITICAL]', err.stack);
        res.status(500).json({ success: false, message: 'Internal System Exception: Intelligence synchronization failed.' });
    }
};

// Sync Diagnostic Heartbeat
console.log('[HEARTBEAT] Lab Controller Loaded');
