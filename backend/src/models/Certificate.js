const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    credentialId: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        required: true
    },
    verificationUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
