const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verify JWT and attach req.user
 * Supports both Bearer token (header) and httpOnly cookie
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('[Auth] CRITICAL: JWT_SECRET environment variable is not set');
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id).select('+active').populate('organization');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        if (user.active === false) {
            return res.status(401).json({ success: false, message: 'Account has been deactivated' });
        }

        req.user = user;
        next();
    } catch (err) {
        // Log internally but never expose token error details to the client
        console.error('[Auth] Token verification failed:', err.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid or expired token'
        });
    }
};

/**
 * Optional protect — attach req.user if token exists, but don't block
 */
exports.optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) return next();

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('+active').populate('organization');
        if (user && user.active !== false) {
            req.user = user;
        }
        next();
    } catch (err) {
        next();
    }
};

const { hasPermission } = require('../config/permissions');
const { hasPlanAccess } = require('../config/plans');

/**
 * Grant access to specific roles
 * Usage: router.get('/admin-route', protect, authorize('admin'))
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // ⚡ Internal Access Bypass: superAdmin, enterpriseAdmin, enterprise_admin, and internalTester have unrestricted access
        const internalRoles = ['superAdmin', 'enterpriseAdmin', 'enterprise_admin', 'internalTester'];
        
        if (req.user && internalRoles.includes(req.user.role)) {
            return next();
        }

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

/**
 * Grant access based on specific permissions
 * Usage: router.post('/generate', protect, requirePermission('generate_ai_scenario'))
 */
exports.requirePermission = (permission) => {
    return (req, res, next) => {
        // ⚡ Internal Access Bypass
        const internalRoles = ['superAdmin', 'enterpriseAdmin', 'internalTester'];
        if (req.user && internalRoles.includes(req.user.role)) {
            return next();
        }

        if (!req.user || !hasPermission(req.user.role, permission)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role}' lacks the required permission: ${permission}`
            });
        }
        next();
    };
};

/**
 * Grant access based on subscription plan
 * Usage: router.get('/premium-feature', protect, requirePlan('neural_advanced'))
 */
exports.requirePlan = (requiredPlan) => {
    return (req, res, next) => {
        // ⚡ Internal Access Bypass
        const internalRoles = ['superAdmin', 'enterpriseAdmin', 'internalTester'];
        if (req.user && internalRoles.includes(req.user.role)) {
            return next();
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        // Check if subscription is active
        if (req.user.subscriptionStatus === 'expired') {
            return res.status(403).json({
                success: false,
                message: 'Your subscription has expired. Please upgrade to continue accessing premium features.',
                code: 'SUBSCRIPTION_EXPIRED'
            });
        }

        if (!hasPlanAccess(req.user.currentPlan, requiredPlan)) {
            return res.status(403).json({
                success: false,
                message: `This feature requires the ${requiredPlan.replace('_', ' ').toUpperCase()} plan.`,
                code: 'INSUFFICIENT_PLAN',
                requiredPlan
            });
        }
        next();
    };
};
