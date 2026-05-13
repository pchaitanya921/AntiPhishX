const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        index: true
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'PHISHING_CLICKED', 
            'USER_PROVISIONED', 
            'USER_DEACTIVATED',
            'USER_LOGIN',
            'USER_LOGIN_FAILURE',
            'USER_LOGOUT',
            'USER_REGISTERED',
            'SSO_LOGIN',
            'CAMPAIGN_LAUNCHED',
            'ADMIN_CONFIG_CHANGE',
            'LAB_STARTED',
            'LAB_COMPLETED',
            'QUIZ_COMPLETED',
            'CERTIFICATE_ISSUED',
            'PAYMENT_FAILED'
        ],
        index: true
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    siemDelivered: {
        type: Boolean,
        default: false
    },
    correlationId: String
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
