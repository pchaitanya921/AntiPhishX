const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Notification — in-app notification model with a 30-day auto-expiry TTL index.
 * Supports achievement unlock, quiz completion, lab completion, and system alerts.
 */
const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        trim: true,
        maxlength: 300
    },
    type: {
        type: String,
        enum: ['achievement', 'quiz', 'lab', 'leaderboard', 'system', 'certificate'],
        default: 'system'
    },
    icon: {
        type: String // emoji or icon name, e.g. '🏆' or 'trophy'
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    },
    link: {
        type: String // internal route, e.g. '/achievements'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // TTL index — MongoDB auto-deletes documents after 30 days
        expires: 60 * 60 * 24 * 30
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for "user's unread notifications"
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
