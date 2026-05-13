const passport = require('passport');
const { MultiSamlStrategy } = require('passport-saml');
const Organization = require('../models/Organization');
const User = require('../models/User');
const crypto = require('crypto');

// Helper to generate a dummy strong password for JIT users (since they use SAML)
const generateSecureDummyPassword = () => crypto.randomBytes(32).toString('hex');

// In a real multi-tenant app, the callback URL must include the tenant identifier
// e.g., /api/auth/sso/callback?domain=company.com
const getSamlOptions = async (req, done) => {
    try {
        // Find domain from query params or body depending on where it was sent
        // For passport-saml MultiSamlStrategy, the request is passed here
        const domain = req.query.domain || req.body.RelayState || req.params.domain;

        if (!domain) {
            return done(new Error('Missing domain parameter for SSO routing'));
        }

        const org = await Organization.findOne({ domain: domain.toLowerCase() });
        
        if (!org || !org.samlEnabled) {
            return done(new Error(`SSO is not configured or enabled for domain: ${domain}`));
        }

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

        // Map Organization DB settings to Passport-SAML options
        const samlOptions = {
            entryPoint: org.samlEntryPoint,
            issuer: org.samlIssuer,
            callbackUrl: `${backendUrl}/api/auth/sso/callback?domain=${domain}`,
            cert: org.samlCertificate,
            // Security settings
            authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
            identifierFormat: null,
            signatureAlgorithm: 'sha256',
            acceptedClockSkewMs: -1, // Tolerance for clock skew
            disableRequestedAuthnContext: true
        };

        return done(null, samlOptions);
    } catch (err) {
        return done(err);
    }
};

// Configure Passport Strategy
passport.use('saml', new MultiSamlStrategy(
    {
        passReqToCallback: true,
        getSamlOptions: getSamlOptions
    },
    async (req, profile, done) => {
        try {
            // Profile contains the parsed SAML assertion attributes
            const domain = req.query.domain || req.body.RelayState;
            const org = await Organization.findOne({ domain: domain.toLowerCase() });

            if (!org) {
                return done(null, false, { message: 'Organization not found during callback' });
            }

            // Extract email (often stored in nameID or a specific attribute mapping)
            const email = (profile.nameID || profile.email || profile.mail || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']).toLowerCase();
            
            if (!email) {
                return done(null, false, { message: 'SAML assertion missing email attribute' });
            }

            // JIT Provisioning or User Lookup
            let user = await User.findOne({ email });

            if (user) {
                // Update SSO metadata for existing user
                user.lastSsoLogin = Date.now();
                user.authProvider = 'saml';
                user.ssoEnabled = true;
                user.organization = org._id; // Ensure mapping
                await user.save();
            } else {
                // Just-In-Time (JIT) Provisioning
                const firstName = profile.givenName || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || 'SSO';
                const lastName = profile.surname || profile.sn || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || 'User';

                user = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: generateSecureDummyPassword(), // Never used directly
                    organization: org._id,
                    role: org.defaultRoleMapping || 'learner',
                    authProvider: 'saml',
                    ssoEnabled: true,
                    lastSsoLogin: Date.now(),
                    isEmailVerified: true // Trust the IdP
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// @desc    Initiate SSO Login (Redirects to IdP)
// @route   GET /api/auth/sso/login/:domain
// @access  Public
exports.ssoLogin = (req, res, next) => {
    const domain = req.params.domain;
    if (!domain) {
        return res.status(400).json({ success: false, message: 'Domain is required' });
    }
    
    // Add domain to query string so passport-saml can pick it up in getSamlOptions
    req.query.domain = domain;
    
    // Passport authenticate will redirect the browser to the IdP
    passport.authenticate('saml', {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=sso_failed`,
        failureFlash: true,
        additionalParams: { RelayState: domain } // Use RelayState to pass domain back in callback
    })(req, res, next);
};

// @desc    SSO Callback (IdP posts back here)
// @route   POST /api/auth/sso/callback
// @access  Public
exports.ssoCallback = (req, res, next) => {
    passport.authenticate('saml', { session: false }, (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        if (err || !user) {
            console.error('SAML Auth Error:', err || info);
            return res.redirect(`${frontendUrl}/login?error=sso_failed`);
        }

        // --- Session Bridging ---
        // As requested by architecture: 
        // 1. Long-lived Refresh Token in HttpOnly cookie
        // 2. Access JWT passed to frontend (via redirect URL hash or short-lived cookie)
        
        // Generate tokens
        const accessToken = user.getSignedJwtToken(); // Standard token
        
        // For the MVP session bridge, we'll set the access token in a secure, strict HttpOnly cookie
        // so the frontend doesn't need to parse URL hashes, which is cleaner and more secure.
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.cookie('token', accessToken, options);

        // Redirect to dashboard. The frontend AuthProvider will automatically pick up the user via /api/auth/me
        return res.redirect(`${frontendUrl}/dashboard?sso=success`);
    })(req, res, next);
};

// @desc    Get SSO status for a domain (Used by frontend to decide login flow)
// @route   GET /api/auth/sso/status/:domain
// @access  Public
exports.getSsoStatus = async (req, res) => {
    try {
        const domain = req.params.domain.toLowerCase();
        const org = await Organization.findOne({ domain });

        if (org && org.samlEnabled) {
            return res.status(200).json({
                success: true,
                ssoEnabled: true,
                domain: org.domain
            });
        }

        res.status(200).json({ success: true, ssoEnabled: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
