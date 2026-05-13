const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['badge', 'milestone', 'rank']
    },
    key: {
        type: String, // e.g. 'first_neutralization', 'urgency_master'
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    icon: String,
    xpReward: {
        type: Number,
        default: 100
    },
    earnedAt: {
        type: Date,
        default: Date.now
    },
    metadata: Object
}, {
    timestamps: true
});

achievementSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
