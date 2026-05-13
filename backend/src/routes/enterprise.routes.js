const express = require('express');
const router = express.Router();
const {
    createEnterpriseRequest,
    getEnterpriseRequests,
    updateEnterpriseRequestStatus,
    convertRequestToPilot
} = require('../controllers/enterprise.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/request', createEnterpriseRequest);

router.get('/requests', protect, authorize('admin', 'superAdmin', 'enterpriseAdmin', 'enterprise_admin'), getEnterpriseRequests);
router.put('/requests/:id', protect, authorize('admin', 'superAdmin', 'enterpriseAdmin', 'enterprise_admin'), updateEnterpriseRequestStatus);
router.post('/requests/:id/convert-to-pilot', protect, authorize('admin', 'superAdmin', 'enterprise_admin'), convertRequestToPilot);

module.exports = router;
