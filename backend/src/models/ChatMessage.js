const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // Lab context (optional - only for lab mode)
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    },
    topic: {
        type: String
    },
    level: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for efficient session message retrieval
chatMessageSchema.index({ session: 1, createdAt: 1 });

// Index for lab context queries
chatMessageSchema.index({ lab: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
