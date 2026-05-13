const express = require('express');
const {
    getDashboard,
    getUsers,
    getPlatformAnalytics,
    getSecurityLogs,
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    updateUser,
    deleteUser,
    getAllCertificates,
    getAllUserAchievements,
    getAllUserBadges
} = require('../controllers/admin.controller');
const enterpriseController = require('../controllers/enterprise.controller');
const paymentAnalyticsController = require('../controllers/admin.payment.controller');
const upload = require('../middleware/upload');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// Dashboards and general endpoints restricted to Admin
router.get('/enterprise/analytics', authorize('admin'), enterpriseController.getEnterpriseAnalytics);
router.get('/payments/analytics', authorize('admin'), paymentAnalyticsController.getPaymentAnalytics);
router.get('/payments/recent', authorize('admin'), paymentAnalyticsController.getRecentTransactions);
router.get('/dashboard', authorize('admin'), getDashboard);
router.get('/users', authorize('admin'), getUsers);
router.put('/users/:id', authorize('admin'), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);

// Analytics and Logs are scoped dynamically in the controller
router.get('/analytics', authorize('admin'), getPlatformAnalytics);
router.get('/security/logs', authorize('admin'), getSecurityLogs);

// Upload Route
router.post('/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Return the relative path for serving
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.status(200).json({
        success: true,
        url: videoUrl
    });
});

// Course Routes
router.get('/courses', authorize('admin'), getAllCourses);
router.get('/courses/:id', authorize('admin'), getCourseById);
router.post('/courses', authorize('admin'), createCourse);
router.put('/courses/:id', authorize('admin'), updateCourse);
router.delete('/courses/:id', authorize('admin'), deleteCourse);

// Gamification Overview Routes (Admin)
router.get('/certificates', authorize('admin'), getAllCertificates);
router.get('/achievements', authorize('admin'), getAllUserAchievements);
router.get('/badges', authorize('admin'), getAllUserBadges);

module.exports = router;
