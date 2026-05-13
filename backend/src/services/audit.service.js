const AuditLog = require('../models/AuditLog');
const Organization = require('../models/Organization');
const axios = require('axios');
const crypto = require('crypto');

class AuditService {
    /**
     * Log an event and dispatch to SIEM if enabled
     */
    async log(data) {
        try {
            const { 
                organizationId, 
                userId, 
                eventType, 
                severity = 'LOW', 
                details = {}, 
                req 
            } = data;

            // 1. Create the Audit Log entry
            const logEntry = await AuditLog.create({
                organization: organizationId,
                user: userId,
                eventType,
                severity,
                details,
                ipAddress: req ? req.ip : '0.0.0.0',
                userAgent: req ? req.headers['user-agent'] : 'System',
                correlationId: crypto.randomUUID()
            });

            // 2. Check if SIEM is enabled for this organization
            const org = await Organization.findById(organizationId).select('+siemAuthToken');
            
            // 🔥 Async: Offload SIEM dispatch and Risk scoring to workers
            const queueService = require('./queue.service');
            
            if (org && org.siemEnabled && org.siemWebhookUrl) {
                await queueService.addJob(queueService.QUEUE_NAMES.SIEM_DISPATCH, { 
                    logId: logEntry._id, 
                    organizationId: org._id 
                });
            }

            // Always update risk score asynchronously
            await queueService.addJob(queueService.QUEUE_NAMES.RISK_UPDATE, { 
                logId: logEntry._id 
            });

            return logEntry;
        } catch (error) {
            console.error('Audit Logging Error:', error);
        }
    }

    /**
     * Dispatch event to external SIEM webhook
     */
    async dispatchToSiem(logEntry, org) {
        try {
            const payload = {
                v: '1.0',
                event_id: logEntry._id,
                tenant_id: org._id,
                event_type: logEntry.eventType,
                severity: logEntry.severity,
                timestamp: logEntry.timestamp,
                user_id: logEntry.user,
                details: logEntry.details,
                correlation_id: logEntry.correlationId,
                source: 'AntiPhishX-Platform'
            };

            // Sign the payload if needed (Security Requirement)
            const signature = org.siemAuthToken 
                ? crypto.createHmac('sha256', org.siemAuthToken).update(JSON.stringify(payload)).digest('hex')
                : null;

            const headers = {
                'Content-Type': 'application/json',
                'X-AntiPhishX-Signature': signature,
                'X-AntiPhishX-Event': logEntry.eventType
            };

            await axios.post(org.siemWebhookUrl, payload, { headers, timeout: 5000 });
            
            // Mark as delivered
            await AuditLog.findByIdAndUpdate(logEntry._id, { siemDelivered: true });
        } catch (error) {
            console.error(`SIEM Dispatch Failed for Org ${org._id}:`, error.message);
        }
    }
}

module.exports = new AuditService();
