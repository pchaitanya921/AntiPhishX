const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'trophy'
    },
    points: {
        type: Number,
        default: 50
    },
    criteria: {
        type: Object, // Logic for unlocking
        required: true
    },
    type: {
        type: String,
        enum: ['milestone', 'mastery', 'performance', 'streak'],
        default: 'milestone'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Achievement', achievementSchema);
