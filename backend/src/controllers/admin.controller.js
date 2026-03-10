const User = require('../models/User');
const Lab = require('../models/Lab');
const SecurityLog = require('../models/SecurityLog');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLabs = await Lab.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments(); // Actual course enrollments
        const totalCertificates = await Certificate.countDocuments();
        const totalCourses = await Course.countDocuments();

        // Get Recent Activity (from SecurityLog)
        const recentActivity = await SecurityLog.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('user', 'firstName lastName email');

        // Transform activity to match frontend expectations
        const formattedActivity = recentActivity.map(item => ({
            _id: item._id,
            action: item.action.replace('_', ' '), // "LOGIN SUCCESS"
            resource: item.resource || item.details?.reason || item.action,
            timestamp: item.timestamp,
            userId: item.user,
            severity: item.severity
        }));

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalCourses,
                    totalLabs,
                    totalEnrollments,
                    totalCertificates
                },
                recentActivity: formattedActivity
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

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from filtering
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Parsing query string back to JSON
        let queryObj = JSON.parse(queryStr);

        // Handle Search (Name or Email)
        if (req.query.search) {
            const searchTerm = req.query.search;
            queryObj.$or = [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Finding resource
        query = User.find(queryObj);

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
        const limit = parseInt(req.query.limit, 10) || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await User.countDocuments(queryObj);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const users = await query;

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
            count: users.length,
            pagination,
            total,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get Platform Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getPlatformAnalytics = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLabs = await Lab.countDocuments();
        const totalEnrollments = await UserProgress.countDocuments();
        const totalCertificates = await Certificate.countDocuments();

        // Chart Data: Users by Role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Chart Data: Topics by Category (Labs distribution)
        const topicsByCategory = await Lab.aggregate([
            { $group: { _id: '$topic', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                platformStats: {
                    activeUsers: await User.countDocuments({ active: true }),
                    totalUsers,
                    totalCourses: totalLabs,
                    totalEnrollments,
                    totalCertificates,
                    averageEnrollmentsPerCourse: totalLabs > 0 ? (totalEnrollments / totalLabs) : 0
                },
                usersByRole,
                topicsByCategory,
                traffic: await getTrafficStats()
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

// @desc    Get Security Logs
// @route   GET /api/admin/security/logs
// @access  Private/Admin
exports.getSecurityLogs = async (req, res, next) => {
    const logs = await SecurityLog.find(req.query)
        .populate('user', 'firstName lastName email')
        .sort({ timestamp: -1 })
        .limit(100);

    // Map `user` field to `userId` to match frontend expectation
    const formattedLogs = logs.map(log => ({
        ...log.toObject(),
        userId: log.user // Frontend expects `userId` object, populating it here
    }));

    res.status(200).json({
        success: true,
        data: formattedLogs
    });
};


// Helper to get Traffic Stats (Last 7 Days Logins)
const getTrafficStats = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const traffic = await SecurityLog.aggregate([
        {
            $match: {
                action: 'LOGIN_SUCCESS',
                timestamp: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: "$timestamp" },
                count: { $sum: 1 }
            }
        }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fill in missing days with 0
    const fullTraffic = days.map((day, index) => {
        const found = traffic.find(t => t._id === index + 1); // MongoDB dayOfWeek is 1-based (1=Sun)
        return {
            name: day,
            visits: found ? found.count : 0
        };
    });

    return fullTraffic;

};

// @desc    Get All Courses (Admin)
// @route   GET /api/admin/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res, next) => {
    try {
        let queryObj = {};

        // Filter by Published status
        if (req.query.published !== undefined) {
            queryObj.published = req.query.published === 'true';
        }

        // Search
        if (req.query.search) {
            const searchTerm = req.query.search;
            queryObj.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const courses = await Course.find(queryObj).sort('-createdAt');

        res.status(200).json({
            success: true,
            courses: courses
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Course By ID (Admin)
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'firstName lastName email')
            .populate({
                path: 'modules.labs',
                select: 'title type duration difficulty topic' // Populate lab details
            });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create Course
// @route   POST /api/admin/courses
// @access  Private/Admin
exports.createCourse = async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update Course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        await course.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update User
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

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

