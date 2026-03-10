const express = require('express');
const {
    getDashboard,
    getMyCourses,
    createCourse,
    getCourseAnalytics,
    getCourseLearners,
    getPendingLabs,
    reviewLab,
    buildQuiz
} = require('../controllers/instructor.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply protection to all routes
router.use(protect);
router.use(authorize('instructor', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/my-courses', getMyCourses);
router.post('/courses/wizard', createCourse);
router.get('/courses/:id/analytics', getCourseAnalytics);
router.get('/courses/:id/learners', getCourseLearners);
router.get('/labs/pending', getPendingLabs);
router.post('/labs/:id/review', reviewLab);
router.post('/quizzes/builder', buildQuiz);

module.exports = router;
