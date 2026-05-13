const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the organization name'],
        trim: true,
        unique: true
    },
    domain: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true, // Allow multiple nulls/undefined for organizations without domains
        description: 'The primary email domain associated with this organization (e.g., company.com)'
    },
    industry: {
        type: String,
        enum: ['Technology', 'Finance', 'Healthcare', 'Education', 'Government', 'Retail', 'Other'],
        default: 'Other'
    },
    size: {
        type: String,
        enum: ['1-50', '51-200', '201-1000', '1001-5000', '5000+'],
        default: '1-50'
    },
    contactEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid contact email'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Enterprise SSO / SAML Settings
    samlEnabled: {
        type: Boolean,
        default: false
    },
    samlEntryPoint: {
        type: String,
        description: 'IdP Login URL'
    },
    samlIssuer: {
        type: String,
        description: 'IdP Entity ID'
    },
    samlCertificate: {
        type: String,
        description: 'IdP Public X.509 Certificate for validating signatures'
    },
    defaultRoleMapping: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user'
    },
    // SCIM Provisioning Settings
    scimEnabled: {
        type: Boolean,
        default: false
    },
    scimSecretToken: {
        type: String,
        select: false // Don't return by default
    },
    // SIEM / SOC Integration Settings
    siemEnabled: {
        type: Boolean,
        default: false
    },
    siemWebhookUrl: {
        type: String,
        trim: true
    },
    siemAuthToken: {
        type: String,
        select: false
    },
    // Pilot & Subscription Configuration
    plan: {
        type: String,
        enum: ['core_node', 'neural_advanced', 'enterprise_lattice'],
        default: 'core_node'
    },
    pilotStatus: {
        type: String,
        enum: ['none', 'active', 'expired', 'completed'],
        default: 'none'
    },
    pilotExpiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Organization', organizationSchema);
