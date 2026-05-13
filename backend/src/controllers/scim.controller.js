const User = require('../models/User');
const auditService = require('../services/audit.service');
const crypto = require('crypto');

/**
 * SCIM 2.0 User Provisioning Controller
 * Implements RFC 7644
 */

// Helper to map User model to SCIM User Schema
const mapUserToScim = (user) => ({
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: user._id,
    externalId: user.scimExternalId,
    userName: user.email,
    name: {
        givenName: user.firstName,
        familyName: user.lastName,
        formatted: `${user.firstName} ${user.lastName}`
    },
    emails: [{ value: user.email, primary: true }],
    active: user.active,
    meta: {
        resourceType: "User",
        created: user.createdAt,
        lastModified: user.updatedAt || user.createdAt,
        location: `/api/scim/v2/Users/${user._id}`
    }
});

// @desc    Get SCIM Users
// @route   GET /api/scim/v2/Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ organization: req.user.organization });
        
        res.status(200).json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            totalResults: users.length,
            startIndex: 1,
            itemsPerPage: users.length,
            Resources: users.map(mapUserToScim)
        });
    } catch (err) {
        res.status(500).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: err.message, status: "500" });
    }
};

// @desc    Create SCIM User
// @route   POST /api/scim/v2/Users
exports.createUser = async (req, res) => {
    try {
        const { userName, name, active, externalId } = req.body;
        
        if (!userName) {
            return res.status(400).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], scimType: "invalidValue", detail: "userName (email) is required", status: "400" });
        }

        // Check if user already exists
        let user = await User.findOne({ email: userName.toLowerCase() });
        if (user) {
            return res.status(409).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: "User already exists", status: "409" });
        }

        user = await User.create({
            firstName: name?.givenName || 'SCIM',
            lastName: name?.familyName || 'User',
            email: userName.toLowerCase(),
            password: crypto.randomBytes(32).toString('hex'), // JIT/SCIM users don't use local password
            organization: req.user.organization,
            scimExternalId: externalId,
            active: active !== undefined ? active : true,
            authProvider: 'saml'
        });

        await auditService.log({
            organizationId: req.user.organization,
            eventType: 'USER_PROVISIONED',
            severity: 'LOW',
            details: { userId: user._id, email: user.email, source: 'SCIM' },
            req
        });

        res.status(201).json(mapUserToScim(user));
    } catch (err) {
        res.status(500).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: err.message, status: "500" });
    }
};

// @desc    Get SCIM User by ID
// @route   GET /api/scim/v2/Users/:id
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, organization: req.user.organization });
        if (!user) {
            return res.status(404).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: "User not found", status: "404" });
        }
        res.status(200).json(mapUserToScim(user));
    } catch (err) {
        res.status(500).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: err.message, status: "500" });
    }
};

// @desc    Update SCIM User (PUT)
// @route   PUT /api/scim/v2/Users/:id
exports.updateUser = async (req, res) => {
    try {
        const { name, active, externalId } = req.body;
        
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, organization: req.user.organization },
            { 
                firstName: name?.givenName,
                lastName: name?.familyName,
                active: active,
                scimExternalId: externalId
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: "User not found", status: "404" });
        }

        res.status(200).json(mapUserToScim(user));
    } catch (err) {
        res.status(500).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: err.message, status: "500" });
    }
};

// @desc    Delete/Deactivate SCIM User
// @route   DELETE /api/scim/v2/Users/:id
exports.deleteUser = async (req, res) => {
    try {
        // SCIM Delete often means deactivation in enterprise apps
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, organization: req.user.organization },
            { active: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: "User not found", status: "404" });
        }

        await auditService.log({
            organizationId: req.user.organization,
            eventType: 'USER_DEACTIVATED',
            severity: 'MEDIUM',
            details: { userId: user._id, email: user.email, source: 'SCIM' },
            req
        });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: err.message, status: "500" });
    }
};
