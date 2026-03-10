const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notification.controller');

router.use(protect);

/**
 * GET    /api/notifications             Get all notifications (unread first)
 * PUT    /api/notifications/read-all    Mark all as read
 * PUT    /api/notifications/:id/read    Mark one as read
 * DELETE /api/notifications/:id         Delete one
 */
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
