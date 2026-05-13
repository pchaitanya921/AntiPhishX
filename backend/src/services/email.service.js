const nodemailer = require('nodemailer');

/**
 * Enterprise Email Service
 * Handles all outgoing platform communications
 */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
            port: process.env.EMAIL_PORT || 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    /**
     * Send professional enterprise email
     */
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: `${process.env.FROM_NAME || 'AntiPhishX Intelligence'} <${process.env.FROM_EMAIL || 'no-reply@antiphishx.ai'}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
                html: options.html || `<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #10B981; font-style: italic;">AntiPhishX Intelligence</h2>
                    <p style="color: #666; line-height: 1.6;">${options.message.replace(/\n/g, '<br>')}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">This is an automated transmission from the AntiPhishX Security Node.</p>
                </div>`
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email dispatched: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Email Dispatch Error:', error.message);
            // In production, we might want to retry or log this to a separate service
            return null;
        }
    }
}

module.exports = new EmailService();
