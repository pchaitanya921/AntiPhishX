const express = require('express');
const {
    getLabs,
    getLab,
    submitLab,
    createLab,
    updateLab,
    deleteLab,
    getLabAnalytics,
    getLabSubmissions
} = require('../controllers/lab.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
    .route('/')
    .get(getLabs)
    .post(authorize('admin'), createLab);

router
    .route('/:id')
    .get(getLab)
    .put(authorize('admin', 'instructor'), updateLab)
    .delete(authorize('admin'), deleteLab);

router.post('/:id/submit', submitLab);

router.get('/:id/analytics', authorize('admin', 'instructor'), getLabAnalytics);
router.get('/:id/submissions', authorize('admin', 'instructor'), getLabSubmissions);

module.exports = router;
