const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenario.controller');
const { protect, requirePermission } = require('../middleware/auth.middleware');

router.use(protect);

// POST /api/scenario/generate
router.post('/generate', requirePermission('generate_ai_scenario'), scenarioController.generate);

module.exports = router;
