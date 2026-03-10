const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenario.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// POST /api/scenario/generate — admin/instructor only
router.post('/generate', authorize('admin', 'instructor'), scenarioController.generate);

module.exports = router;
