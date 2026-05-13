const Notification = require('../models/Notification');

/**
 * NotificationService
 * Handles creation and dispatching of in-app notifications
 */
class NotificationService {
    /**
     * Create a notification for a user
     * @param {string} userId - Target user ID
     * @param {object} data - { title, message, type, icon, link }
     */
    async create(userId, { title, message, type = 'system', icon = '🔔', link = null }) {
        try {
            const notification = await Notification.create({
                user: userId,
                title,
                message,
                type,
                icon,
                link,
                isRead: false
            });

            // Real-time dispatch via Socket.io
            const { emitToUser } = require('../config/socket');
            emitToUser(userId, 'NEW_NOTIFICATION', notification);

            return notification;
        } catch (err) {
            console.error('[NotificationService] Error creating notification:', err);
            return null;
        }
    }

    /**
     * Specialized creation methods for ease of use
     */

    async securityAlert(userId, title, message, link = null) {
        return this.create(userId, { title, message, type: 'security', icon: '🛡️', link });
    }

    async subscriptionAlert(userId, title, message, link = null) {
        return this.create(userId, { title, message, type: 'subscription', icon: '💳', link });
    }

    async trainingAlert(userId, title, message, link = null) {
        return this.create(userId, { title, message, type: 'training', icon: '🎓', link });
    }

    async enterpriseAlert(userId, title, message, link = null) {
        return this.create(userId, { title, message, type: 'enterprise', icon: '🏛️', link });
    }

    async systemAlert(userId, title, message, link = null) {
        return this.create(userId, { title, message, type: 'system', icon: '⚙️', link });
    }
}

module.exports = new NotificationService();
