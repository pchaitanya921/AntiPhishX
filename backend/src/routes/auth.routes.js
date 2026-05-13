const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    resetPassword,
    getBehavior
} = require('../controllers/auth.controller');

const {
    ssoLogin,
    ssoCallback,
    getSsoStatus
} = require('../controllers/auth.sso.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Enterprise SSO Routes
router.get('/sso/status/:domain', getSsoStatus);
router.get('/sso/login/:domain', ssoLogin);
router.post('/sso/callback', ssoCallback);

router.post('/refresh', (req, res) => res.status(200).json({ success: true, message: 'Sync handshake successful' }));
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/behavior', protect, getBehavior);

// Device Management
const { getDevices, removeDevice } = require('../controllers/auth.controller');
router.get('/devices', protect, getDevices);
router.delete('/devices/:deviceId', protect, removeDevice);

module.exports = router;
