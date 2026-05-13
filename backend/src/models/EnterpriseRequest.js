const mongoose = require('mongoose');

const enterpriseRequestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['pilot', 'consultation', 'architecture', 'demo'],
        required: true
    },
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
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    teamSize: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    deploymentInterest: {
        type: String,
        trim: true
    },
    securityChallenges: {
        type: [String],
        default: []
    },
    currentStack: {
        type: String,
        trim: true
    },
    requirements: {
        type: String,
        trim: true
    },
    siemSsoInterest: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot be more than 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'contacted', 'scheduled', 'pilot_active', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledAt: {
        type: Date
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for management
enterpriseRequestSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('EnterpriseRequest', enterpriseRequestSchema);
