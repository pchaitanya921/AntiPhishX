const crypto = require('crypto');
const PhishingCampaign = require('../models/PhishingCampaign');
const User = require('../models/User');
const { Resend } = require('resend');
const llmService = require('../services/llm.service');
const auditService = require('../services/audit.service');
const queueService = require('../services/queue.service');

// Initialize Resend with a dummy key for development if not present
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');

// Utility to generate a secure, url-safe token
const generateTrackingToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// @desc    Create a new phishing campaign
// @route   POST /api/campaigns
// @access  Private (Admin)
exports.createCampaign = async (req, res, next) => {
    try {
        const { name, templateType, targetDepartment } = req.body;

        if (!req.user.organization) {
            return res.status(400).json({ success: false, message: 'Admin must belong to an organization' });
        }

        // Find users in the organization to target
        let userQuery = { organization: req.user.organization._id };
        if (targetDepartment && targetDepartment !== 'All') {
            userQuery.department = targetDepartment;
        }
        
        const users = await User.find(userQuery);

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'No targets found for this criteria' });
        }

        // Generate targets with tracking tokens
        const targets = users.map(user => ({
            user: user._id,
            trackingToken: generateTrackingToken(),
            status: 'pending'
        }));

        const campaign = await PhishingCampaign.create({
            name,
            templateType,
            organization: req.user.organization._id,
            createdBy: req.user.id,
            targets
        });

        res.status(201).json({
            success: true,
            data: campaign
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Launch a phishing campaign (Send Emails)
// @route   POST /api/campaigns/:id/launch
// @access  Private (Admin)
exports.launchCampaign = async (req, res, next) => {
    try {
        const campaign = await PhishingCampaign.findById(req.params.id).populate('targets.user');
        
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        if (campaign.status !== 'draft') {
            return res.status(400).json({ success: false, message: 'Campaign has already been launched' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        // Use a generic from address or a specific testing domain
        const fromAddress = 'Security Team <security@testing.antiphishx.com>';

        // Determine if this is an AI Adaptive campaign
        const isAdaptive = campaign.templateType === 'AI_Adaptive';

        // 🔥 PRODUCTION REFACTOR: Offload all email dispatching to BullMQ
        for (let target of campaign.targets) {
            const user = target.user;
            const trackingLink = `${frontendUrl}/api/campaigns/track/${target.trackingToken}`;

            await queueService.addJob(queueService.QUEUE_NAMES.EMAIL_DELIVERY, {
                campaignId: campaign._id,
                targetId: target._id,
                to: user.email,
                from: isAdaptive ? 'Security Team <onboarding@resend.dev>' : fromAddress,
                trackingLink,
                isAdaptive,
                templateType: campaign.templateType,
                userContext: {
                    firstName: user.firstName,
                    department: user.department || 'Other',
                    points: user.points || 0
                }
            });

            target.status = 'queued';
        }

        campaign.status = 'active';
        campaign.launchedAt = Date.now();
        
        // This will trigger the pre('save') hook to update metrics
        await campaign.save();

        // Log campaign launch to SIEM
        await auditService.log({
            organizationId: campaign.organization,
            userId: req.user.id,
            eventType: 'CAMPAIGN_LAUNCHED',
            severity: 'LOW',
            details: { campaignId: campaign._id, name: campaign.name, targetCount: campaign.targets.length },
            req
        });

        res.status(200).json({
            success: true,
            message: `Campaign launched. Sent to ${campaign.metrics.emailsSent} targets.`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Track a link click from a phishing email
// @route   GET /api/campaigns/track/:token
// @access  Public
exports.trackClick = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Find the campaign that contains this token
        // Requires searching inside the targets array
        const campaign = await PhishingCampaign.findOne({ 'targets.trackingToken': token });

        if (!campaign) {
            // Either token is invalid or campaign was deleted.
            // Redirect to a generic safe page to avoid leaking information
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${frontendUrl}/invalid-link`);
        }

        // Find the specific target
        const target = campaign.targets.find(t => t.trackingToken === token);

        if (target && target.status !== 'clicked') {
            target.status = 'clicked';
            target.clickedAt = Date.now();
            target.ipAddress = req.ip || req.connection.remoteAddress;
            target.userAgent = req.get('User-Agent');
            
            await campaign.save(); // Updates metrics automatically via pre-save hook

            // 🔥 SIEM Event: Phishing Click Detected
            await auditService.log({
                organizationId: campaign.organization,
                userId: target.user,
                eventType: 'PHISHING_CLICKED',
                severity: 'HIGH',
                details: { 
                    campaignId: campaign._id, 
                    ip: target.ipAddress, 
                    userAgent: target.userAgent 
                },
                req
            });
        }

        // Redirect the user to the educational landing page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/simulation-result?campaign=${campaign._id}`);
    } catch (err) {
        console.error('Tracking Error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}`);
    }
};

// @desc    Get all campaigns for an organization
// @route   GET /api/campaigns
// @access  Private (Admin)
exports.getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await PhishingCampaign.find({ organization: req.user.organization._id })
            .sort('-createdAt');
            
        res.status(200).json({
            success: true,
            data: campaigns
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
