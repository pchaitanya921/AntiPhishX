const Notification = require('../models/Notification');

/**
 * GET /api/notifications
 * Returns the authenticated user's notifications (unread first, max 20)
 */
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ isRead: 1, createdAt: -1 })   
            .limit(20);

        const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

        res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        console.error('[NotificationController] getNotifications error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a specific notification as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        console.error('[NotificationController] markAsRead error:', err);
        res.status(500).json({ success: false, message: 'Failed to update notification' });
    }
};

/**
 * PUT /api/notifications/read-all
 * Mark all unread notifications as read for the authenticated user
 */
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        console.error('[NotificationController] markAllAsRead error:', err);
        res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
    }
};

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        console.error('[NotificationController] deleteNotification error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
};
