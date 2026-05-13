const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'opened', 'clicked', 'reported'],
        default: 'pending'
    },
    trackingToken: {
        type: String,
        select: false // keep hidden from API responses
    },
    clickedAt: Date,
    reportedAt: Date,
    ipAddress: String, // audit log
    userAgent: String // audit log
});

const phishingCampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a campaign name'],
        trim: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    templateType: {
        type: String,
        enum: ['password_reset', 'urgent_invoice', 'hr_policy_update', 'unusual_login', 'AI_Adaptive'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    targets: [targetSchema],
    metrics: {
        totalTargets: { type: Number, default: 0 },
        emailsSent: { type: Number, default: 0 },
        emailsOpened: { type: Number, default: 0 },
        linksClicked: { type: Number, default: 0 },
        reported: { type: Number, default: 0 }
    },
    launchedAt: Date,
    completedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update metrics before saving
phishingCampaignSchema.pre('save', function(next) {
    if (this.isModified('targets')) {
        this.metrics.totalTargets = this.targets.length;
        this.metrics.emailsSent = this.targets.filter(t => t.status !== 'pending').length;
        this.metrics.emailsOpened = this.targets.filter(t => ['opened', 'clicked', 'reported'].includes(t.status)).length;
        this.metrics.linksClicked = this.targets.filter(t => t.status === 'clicked').length;
        this.metrics.reported = this.targets.filter(t => t.status === 'reported').length;
    }
    next();
});

module.exports = mongoose.model('PhishingCampaign', phishingCampaignSchema);
