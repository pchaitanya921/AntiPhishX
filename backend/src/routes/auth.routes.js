const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    resetPassword
} = require('../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/refresh', (req, res) => res.status(200).json({ success: true, message: 'Sync handshake successful' }));
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
