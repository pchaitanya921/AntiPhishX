const express = require('express');
const {
    getAllAchievements,
    getMyAchievements,
    getAllBadges,
    getMyBadges,
    getMyCertificates,
    seedAchievements
} = require('../controllers/achievement.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllAchievements);
router.get('/my-achievements', protect, getMyAchievements);
router.get('/badges', getAllBadges);
router.get('/my-badges', protect, getMyBadges);
router.get('/my-certificates', protect, getMyCertificates);
router.post('/seed', protect, authorize('admin'), seedAchievements);

module.exports = router;
