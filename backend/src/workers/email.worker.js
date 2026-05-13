const queueService = require('../services/queue.service');
const emailService = require('../services/email.service');

/**
 * Enterprise Email Worker
 * Processes background email delivery tasks
 */
const emailWorker = queueService.registerWorker(
    queueService.QUEUE_NAMES.EMAIL_DELIVERY,
    async (job) => {
        const { email, subject, message, html } = job.data;
        
        console.log(`[EmailWorker] Processing transmission for node: ${email}`);
        
        const result = await emailService.sendEmail({
            email,
            subject,
            message,
            html
        });

        if (!result) {
            throw new Error(`Email delivery failure to node: ${email}`);
        }

        return { success: true, messageId: result.messageId };
    }
);

module.exports = emailWorker;
