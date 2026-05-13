const express = require('express');
const {
    getUserAnalytics,
    getHumanRiskIntelligence,
    getOrganizationAnalytics,
    getExecutiveSummary,
    getDetailedHeatmap,
    exportReport,
    getEnterpriseExecutiveSummary,
    getDepartmentDrilldown
} = require('../controllers/analytics.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/user', getUserAnalytics);
router.get('/hri', getHumanRiskIntelligence);

// Enterprise / Admin Routes
router.get('/organization', authorize('admin', 'superAdmin', 'enterpriseAdmin'), getOrganizationAnalytics);
router.get('/executive-summary', authorize('admin', 'superAdmin', 'enterpriseAdmin'), getExecutiveSummary);
router.get('/enterprise-executive', authorize('admin', 'superAdmin', 'enterpriseAdmin'), getEnterpriseExecutiveSummary);
router.get('/heatmap', authorize('admin', 'superAdmin', 'enterpriseAdmin'), getDetailedHeatmap);
router.get('/heatmap/department/:department', authorize('admin', 'superAdmin', 'enterpriseAdmin'), getDepartmentDrilldown);
router.get('/export-report', authorize('admin', 'superAdmin', 'enterpriseAdmin'), exportReport);

module.exports = router;
