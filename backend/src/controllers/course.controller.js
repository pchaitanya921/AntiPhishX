const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ published: true })
            .populate('instructor', 'firstName lastName')
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

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course not found with id of ${req.params.id}`
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user.id,
            course: req.params.id
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'User is already enrolled in this course'
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: req.params.id
        });

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id })
            .populate({
                path: 'course',
                select: 'title description thumbnail level duration instructor',
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName'
                }
            });

        // structure data to look like course objects with enrollment info added
        const courses = enrollments.map(enrollment => {
            const courseObj = enrollment.course.toObject();
            return {
                ...courseObj,
                enrollmentStatus: enrollment.status,
                enrollmentDate: enrollment.enrolledAt,
                progress: enrollment.progress
            };
        });

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
