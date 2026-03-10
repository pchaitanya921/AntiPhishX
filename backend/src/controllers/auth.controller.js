const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role // Optional: For admin/instructor creation during dev
        });

        // Log Registration Success
        await SecurityLog.create({
            user: user._id,
            action: 'REGISTER_SUCCESS',
            severity: 'info',
            ipAddress: req.ip || req.connection.remoteAddress,
            details: { email, role }
        });

        const token = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        // Log Registration Failure
        await SecurityLog.create({
            action: 'REGISTER_FAILURE',
            severity: 'warning',
            ipAddress: req.ip || req.connection.remoteAddress,
            details: { email, error: err.message }
        });

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('User not found for email:', email);
            // Log Failed Login (User not found)
            await SecurityLog.create({
                action: 'LOGIN_FAILURE',
                severity: 'warning',
                ipAddress: req.ip || req.connection.remoteAddress,
                details: { email, reason: 'User not found' }
            });

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log('Password match result for', email, ':', isMatch);

        if (!isMatch) {
            // Log Failed Login (Password mismatch)
            await SecurityLog.create({
                user: user._id,
                action: 'LOGIN_FAILURE',
                severity: 'warning',
                ipAddress: req.ip || req.connection.remoteAddress,
                details: { email, reason: 'Invalid password' }
            });

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Log Login Success
        await SecurityLog.create({
            user: user._id,
            action: 'LOGIN_SUCCESS',
            severity: 'info',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            details: { email }
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        // Log Server Error during Login
        await SecurityLog.create({
            action: 'LOGIN_FAILURE',
            severity: 'error',
            ipAddress: req.ip || req.connection.remoteAddress,
            details: { email: req.body.email, error: err.message }
        });

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }

};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    // Log Logout
    if (req.user) {
        await SecurityLog.create({
            user: req.user.id,
            action: 'LOGOUT',
            severity: 'info',
            ipAddress: req.ip || req.connection.remoteAddress
        });
    }

    res.status(200).json({
        success: true,
        data: {}
    });
};

// @desc    Reset password - Development Mode
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and new password'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        console.log('Password reset for user:', email);

        res.status(200).json({
            success: true,
            message: 'Password has been reset. You can now login with your new password.'
        });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
};
