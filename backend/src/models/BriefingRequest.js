const mongoose = require('mongoose');

const briefingRequestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name'],
        trim: true
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true
    },
    workEmail: {
        type: String,
        required: [true, 'Please add a work email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    companySize: {
        type: String,
        enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
        required: [true, 'Please select company size']
    },
    jobRole: {
        type: String,
        required: [true, 'Please add your job role'],
        trim: true
    },
    challenges: {
        type: [String],
        default: []
    },
    preferredDate: {
        type: Date,
        required: [true, 'Please select a preferred meeting date']
    },
    message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot be more than 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending'
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for filtering and search
briefingRequestSchema.index({ companyName: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('BriefingRequest', briefingRequestSchema);
