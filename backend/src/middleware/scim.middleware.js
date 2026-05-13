const Organization = require('../models/Organization');

/**
 * SCIM Authentication Middleware
 * Validates Bearer Token against Organization.scimSecretToken
 */
exports.protectScim = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Missing SCIM Bearer Token",
            status: "401"
        });
    }

    try {
        // Find organization with this SCIM token
        const org = await Organization.findOne({ 
            scimSecretToken: token,
            scimEnabled: true 
        });

        if (!org) {
            return res.status(401).json({
                schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
                detail: "Invalid or disabled SCIM Bearer Token",
                status: "401"
            });
        }

        // Attach organization to request for scoping
        req.user = { organization: org._id };
        req.organization = org;
        
        next();
    } catch (err) {
        return res.status(401).json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Authentication failed",
            status: "401"
        });
    }
};
