const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [v => v.length >= 2, 'At least 2 options are required']
    },
    correct: {
        type: Number,
        required: true,
        min: 0
    },
    explanation: {
        type: String,
        required: true
    }
});

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        default: 'Beginner'
    },
    xp: {
        type: Number,
        required: true,
        default: 100,
        min: 0
    },
    timeLimitSeconds: {
        type: Number,
        required: true,
        default: 600,
        min: 30
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
