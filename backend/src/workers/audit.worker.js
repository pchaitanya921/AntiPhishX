const queueService = require('../services/queue.service');
const auditService = require('../services/audit.service');
const riskService = require('../services/risk.service');
const Organization = require('../models/Organization');
const AuditLog = require('../models/AuditLog');

/**
 * Worker to handle SIEM Dispatching
 */
queueService.registerWorker(queueService.QUEUE_NAMES.SIEM_DISPATCH, async (job) => {
    const { logId, organizationId } = job.data;
    
    const logEntry = await AuditLog.findById(logId);
    const org = await Organization.findById(organizationId).select('+siemAuthToken');
    
    if (logEntry && org && org.siemEnabled) {
        await auditService.dispatchToSiem(logEntry, org);
    }
});

/**
 * Worker to handle Behavioral Risk Score Updates
 */
queueService.registerWorker(queueService.QUEUE_NAMES.RISK_UPDATE, async (job) => {
    const { logId } = job.data;
    const logEntry = await AuditLog.findById(logId);
    
    if (logEntry) {
        await riskService.processEvent(logEntry);
    }
});

module.exports = {};
