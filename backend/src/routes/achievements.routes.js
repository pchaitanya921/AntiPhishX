const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievements.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route
router.get('/verify/:certId', achievementsController.verifyCertificate);

// Protected routes
router.use(protect);

router.get('/my-certificates', achievementsController.getMyCertificates);
router.get('/download/:id', achievementsController.downloadCertificate);
router.post('/check-eligibility', achievementsController.checkEligibility);

module.exports = router;
