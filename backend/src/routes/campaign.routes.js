const express = require('express');
const {
    createCampaign,
    launchCampaign,
    trackClick,
    getCampaigns
} = require('../controllers/campaign.controller');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Public route for click tracking
router.get('/track/:token', trackClick);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getCampaigns)
    .post(createCampaign);

router.post('/:id/launch', launchCampaign);

module.exports = router;
