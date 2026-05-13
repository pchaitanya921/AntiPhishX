const UAParser = require('ua-parser-js');
const User = require('../models/User');

/**
 * Middleware to track and enforce device limits
 */
const deviceEnforcement = async (req, res, next) => {
    try {
        if (!req.user) return next();

        const deviceId = req.headers['x-device-id'];
        if (!deviceId) {
            // If no device ID is provided, we might still allow basic requests, 
            // but for a "real" system, we'd want to enforce it.
            // For now, we'll just log it.
            console.warn(`[DEVICE] No device ID provided for user ${req.user._id}`);
            return next();
        }

        const parser = new UAParser(req.headers['user-agent']);
        const result = parser.getResult();
        
        const currentDevice = {
            deviceId,
            browser: `${result.browser.name} ${result.browser.version}`,
            os: `${result.os.name} ${result.os.version}`,
            ip: req.ip || req.headers['x-forwarded-for'],
            lastActiveAt: new Date(),
            sessionToken: req.headers.authorization?.split(' ')[1],
            location: req.headers['x-client-city'] || 'Unknown'
        };

        const user = await User.findById(req.user._id);
        if (!user) return next();

        // Check if device is already registered
        const deviceIndex = user.activeDevices.findIndex(d => d.deviceId === deviceId);

        if (deviceIndex !== -1) {
            // Update existing device info
            user.activeDevices[deviceIndex].lastActiveAt = new Date();
            user.activeDevices[deviceIndex].sessionToken = currentDevice.sessionToken;
            user.activeDevices[deviceIndex].ip = currentDevice.ip;
            await user.save();
        } else {
            // New device attempting to connect
            // Enterprise Lattice has 9999 limit, others are 2 or 5
            if (user.activeDevices.length >= user.maxDevices) {
                return res.status(403).json({
                    success: false,
                    code: 'DEVICE_LIMIT_EXCEEDED',
                    message: `Device limit reached (${user.maxDevices}). Please manage your devices at /dashboard/devices to continue.`,
                    maxDevices: user.maxDevices
                });
            }

            // Add new device
            user.activeDevices.push(currentDevice);
            await user.save();
        }

        next();
    } catch (error) {
        console.error('Device Enforcement Error:', error);
        next(); // Don't block the request if tracking fails, but log it
    }
};

module.exports = { deviceEnforcement };
