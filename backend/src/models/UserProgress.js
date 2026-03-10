const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
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
    topic: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date
    },
    lastAttemptAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one progress record per user per lab
userProgressSchema.index({ user: 1, lab: 1 }, { unique: true });
userProgressSchema.index({ user: 1, topic: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
