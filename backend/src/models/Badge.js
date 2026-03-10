const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['technical', 'social', 'milestone', 'expert'],
        default: 'technical'
    },
    icon: {
        type: String,
        default: 'medal'
    },
    criteria: {
        type: Object, // Logic for unlocking
        required: true
    },
    points: {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
