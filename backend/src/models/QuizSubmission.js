const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * QuizSubmission — persists every quiz attempt with answers, score, and XP earned.
 * This is what was missing: quiz results were only in frontend memory and lost on refresh.
 */
const quizSubmissionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    quizId: {
        type: String,
        required: true,
        index: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert']
    },
    // Map of question index → selected option index
    // e.g. { "0": 2, "1": 0, "2": 1, ... }
    answers: {
        type: Map,
        of: Number
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 1
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100
    },
    passed: {
        type: Boolean,
        required: true
    },
    xpEarned: {
        type: Number,
        default: 0,
        min: 0
    },
    timeTakenSeconds: {
        type: Number,
        min: 0
    },
    autoSubmitted: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for "user's attempts on a specific quiz" queries
quizSubmissionSchema.index({ user: 1, quizId: 1 });

// Virtual: letter grade
quizSubmissionSchema.virtual('grade').get(function () {
    const p = this.percentage;
    if (p >= 90) return 'A';
    if (p >= 80) return 'B';
    if (p >= 70) return 'C';
    if (p >= 60) return 'D';
    return 'F';
});

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
