const express = require('express');
const router = express.Router();
const adminInsightController = require('../controllers/adminInsight.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin', 'superAdmin', 'enterprise_admin'));

router.post('/log', adminInsightController.logInsightInteraction);
router.get('/metrics', adminInsightController.getEngagementMetrics);

module.exports = router;
