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

        const user = await User.findById(decoded.id).select('+active');
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
 * Grant access to specific roles
 * Usage: router.get('/admin-route', protect, authorize('admin'))
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
