const mongoose = require('mongoose');
const argon2 = require('argon2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    supabaseId: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values to exist for legacy users
        index: true
    },
    role: {
        type: String,
        enum: ['learner', 'instructor', 'admin', 'superAdmin', 'enterpriseAdmin', 'enterprise_admin', 'internalTester'],
        default: 'learner'
    },
    currentPlan: {
        type: String,
        enum: ['core_node', 'neural_advanced', 'enterprise_lattice'],
        default: 'core_node'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual', 'none'],
        default: 'none'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'expired', 'trial', 'cancelled', 'failed'],
        default: 'trial'
    },
    paymentId: String,
    subscriptionId: String,
    razorpayOrderId: String,
    invoiceNumber: String,
    planActivatedAt: {
        type: Date,
        default: Date.now
    },
    planExpiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // 14 days trial by default
    },
    // Aliases for requested schema consistency
    activatedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    },
    maxDevices: {
        type: Number,
        default: 2 // Default for CORE NODE
    },
    activeDevices: [{
        deviceId: { type: String, required: true },
        browser: String,
        os: String,
        ip: String,
        lastActiveAt: { type: Date, default: Date.now },
        sessionToken: String,
        location: String
    }],
    department: {
        type: String,
        enum: ['Engineering', 'HR', 'Finance', 'Sales', 'IT', 'Executive', 'Other'],
        default: 'Other'
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: false // Optional for backward compatibility and independent B2C learners
    },
    // SSO / Enterprise Authentication Fields
    authProvider: {
        type: String,
        enum: ['local', 'saml', 'google', 'github'],
        default: 'local'
    },
    ssoEnabled: {
        type: Boolean,
        default: false
    },
    externalIdpId: {
        type: String,
        sparse: true,
        index: true
    },
    lastSsoLogin: {
        type: Date
    },
    scimExternalId: {
        type: String,
        sparse: true,
        index: true,
        description: 'External ID provided by SCIM IdP'
    },
    behavioralProfile: {
        urgencySusceptibility: { type: Number, default: 0 },
        authoritySusceptibility: { type: Number, default: 0 },
        rewardSusceptibility: { type: Number, default: 0 },
        curiositySusceptibility: { type: Number, default: 0 },
        fearSusceptibility: { type: Number, default: 0 },
        socialPressureSusceptibility: { type: Number, default: 0 },
        detectionSpeed: { type: Number, default: 0 }, // Avg time to identify threat (s)
        neutralizationAccuracy: { type: Number, default: 0 }, // % of threats correctly neutralized
        failureVelocity: { type: Number, default: 0 },
        lastFailureAt: Date,
        riskScore: { type: Number, default: 50 }, // Overall HRI Risk (0-100)
        domainExpertise: {
            executive_intelligence: { type: Number, default: 0 },
            tactical_defense: { type: Number, default: 0 },
            cognitive_security: { type: Number, default: 0 },
            advanced_ai_adaptive: { type: Number, default: 0 }
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },

    avatar: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Encrypt password using argon2
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        // Detect legacy bcrypt hash
        if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
            console.log('Legacy bcrypt hash detected, verifying with bcryptjs...');
            return await bcrypt.compare(enteredPassword, this.password);
        }
        
        // Standard Argon2 verification
        return await argon2.verify(this.password, enteredPassword);
    } catch (err) {
        console.error('Password verification error:', err);
        return false;
    }
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    const secret = process.env.JWT_SECRET;
    
    if (!secret && process.env.NODE_ENV === 'production') {
        throw new Error('CRITICAL: JWT_SECRET must be set in production environment');
    }

    return jwt.sign({ id: this._id, role: this.role }, secret || 'antiphishx_dev_secret_key_change_in_production', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

module.exports = mongoose.model('User', userSchema);
