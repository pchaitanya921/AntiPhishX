const express = require('express');
const {
    getLeaderboard,
    getMyRank
} = require('../controllers/leaderboard.controller');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/my-rank', protect, getMyRank);

module.exports = router;
