const EnterpriseRequest = require('../models/EnterpriseRequest');
const Organization = require('../models/Organization');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const queueService = require('../services/queue.service');
const auditService = require('../services/audit.service');
const notificationService = require('../services/notification.service');
const crypto = require('crypto');

// @desc    Create a new enterprise request (pilot/consultation)
// @route   POST /api/enterprise/request
// @access  Public
exports.createEnterpriseRequest = async (req, res, next) => {
    try {
        const {
            type,
            fullName,
            companyName,
            workEmail,
            teamSize,
            industry,
            deploymentInterest,
            securityChallenges,
            currentStack,
            requirements,
            siemSsoInterest,
            message
        } = req.body;

        // Check for existing pending request of same type with same email
        const existing = await EnterpriseRequest.findOne({ workEmail, type, status: 'pending' });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `You already have a pending ${type} request. Our architects will contact you shortly.`
            });
        }

        const request = await EnterpriseRequest.create({
            type,
            fullName,
            companyName,
            workEmail,
            teamSize,
            industry,
            deploymentInterest,
            securityChallenges,
            currentStack,
            requirements,
            siemSsoInterest,
            message,
            user: req.user ? req.user.id : null,
            organization: req.user ? req.user.organization : null
        });

        // 🔥 Log Event
        await auditService.log({
            organizationId: req.user ? req.user.organization : null,
            userId: req.user ? req.user.id : null,
            eventType: 'ADMIN_CONFIG_CHANGE', 
            severity: 'LOW',
            details: { 
                action: 'ENTERPRISE_REQUEST',
                type,
                company: companyName,
                email: workEmail 
            },
            req
        });

        // 📧 Queue Email Notifications (Async)
        try {
            let subjectPrefix = '🏛 New Enterprise Inquiry';
            if (type === 'pilot') subjectPrefix = '🚀 New Pilot Request';
            if (type === 'demo') subjectPrefix = '📺 New Product Demo Request';
            if (type === 'architecture') subjectPrefix = '🏛 New Architecture Consultation';
            
            // To Admin
            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                email: process.env.ADMIN_EMAIL || 'admin@antiphishx.ai',
                subject: `${subjectPrefix}: ${companyName}`,
                message: `A new ${type} request has been received from ${fullName} at ${companyName}.\n\nIndustry: ${industry}\nEmail: ${workEmail}\n\nView details in the admin command center.`
            });

            // To Requester (Confirmation)
            let confirmationSubject = `Initializing your AntiPhishX ${type === 'pilot' ? 'Pilot' : 'Consultation'}`;
            if (type === 'demo') confirmationSubject = 'Scheduling your AntiPhishX Product Demonstration';

            let confirmationMessage = `Hello ${fullName},\n\nYour request for an AntiPhishX ${type === 'pilot' ? 'Free Pilot' : type === 'demo' ? 'Product Demonstration' : 'Architecture Consultation'} has been received and prioritized. Our security architects are reviewing your requirements and will contact you within 12 hours to initialize the next phase.\n\nResilience starts here.\n\nThe AntiPhishX Enterprise Team`;

            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                email: workEmail,
                subject: confirmationSubject,
                message: confirmationMessage
            });
        } catch (emailErr) {
            console.error('Failed to queue enterprise notifications:', emailErr.message);
        }

        let responseMessage = `${type === 'pilot' ? 'Pilot Request' : type === 'demo' ? 'Demo Request' : 'Consultation'} Initialized. Your AntiPhishX deployment consultation has been scheduled.`;

        res.status(201).json({
            success: true,
            data: request,
            message: responseMessage
        });
    } catch (err) {
        console.error('Enterprise Request Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize request. Please verify uplink integrity.'
        });
    }
};

// @desc    Get all enterprise requests (Admin only)
// @route   GET /api/enterprise/requests
// @access  Private/Admin
exports.getEnterpriseRequests = async (req, res, next) => {
    try {
        const requests = await EnterpriseRequest.find()
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

// @desc    Update enterprise request status
// @route   PUT /api/enterprise/requests/:id
// @access  Private/Admin
exports.updateEnterpriseRequestStatus = async (req, res, next) => {
    try {
        const { status, scheduledAt } = req.body;
        
        const updateData = { status };
        if (scheduledAt) updateData.scheduledAt = scheduledAt;

        const request = await EnterpriseRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // 📧 Queue Status Update Email (Async)
        try {
            let userSubject = '';
            let userMessage = '';

            if (status === 'contacted') {
                userSubject = `AntiPhishX Status Update: Connection Established`;
                userMessage = `Hello ${request.fullName},\n\nOur enterprise architects have successfully processed your ${request.type} request. One of our product specialists will be reaching out via this email shortly to discuss your specific human-risk intelligence requirements.\n\nThe AntiPhishX Enterprise Team`;
            } else if (status === 'scheduled') {
                const formattedDate = request.scheduledAt ? new Date(request.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : 'TBD';
                userSubject = `AntiPhishX: Your ${request.type === 'demo' ? 'Product Demonstration' : 'Pilot Launch'} is Scheduled`;
                userMessage = `Hello ${request.fullName},\n\nGreat news! Your ${request.type} for ${request.companyName} has been officially scheduled for:\n\n📅 ${formattedDate}\n\nPlease check your calendar for the meeting invite or await further instructions from your assigned architect.\n\nThe AntiPhishX Enterprise Team`;
            } else if (status === 'completed') {
                userSubject = `AntiPhishX: ${request.type === 'demo' ? 'Demonstration' : 'Pilot Session'} Finalized`;
                userMessage = `Hello ${request.fullName},\n\nThank you for exploring the AntiPhishX platform. Your ${request.type} session has been marked as complete. We have attached the initial behavioral analysis to your internal account (if applicable) or will follow up with the next steps for your organizational scaling.\n\nThe AntiPhishX Enterprise Team`;
            }

            if (userSubject && userMessage) {
                await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                    email: request.workEmail,
                    subject: userSubject,
                    message: userMessage
                });
            }
        } catch (emailErr) {
            console.error('Failed to queue status update notification:', emailErr.message);
        }

        // 🛡️ Audit Logging
        await auditService.log({
            userId: req.user._id,
            eventType: 'ENTERPRISE_LEAD_STATUS_UPDATE',
            severity: 'INFO',
            details: { requestId: request._id, oldStatus: request.status, newStatus: status },
            req
        });

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Convert an enterprise request into an active pilot (Create Org & Admin)
// @route   POST /api/enterprise/requests/:id/convert-to-pilot
// @access  Private/Admin
exports.convertRequestToPilot = async (req, res, next) => {
    try {
        const request = await EnterpriseRequest.findById(req.params.id);

        if (!request) {
            return next(new ErrorResponse('Request not found', 404));
        }

        if (request.status === 'pilot_active' || request.status === 'completed') {
            return next(new ErrorResponse('Request already converted to active pilot', 400));
        }

        // Check if organization already exists
        const existingOrg = await Organization.findOne({ name: request.companyName });
        if (existingOrg) {
            return next(new ErrorResponse(`Organization '${request.companyName}' already exists in the system architecture.`, 400));
        }

        // 1. Create Enterprise Organization
        const org = await Organization.create({
            name: request.companyName,
            industry: request.industry || 'Other',
            size: request.teamSize || '1-50',
            contactEmail: request.workEmail,
            isActive: true,
            plan: 'enterprise_lattice',
            pilotStatus: 'active',
            pilotExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30-day pilot
        });

        // 2. Create Enterprise Admin Account
        const tempPassword = crypto.randomBytes(10).toString('hex');
        const [firstName, ...lastNameParts] = request.fullName.split(' ');
        const lastName = lastNameParts.join(' ') || 'Admin';

        // Provision user with enterprise_lattice plan and admin role
        const user = await User.create({
            firstName,
            lastName,
            email: request.workEmail,
            password: tempPassword,
            role: 'enterprise_admin',
            organization: org._id,
            isEmailVerified: true,
            currentPlan: 'enterprise_lattice',
            subscriptionStatus: 'active',
            planActivatedAt: new Date(),
            planExpiresAt: org.pilotExpiresAt,
            maxDevices: 9999, // Enterprise unlimited
            // Initialize Behavioral Profile
            behavioralProfile: {
                riskScore: 50,
                urgencySusceptibility: 0,
                authoritySusceptibility: 0,
                rewardSusceptibility: 0,
                curiositySusceptibility: 0,
                fearSusceptibility: 0
            }
        });

        // 3. Update Request Status (CONTACTED -> SCHEDULED -> PILOT ACTIVE)
        request.status = 'pilot_active';
        await request.save();

        // 4. Send Advanced Onboarding Email with Credentials (Non-blocking)
        try {
            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                email: request.workEmail,
                subject: `🚀 [ACTION REQUIRED] Your AntiPhishX Enterprise Pilot is LIVE`,
                message: `Hello ${request.fullName},\n\nWelcome to the next generation of human-risk intelligence. Your Enterprise Lattice pilot environment for ${org.name} has been successfully provisioned.\n\n━━━━━━━━━━━━━━━━━━━━━━━\nPROVISIONING DETAILS\n━━━━━━━━━━━━━━━━━━━━━━━\n\n🌐 ACCESS NODE: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login\n📧 COMMANDER ID: ${request.workEmail}\n🔑 ACCESS KEY: ${tempPassword}\n🛡️ ENVIRONMENT: Enterprise Lattice (Pilot Mode)\n📅 EXPIRY: ${org.pilotExpiresAt.toLocaleDateString()}\n\n━━━━━━━━━━━━━━━━━━━━━━━\nUNLOCKED CAPABILITIES\n━━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Executive Risk Intelligence Dashboard\n✅ AI-Adaptive Phishing Simulations\n✅ Departmental Behavioral Heatmaps\n✅ SCIM & SIEM Integration Suite\n✅ Full Certification Catalog\n\nPlease initialize your command center by logging in and resetting your access key.\n\nResilience starts today.\n\nThe AntiPhishX Enterprise Operations Team`
            });
        } catch (emailErr) {
            console.error('[PILOT_EMAIL_QUEUE_ERROR]', emailErr.message);
            // Non-critical failure, proceed with response
        }

        // 5. 🔥 Log Production Audit Event
        await auditService.log({
            userId: req.user._id,
            eventType: 'CERTIFICATE_ISSUED', // Using a significant event type or map to a new one
            severity: 'HIGH',
            details: { 
                action: 'ENTERPRISE_PILOT_INITIALIZED',
                requestId: request._id, 
                orgId: org._id, 
                userId: user._id, 
                company: org.name,
                plan: 'enterprise_lattice'
            },
            req
        });

        // 6. 🔔 Notify Admin
        await notificationService.enterpriseAlert(
            req.user._id,
            'Enterprise Pilot Initialized',
            `Architecture deployed for ${org.name}. Commander account ${request.workEmail} is now active.`,
            '/admin/enterprise'
        );

        res.status(200).json({
            success: true,
            message: 'Enterprise Pilot Environment Initialized Successfully',
            data: {
                organizationId: org._id,
                pilotId: org._id,
                adminId: user._id,
                expiresAt: org.pilotExpiresAt,
                status: 'pilot_active'
            }
        });
    } catch (err) {
        console.error('[PILOT_INITIALIZATION_ERROR]', err);
        next(err);
    }
};

// @desc    Get enterprise-wide analytics (Admin only)
// @route   GET /api/admin/enterprise/analytics
// @access  Private/Admin
exports.getEnterpriseAnalytics = async (req, res, next) => {
    try {
        const totalRequests = await EnterpriseRequest.countDocuments();
        const pilotRequests = await EnterpriseRequest.countDocuments({ type: 'pilot' });
        const consultationRequests = await EnterpriseRequest.countDocuments({ type: 'consultation' });
        
        const statusBreakdown = await EnterpriseRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const industryStats = await EnterpriseRequest.aggregate([
            { $group: { _id: '$industry', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    total: totalRequests,
                    pilots: pilotRequests,
                    consultations: consultationRequests
                },
                statusBreakdown,
                industryStats
            }
        });
    } catch (err) {
        console.error('Enterprise Analytics Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
