const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null for failed login attempts (unknown user)
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'REGISTER_SUCCESS', 'REGISTER_FAILURE', 'PASSWORD_CHANGE', 'PROFILE_UPDATE', 'LAB_START', 'LAB_COMPLETE']
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'info'
    },
    ipAddress: {
        type: String,
        default: '0.0.0.0'
    },
    userAgent: {
        type: String
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // flexible for storing error messages or metadata
        default: {}
    },
    resource: {
        type: String // e.g., "Auth System", "Lab: Phishing 101"
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting and range queries
    }
});

// Index for quick filtering
securityLogSchema.index({ action: 1, severity: 1, timestamp: -1 });

module.exports = mongoose.model('SecurityLog', securityLogSchema);
