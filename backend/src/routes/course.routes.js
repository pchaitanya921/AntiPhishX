const express = require('express');
const {
    getAllCourses,
    getCourse,
    enrollCourse,
    getMyCourses
} = require('../controllers/course.controller');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Specific routes must come before parameterized routes
router.get('/my-courses', protect, getMyCourses);

router.route('/')
    .get(getAllCourses);

router.route('/:id')
    .get(getCourse);

router.route('/:id/enroll')
    .post(protect, enrollCourse);

module.exports = router;
