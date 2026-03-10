const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    videoTitle: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: [true, 'Note content cannot be empty'],
        trim: true,
        maxlength: [1000, 'Note cannot be more than 1000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to quickly fetch notes for a specific user and video
noteSchema.index({ user: 1, course: 1, videoTitle: 1 });

module.exports = mongoose.model('Note', noteSchema);
