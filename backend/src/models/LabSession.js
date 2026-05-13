const mongoose = require('mongoose');

const labSessionSchema = new mongoose.Schema({
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
    currentStageId: {
        type: String,
        default: 'stage_1'
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'failed'],
        default: 'in_progress'
    },
    history: [{
        stageId: String,
        actionTaken: String, // the text of the option chosen
        timestamp: { type: Date, default: Date.now },
        pointsChange: Number,
        consequenceTriggered: Boolean
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

module.exports = mongoose.model('LabSession', labSessionSchema);
