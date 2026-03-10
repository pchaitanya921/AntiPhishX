const express = require('express');
const router = express.Router();
const phishingController = require('../controllers/phishing.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// POST /api/phishing/analyze — analyze URL/email/SMS
router.post('/analyze', phishingController.analyze);

// GET /api/phishing/datasets — get reference dataset info
router.get('/datasets', phishingController.getDatasets);

module.exports = router;
