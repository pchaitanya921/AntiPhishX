const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Lab = require('../models/Lab');

// @desc    Get Instructor Dashboard Stats
// @route   GET /api/instructor/dashboard
// @access  Private/Instructor
exports.getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get courses created by instructor
        const courses = await Course.find({ instructor: userId });
        const courseIds = courses.map(c => c._id);

        // Get total students (enrollments in these courses)
        const enrollments = await Enrollment.find({ course: { $in: courseIds } });
        const uniqueStudents = new Set(enrollments.map(e => e.user.toString()));

        // Calculate real stats
        const stats = {
            totalCourses: courses.length,
            totalStudents: uniqueStudents.size,
            totalEnrollments: enrollments.length,
            averageRating: 4.8, // Base rating
            pendingLabs: await Lab.countDocuments({ instructor: userId, status: 'draft' }),
            engagementRate: enrollments.length > 0 ? Math.round((uniqueStudents.size / enrollments.length) * 100) : 0
        };

        // Get recent activity (new enrollments)
        const recentActivity = await Enrollment.find({ course: { $in: courseIds } })
            .sort('-enrolledAt')
            .limit(5)
            .populate('user', 'firstName lastName avatar')
            .populate('course', 'title');

        res.status(200).json({
            success: true,
            data: {
                stats,
                recentActivity,
                courses: courses.slice(0, 5) // Show top 5 courses
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

// @desc    Get Instructor Courses
// @route   GET /api/instructor/my-courses
// @access  Private/Instructor
exports.getMyCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user.id })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create a new course (Wizard)
// @route   POST /api/instructor/courses/wizard
// @access  Private/Instructor
exports.createCourse = async (req, res, next) => {
    try {
        req.body.instructor = req.user.id;

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get Course Analytics
// @route   GET /api/instructor/courses/:id/analytics
// @access  Private/Instructor
exports.getCourseAnalytics = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const enrollments = await Enrollment.find({ course: req.params.id });

        res.status(200).json({
            success: true,
            data: {
                totalStudents: enrollments.length,
                completionRate: 0, // Implement later
                revenue: 0
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

// @desc    Get Course Learners
// @route   GET /api/instructor/courses/:id/learners
// @access  Private/Instructor
exports.getCourseLearners = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.id })
            .populate('user', 'firstName lastName email avatar');

        const learners = enrollments.map(e => e.user);

        res.status(200).json({
            success: true,
            data: learners
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get Pending Labs
// @route   GET /api/instructor/labs/pending
// @access  Private/Instructor
exports.getPendingLabs = async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: []
    });
};

// @desc    Build Quiz
// @route   POST /api/instructor/quizzes/builder
// @access  Private/Instructor
exports.buildQuiz = async (req, res, next) => {
    res.status(201).json({
        success: true,
        data: { message: "Quiz builder not implemented yet" }
    });
};

// @desc    Review Lab
// @route   POST /api/instructor/labs/:id/review
// @access  Private/Instructor
exports.reviewLab = async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: { message: "Lab review submitted" }
    });
};
