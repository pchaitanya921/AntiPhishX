const mongoose = require('mongoose');

const aiRiskTrackingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true,
        index: true
    },
    guessingFrequency: {
        type: Number,
        default: 0,
        min: 0
    },
    hintOveruse: {
        type: Number,
        default: 0,
        min: 0
    },
    rapidRetries: {
        type: Number,
        default: 0,
        min: 0
    },
    riskScore: {
        type: Number,
        default: 0.0,
        min: 0,
        max: 100
    },
    lastViolation: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound unique index (one risk tracking per user per lab)
aiRiskTrackingSchema.index({ user: 1, lab: 1 }, { unique: true });

// Index for finding high-risk users
aiRiskTrackingSchema.index({ riskScore: -1 });

// Method to increment risk score based on violation type
aiRiskTrackingSchema.methods.recordViolation = function (violationType) {
    const penalties = {
        RAPID_RETRY: 5,
        HINT_SPAM: 3,
        GUESSING: 2,
        COPY_PASTE: 10
    };

    this.riskScore += penalties[violationType] || 0;
    this.lastViolation = Date.now();

    // Increment specific counter
    switch (violationType) {
        case 'RAPID_RETRY':
            this.rapidRetries++;
            break;
        case 'HINT_SPAM':
            this.hintOveruse++;
            break;
        case 'GUESSING':
            this.guessingFrequency++;
            break;
    }

    return this.save();
};

// Method to get recommended action based on risk score
aiRiskTrackingSchema.methods.getRecommendedAction = function () {
    if (this.riskScore > 50) {
        return { action: 'GUIDED_ONLY', message: 'Hint access restricted. Focus on reasoning.' };
    } else if (this.riskScore > 30) {
        return { action: 'HINT_COOLDOWN', message: 'Please wait before requesting another hint.' };
    } else if (this.riskScore > 15) {
        return { action: 'WARNING', message: 'Focus on understanding, not just answers.' };
    }
    return { action: 'NONE' };
};

module.exports = mongoose.model('AIRiskTracking', aiRiskTrackingSchema);
