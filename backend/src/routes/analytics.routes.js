const express = require('express');
const {
    getUserAnalytics,
    getPlatformStats
} = require('../controllers/analytics.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/user', getUserAnalytics);
router.get('/platform', getPlatformStats);

module.exports = router;
