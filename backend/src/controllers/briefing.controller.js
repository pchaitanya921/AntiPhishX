const BriefingRequest = require('../models/BriefingRequest');
const auditService = require('../services/audit.service');
const emailService = require('../services/email.service');
const queueService = require('../services/queue.service');

// @desc    Create a new CISO briefing request
// @route   POST /api/briefings
// @access  Public
exports.createBriefingRequest = async (req, res, next) => {
    try {
        const {
            fullName,
            companyName,
            workEmail,
            companySize,
            jobRole,
            challenges,
            preferredDate,
            message
        } = req.body;

        // Check for existing pending request with same email
        const existing = await BriefingRequest.findOne({ workEmail, status: 'pending' });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending briefing request. Our team will contact you shortly.'
            });
        }

        const request = await BriefingRequest.create({
            fullName,
            companyName,
            workEmail,
            companySize,
            jobRole,
            challenges,
            preferredDate,
            message,
            user: req.user ? req.user.id : null,
            organization: req.user ? req.user.organization : null
        });

        // 🔥 Log Event
        await auditService.log({
            organizationId: req.user ? req.user.organization : null,
            userId: req.user ? req.user.id : null,
            eventType: 'ADMIN_CONFIG_CHANGE', // Re-using existing type or could add 'BRIEFING_REQUESTED'
            severity: 'LOW',
            details: { 
                action: 'BRIEFING_REQUESTED',
                company: companyName,
                email: workEmail 
            },
            req
        });

        // 📧 Queue Email Notifications (Async)
        try {
            // To Admin
            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                email: process.env.ADMIN_EMAIL || 'admin@antiphishx.ai',
                subject: `🚀 New CISO Briefing Request: ${companyName}`,
                message: `A new executive briefing has been requested by ${fullName} from ${companyName}.\n\nRole: ${jobRole}\nCompany Size: ${companySize}\nEmail: ${workEmail}\n\nView details in the admin dashboard.`
            });

            // To Requester (Confirmation)
            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                email: workEmail,
                subject: 'Your AntiPhishX Executive Intelligence Briefing Request',
                message: `Hello ${fullName},\n\nYour request for an Executive Intelligence Briefing has been received. Our security intelligence team is reviewing your requirements and will contact you shortly to confirm the session for ${new Date(preferredDate).toLocaleDateString()}.\n\nResilience starts here.\n\nThe AntiPhishX Team`
            });
        } catch (emailErr) {
            console.error('Failed to queue briefing notifications:', emailErr.message);
        }

        res.status(201).json({
            success: true,
            data: request,
            message: 'Executive Briefing Request Submitted. Our security intelligence team will contact you shortly.'
        });
    } catch (err) {
        console.error('Briefing Request Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to process briefing request. Please try again or contact support.'
        });
    }
};

// @desc    Get all briefing requests (Admin only)
// @route   GET /api/briefings
// @access  Private/Admin
exports.getBriefingRequests = async (req, res, next) => {
    try {
        const requests = await BriefingRequest.find()
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName email');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update briefing request status
// @route   PUT /api/briefings/:id
// @access  Private/Admin
exports.updateBriefingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const request = await BriefingRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
