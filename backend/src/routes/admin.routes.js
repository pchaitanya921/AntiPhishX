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
    deleteUser
} = require('../controllers/admin.controller');
const upload = require('../middleware/upload');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin')); // Apply admin check to all routes

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getPlatformAnalytics);
router.get('/security/logs', getSecurityLogs);

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
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
