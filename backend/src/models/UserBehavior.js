const mongoose = require('mongoose');

const mistakeSchema = new mongoose.Schema({
    mistakeType: {
        type: String,
        required: true,
        // Examples: "trusted_fake_sender", "clicked_suspicious_link", "missed_urgency_cue", "failed_domain_verification"
    },
    frequency: {
        type: Number,
        default: 1
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const userBehaviorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    mistakes: [mistakeSchema],
    totalLabsPlayed: {
        type: Number,
        default: 0
    },
    totalFails: {
        type: Number,
        default: 0
    },
    adaptiveDifficulty: {
        type: Number,
        default: 1, // 1 to 10
        min: 1,
        max: 10
    },
    riskScore: {
        type: Number,
        default: 50, // 0 to 100
        min: 0,
        max: 100
    },
    riskScoreHistory: [{
        score: Number,
        date: { type: Date, default: Date.now }
    }],
    detectionAccuracy: {
        type: Number,
        default: 0 // Percentage 0-100
    },
    averageResponseTime: {
        type: Number,
        default: 0 // Seconds
    },
    // AI Cognitive Mapping
    cognitiveVulnerabilityMap: {
        urgency: { type: Number, default: 50 }, // 0-100
        authority: { type: Number, default: 50 },
        reward: { type: Number, default: 50 },
        fear: { type: Number, default: 50 },
        curiosity: { type: Number, default: 50 }
    },
    personalRecommendations: [{
        title: String,
        description: String,
        labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
        reasoning: String,
        createdAt: { type: Date, default: Date.now }
    }],
    aiInsights: {
        clickRiskProbability: { type: Number, default: 0.5 }, // 0.0 to 1.0
        confidenceIndex: { type: Number, default: 0.1 }, // AI confidence in the score
        lastInferenceAt: Date
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Helper to record a mistake
userBehaviorSchema.methods.recordMistake = function (mistakeType) {
    const existing = this.mistakes.find(m => m.mistakeType === mistakeType);
    if (existing) {
        existing.frequency += 1;
        existing.lastSeen = Date.now();
    } else {
        this.mistakes.push({ mistakeType, frequency: 1, lastSeen: Date.now() });
    }
    this.totalFails += 1;
    this.lastUpdated = Date.now();
    
    // Decrease adaptive difficulty slightly if failing often
    if (this.totalFails % 3 === 0 && this.adaptiveDifficulty > 1) {
        this.adaptiveDifficulty -= 1;
    }
    
    return this.save();
};

// Helper to record success
userBehaviorSchema.methods.recordSuccess = function () {
    this.totalLabsPlayed += 1;
    this.lastUpdated = Date.now();
    
    // Increase adaptive difficulty
    if (this.totalLabsPlayed % 5 === 0 && this.adaptiveDifficulty < 10) {
        this.adaptiveDifficulty += 1;
    }
    
    return this.save();
};

// Helper to record failure
userBehaviorSchema.methods.recordFailure = function () {
    this.totalLabsPlayed += 1;
    this.totalFails += 1;
    this.lastUpdated = Date.now();
    
    // Decrease adaptive difficulty slightly if failing often
    if (this.totalFails % 3 === 0 && this.adaptiveDifficulty > 1) {
        this.adaptiveDifficulty -= 1;
    }
    
    return this.save();
};

module.exports = mongoose.model('UserBehavior', userBehaviorSchema);
