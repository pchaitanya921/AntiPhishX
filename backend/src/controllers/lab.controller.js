const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const UserProgress = require('../models/UserProgress');
const LabSubmission = require('../models/LabSubmission');
const Enrollment = require('../models/Enrollment');
const { updateCourseProgress } = require('../utils/courseCompletion');

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

        // Pagination result
        const pagination = {};

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
            count: labs.length,
            pagination,
            data: labs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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

        res.status(200).json({
            success: true,
            data: lab
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
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

        const { answer, timeSpent } = req.body;

        // precise matching for now, can be regex or loose later
        const isCorrect = lab.correctAnswer.toLowerCase() === answer.toLowerCase();

        // Calculate score
        // Base points if correct.
        // Identify penalties? (Not implemented in frontend details yet, assuming max for now)
        const score = isCorrect ? lab.points : 0;
        const completed = isCorrect;

        // Create or update progress (UserProgress = Summary)
        let progress = await UserProgress.findOne({
            user: req.user.id,
            lab: req.params.id
        });

        // NEW: Create detailed submission record
        await LabSubmission.create({
            user: req.user.id,
            lab: req.params.id,
            answer,
            isCorrect,
            score: isCorrect ? score : 0,
            timeSpent,
            hintsUsed: req.body.hintsUsed || 0
        });

        if (progress) {
            progress.attempts += 1;
            progress.lastAttemptAt = Date.now();

            // Only update best score/time if this attempt is successful/better
            if (isCorrect) {
                if (!progress.completed) {
                    progress.completed = true;
                    progress.score = score;
                    progress.timeSpent = timeSpent;
                } else if (score > progress.score) {
                    progress.score = score;
                }
            }

            // Always update timeSpent to accumulate? Or just track latest? 
            // Usually we want "time to solve". If solved, keep the solving time.
            if (!progress.completed) {
                progress.timeSpent = timeSpent; // Update time spent on failed attempts
            }

            await progress.save();
        } else {
            progress = await UserProgress.create({
                user: req.user.id,
                lab: req.params.id,
                topic: lab.topic,
                level: lab.level,
                completed,
                score,
                timeSpent,
                attempts: 1
            });
        }

        // Trigger course progress update if the lab was completed
        if (completed) {
            // Find all courses that contain this lab
            const courses = await Enrollment.find({ user: req.user.id }).populate('course');
            for (const enrollment of courses) {
                if (!enrollment.course) continue;

                const hasLab = enrollment.course.modules.some(m =>
                    m.labs.some(lId => lId.toString() === lab._id.toString())
                );

                if (hasLab) {
                    await updateCourseProgress(req.user.id, enrollment.course._id);
                }
            }
        }

        res.status(200).json({
            success: true,
            correct: isCorrect,
            explanation: lab.explanation,
            score: isCorrect ? score : 0,
            pointsEarned: isCorrect ? score : 0,
            data: progress
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
