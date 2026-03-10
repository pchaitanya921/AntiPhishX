const mongoose = require('mongoose');

const labSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number, // in seconds
        required: true
    },
    hintsUsed: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying by lab (for analytics) and user (for history)
labSubmissionSchema.index({ lab: 1, submittedAt: -1 });
labSubmissionSchema.index({ user: 1, lab: 1 });

module.exports = mongoose.model('LabSubmission', labSubmissionSchema);
