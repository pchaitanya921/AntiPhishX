const express = require('express');
const {
    getLabs,
    getLab,
    submitLab,
    createLab,
    updateLab,
    deleteLab,
    getLabAnalytics,
    getLabSubmissions,
    startSession,
    submitStage,
    getAdaptiveRecommendation,
    getNeuralRoadmap
} = require('../controllers/lab.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');
const { deviceEnforcement } = require('../middleware/device.middleware');

router.use(protect);
router.use(deviceEnforcement);

// AI Adaptive Orchestration
router.get('/adaptive/next', getAdaptiveRecommendation);
router.get('/adaptive/roadmap', getNeuralRoadmap);

router
    .route('/')
    .get(getLabs)
    .post(authorize('admin'), createLab);

router
    .route('/:id')
    .get(getLab)
    .put(authorize('admin'), updateLab)
    .delete(authorize('admin'), deleteLab);

router.post('/:id/submit', submitLab);

router.get('/:id/analytics', authorize('admin'), getLabAnalytics);
router.get('/:id/submissions', authorize('admin'), getLabSubmissions);

router.post('/:id/session', protect, startSession);
router.post('/:id/session/submit', protect, submitStage);

module.exports = router;
