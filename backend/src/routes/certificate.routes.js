const express = require('express');
const router = express.Router();
const {
    getMyCertificates,
    getCertificate,
    verifyCertificate,
    downloadCertificate,
    checkAndIssue,
    getEligibility
} = require('../controllers/certificate.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route for verification
router.get('/verify/:certId', verifyCertificate);

// Protected routes
router.use(protect);
router.get('/', getMyCertificates);
router.post('/check', checkAndIssue);
router.post('/eligibility', getEligibility);
router.get('/:id', getCertificate);
router.get('/:id/download', downloadCertificate);

module.exports = router;
