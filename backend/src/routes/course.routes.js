const express = require('express');
const {
    getAllCourses,
    getCourse,
    enrollCourse,
    getMyCourses
} = require('../controllers/course.controller');

const { protect, optionalProtect } = require('../middleware/auth.middleware');
const { deviceEnforcement } = require('../middleware/device.middleware');

const router = express.Router();

// Specific routes must come before parameterized routes
router.get('/my-courses', protect, deviceEnforcement, getMyCourses);

router.route('/')
    .get(optionalProtect, getAllCourses);

router.route('/:id')
    .get(optionalProtect, getCourse);

router.route('/:id/enroll')
    .post(protect, deviceEnforcement, enrollCourse);

module.exports = router;
