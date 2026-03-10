const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lab title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Lab description is required']
    },
    topic: {
        type: String,
        required: true,
        enum: ['phishing', 'vishing', 'smishing', 'qr_code', 'social_engineering', 'advanced_threats', 'malware_detection']
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    type: {
        type: String,
        required: true,
        enum: ['email', 'url', 'call', 'sms', 'qr', 'file', 'chat', 'social_engineering']
    },
    points: {
        type: Number,
        default: 100
    },
    timeLimit: {
        type: Number, // in seconds
        default: 600
    },
    content: {
        type: Object, // Flexible content structure based on type (e.g. email headers, browser URL, etc.)
        required: true
    },
    scenario: {
        type: String,
        required: [true, 'Lab scenario (briefing) is required for mission context']
    },
    steps: {
        type: [String],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A lab must have at least one actionable task/objective.'
        },
        required: true
    },
    hints: [{
        content: String,
        cost: {
            type: Number,
            default: 10
        }
    }],
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer/determination is required'],
        select: false
    },
    explanation: {
        type: String,
        required: [true, 'Detailed explanation is required for learning value']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
labSchema.index({ topic: 1, level: 1 });

module.exports = mongoose.model('Lab', labSchema);
