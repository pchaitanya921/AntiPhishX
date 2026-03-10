const Notification = require('../models/Notification');

/**
 * createNotification — helper to push a notification to a user.
 * Call this from any controller after an important event occurs.
 *
 * @param {string} userId     - MongoDB User ObjectId
 * @param {object} payload    - { title, message, type, icon, link }
 */
const createNotification = async (userId, payload) => {
    try {
        await Notification.create({
            user: userId,
            title: payload.title,
            message: payload.message || '',
            type: payload.type || 'system',
            icon: payload.icon || '',
            link: payload.link || null
        });
    } catch (err) {
        // Notifications are non-critical — log but don't throw
        console.error('[Notification] Failed to create notification:', err.message);
    }
};

module.exports = { createNotification };
