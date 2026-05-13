const express = require('express');
const { seedDemoOrganization } = require('../controllers/demo.controller');
const router = express.Router();

// Public endpoint for now to allow easy testing/demos, but should be restricted in production
router.post('/seed', seedDemoOrganization);

module.exports = router;
