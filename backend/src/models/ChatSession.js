const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['lab', 'cyber', 'instructor'],
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New Chat',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for efficient querying
chatSessionSchema.index({ user: 1, mode: 1, createdAt: -1 });

// Update timestamp on save
chatSessionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for message count
chatSessionSchema.virtual('messages', {
    ref: 'ChatMessage',
    localField: '_id',
    foreignField: 'session'
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

// Cleanup: Drop incorrect userId_1 index if it exists (legacy bug)
ChatSession.on('index', (error) => {
    if (error) console.error('ChatSession Index Error:', error);

    // Explicitly drop the problematic index if possible
    ChatSession.collection.dropIndex('userId_1').catch(err => {
        // Silently ignore if index doesn't exist (NamespaceNotFound)
        if (err.code !== 26 && err.codeName !== 'NamespaceNotFound') {
            console.log('ChatSession: userId_1 index check complete');
        }
    });
});

module.exports = ChatSession;
