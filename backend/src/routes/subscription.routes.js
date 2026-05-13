const express = require('express');
const router = express.Router();
const { 
    getSubscriptions, 
    updateUserPlan, 
    getSubscriptionAnalytics 
} = require('../controllers/subscription.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes are protected and restricted to high-privilege roles
router.use(protect);
router.use(authorize('admin', 'superAdmin'));

router.get('/', getSubscriptions);
router.get('/analytics', getSubscriptionAnalytics);
router.put('/:userId', updateUserPlan);

module.exports = router;
