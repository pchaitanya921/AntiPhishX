const express = require('express');
const router = express.Router();
const {
    createBriefingRequest,
    getBriefingRequests,
    updateBriefingStatus
} = require('../controllers/briefing.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', createBriefingRequest);

router.get('/', protect, authorize('admin'), getBriefingRequests);
router.put('/:id', protect, authorize('admin'), updateBriefingStatus);

module.exports = router;
