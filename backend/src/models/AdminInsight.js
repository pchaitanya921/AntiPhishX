const mongoose = require('mongoose');

const adminInsightSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true
    },
    insightType: {
        type: String,
        enum: ['RISK_HEATMAP_VIEW', 'PREDICTIVE_FORECAST_ACTION', 'DRILLDOWN_ANALYSIS', 'REPORT_EXPORT', 'AI_CHASE_ALERT'],
        required: true
    },
    targetDepartment: String,
    targetUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    actionTaken: {
        type: String,
        default: 'viewed'
    },
    impactScore: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for aggregation
adminInsightSchema.index({ organization: 1, createdAt: -1 });
adminInsightSchema.index({ insightType: 1 });

module.exports = mongoose.model('AdminInsight', adminInsightSchema);
