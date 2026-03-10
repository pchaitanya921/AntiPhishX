const mongoose = require('mongoose');

const cyberUserProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    weakTopics: {
        type: [String],
        default: []
    },
    strongTopics: {
        type: [String],
        default: []
    },
    careerGoal: {
        type: String,
        trim: true
    },
    learningScore: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update lastUpdated on save
cyberUserProfileSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

// Method to adjust skill level based on performance
cyberUserProfileSchema.methods.adjustSkillLevel = function (labResults) {
    // Logic to determine if user should level up/down
    // Based on recent lab performance
    const averageScore = labResults.reduce((a, b) => a + b, 0) / labResults.length;

    if (averageScore >= 90 && this.skillLevel !== 'expert') {
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = levels.indexOf(this.skillLevel);
        this.skillLevel = levels[currentIndex + 1];
    }
};

module.exports = mongoose.model('CyberUserProfile', cyberUserProfileSchema);
