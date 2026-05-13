const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    domain: {
        type: String,
        required: true,
        enum: [
            'executive_intelligence',
            'tactical_defense',
            'cognitive_security',
            'advanced_ai_adaptive'
        ]
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    verificationToken: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    metadata: {
        score: Number,
        resilienceScore: Number,
        labsCompleted: Number,
        avgDetectionSpeed: Number,
        neutralizationAccuracy: Number
    },
    pdfUrl: String,
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for faster lookups
certificateSchema.index({ user: 1, domain: 1, level: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
