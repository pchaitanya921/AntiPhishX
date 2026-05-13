const express = require('express');
const router = express.Router();
const phishingController = require('../controllers/phishing.controller');
const detectController = require('../controllers/detect.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// POST /api/phishing/analyze — analyze URL/email/SMS
router.post('/analyze', phishingController.analyze);

// POST /api/phishing/live — real-time detection
router.post('/live', detectController.liveDetect);

// GET /api/phishing/datasets — get reference dataset info
router.get('/datasets', phishingController.getDatasets);

module.exports = router;
