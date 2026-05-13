const queueService = require('../services/queue.service');
const llmService = require('../services/llm.service');
const { Resend } = require('resend');
const PhishingCampaign = require('../models/PhishingCampaign');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');

/**
 * Worker to handle Campaign Generation (AI Templates)
 */
queueService.registerWorker(queueService.QUEUE_NAMES.CAMPAIGN_GEN, async (job) => {
    const { campaignId, department, difficulty, companyName } = job.data;
    
    console.log(`[CampaignWorker] Generating AI template for ${department} - ${difficulty}`);
    
    const template = await llmService.generatePhishingEmail(department, difficulty, companyName);
    
    return template;
});

/**
 * Worker to handle Email Delivery
 */
queueService.registerWorker(queueService.QUEUE_NAMES.EMAIL_DELIVERY, async (job) => {
    const { to, from, subject: manualSubject, html: manualHtml, targetId, campaignId, isAdaptive, templateType, userContext, trackingLink } = job.data;
    
    try {
        let subject = manualSubject;
        let html = manualHtml;

        if (isAdaptive) {
            const { department, points, firstName } = userContext;
            const difficulty = points > 100 ? 'high' : (points > 50 ? 'medium' : 'beginner');
            
            // Try to get cached template from Redis (via queueService.connection)
            const cacheKey = `template:${department}:${difficulty}`;
            const redis = queueService.connection;
            let template;

            const cached = await redis.get(cacheKey);
            if (cached) {
                template = JSON.parse(cached);
            } else {
                template = await llmService.generatePhishingEmail(department, difficulty, 'AntiPhishX Corp');
                // Cache for 1 hour
                await redis.set(cacheKey, JSON.stringify(template), 'EX', 3600);
            }

            subject = template.subject;
            html = template.body.replace('{{TRACKING_LINK}}', trackingLink);
        } else if (!manualSubject) {
            // Logic for static templates (Simplified for worker)
            if (templateType === 'password_reset') {
                subject = 'URGENT: Password Reset Required';
                html = `<p>Hi ${userContext.firstName}, detected suspicious login. <a href="${trackingLink}">Reset Now</a></p>`;
            } else {
                subject = 'Security Update';
                html = `<p>Please review: <a href="${trackingLink}">View Update</a></p>`;
            }
        }

        await resend.emails.send({ from, to, subject, html });
        
        // Update target status in DB
        await PhishingCampaign.updateOne(
            { _id: campaignId, 'targets._id': targetId },
            { $set: { 'targets.$.status': 'sent' } }
        );
        
        console.log(`[EmailWorker] Email sent to ${to}`);
    } catch (err) {
        console.error(`[EmailWorker] Failed to send to ${to}:`, err.message);
        throw err; // BullMQ will handle retries
    }
});

module.exports = {
    // Workers are registered on import
};
