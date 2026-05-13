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
        enum: ['phishing', 'vishing', 'smishing', 'qr_code', 'social_engineering', 'advanced_threats', 'malware_detection', 'executive_intelligence', 'tactical_defense', 'cognitive_security', 'advanced_ai_adaptive']
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
        // Make this optional for multi-stage
        select: false
    },
    explanation: {
        type: String,
        // Optional for multi-stage
    },
    isMultiStage: {
        type: Boolean,
        default: false
    },
    stages: [{
        stageId: String,
        type: {
            type: String,
            enum: ['email', 'url', 'call', 'sms', 'qr', 'file', 'chat', 'social_engineering']
        },
        content: Object,
        options: [{
            text: String,
            nextStageId: String, // Which stage to load next, or "end"
            outcomePoints: Number, // Points to add/deduct
            triggerConsequence: Boolean // Does this trigger a simulated breach?
        }]
    }],
    consequences: [{
        stageId: String,
        message: String,
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
        lossAmount: Number // Imaginary currency/data loss
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    // AI Orchestration Metadata
    behavioralVectors: {
        urgency: { type: Number, default: 0 }, // 0 to 10
        authority: { type: Number, default: 0 },
        reward: { type: Number, default: 0 },
        curiosity: { type: Number, default: 0 },
        fear: { type: Number, default: 0 },
        technical: { type: Number, default: 0 }
    },
    adaptiveScaling: {
        type: Boolean,
        default: true,
        description: 'Does this lab support AI-driven difficulty scaling?'
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
labSchema.index({ topic: 1, level: 1 });

module.exports = mongoose.model('Lab', labSchema);
