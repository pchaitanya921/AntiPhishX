const Organization = require('../models/Organization');
const User = require('../models/User');
const PhishingCampaign = require('../models/PhishingCampaign');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Seed a high-fidelity Demo Organization with realistic historical telemetry
 */
exports.seedDemoOrganization = async (req, res) => {
    try {
        // Cleanup existing demo data
        await Organization.deleteMany({ name: /Demo/ });
        await User.deleteMany({ email: /cyberdyne-demo\.com/ });
        await AuditLog.deleteMany({ details: { $exists: true }, 'details.userAgent': 'Mozilla/5.0 (Demo)' });
        await PhishingCampaign.deleteMany({ name: /Demo/ });

        const demoId = new mongoose.Types.ObjectId();
        
        // 1. Create Demo Organization
        const org = await Organization.create({
            _id: demoId,
            name: 'CyberDyne Systems (Demo)',
            industry: 'Technology',
            scimEnabled: true,
            siemEnabled: true,
            siemWebhookUrl: 'https://webhook.site/demo-siem-endpoint',
            siemAuthToken: 'demo_token_' + crypto.randomBytes(8).toString('hex')
        });

        // 2. Create Demo Users across Departments
        const departments = ['Engineering', 'Finance', 'HR', 'Sales', 'IT'];
        const users = [];
        
        for (let dept of departments) {
            for (let i = 1; i <= 3; i++) {
                const user = await User.create({
                    firstName: `${dept.split(' ')[0]} User`,
                    lastName: i.toString(),
                    email: `${dept.toLowerCase().replace(' ', '.')}.${i}@cyberdyne-demo.com`,
                    password: 'demoPassword123!',
                    role: 'learner',
                    organization: demoId,
                    department: dept,
                    points: Math.floor(Math.random() * 100),
                    behavioralProfile: {
                        urgencySusceptibility: Math.floor(Math.random() * 80),
                        authoritySusceptibility: Math.floor(Math.random() * 80),
                        rewardSusceptibility: Math.floor(Math.random() * 80),
                        curiositySusceptibility: Math.floor(Math.random() * 80),
                        failureVelocity: Math.floor(Math.random() * 50)
                    }
                });
                users.push(user);
            }
        }

        // 3. Generate Historical Audit Logs for Analytics
        const eventTypes = ['PHISHING_CLICKED', 'USER_LOGIN', 'CAMPAIGN_LAUNCHED'];
        const logs = [];
        
        for (let user of users) {
            // Give each user 5-10 historical events
            const numEvents = Math.floor(Math.random() * 5) + 5;
            for (let j = 0; j < numEvents; j++) {
                const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                logs.push({
                    organization: demoId,
                    user: user._id,
                    eventType,
                    severity: eventType === 'PHISHING_CLICKED' ? 'HIGH' : 'LOW',
                    details: {
                        ip: '192.168.1.' + Math.floor(Math.random() * 255),
                        userAgent: 'Mozilla/5.0 (Demo)',
                        templateType: eventType === 'PHISHING_CLICKED' ? 'urgent_invoice' : null
                    },
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
                });
            }
        }
        await AuditLog.insertMany(logs);

        // 4. Create a "Historical" Phishing Campaign
        await PhishingCampaign.create({
            name: 'Q1 Security Audit (Demo)',
            organization: demoId,
            createdBy: users[0]._id,
            status: 'completed',
            templateType: 'AI_Adaptive',
            targets: users.map(u => ({
                user: u._id,
                email: u.email,
                status: Math.random() > 0.3 ? 'sent' : 'clicked',
                trackingToken: crypto.randomBytes(16).toString('hex')
            })),
            metrics: {
                emailsSent: users.length,
                linksClicked: Math.floor(users.length * 0.2),
                reported: Math.floor(users.length * 0.1)
            }
        });

        // 5. Create a specific Pavan user for the login hint
        await User.create({
            firstName: 'Pavan',
            lastName: 'Kumar',
            email: 'pavan@cyberdyne-demo.com',
            password: 'demoPassword123!',
            role: 'admin',
            organization: demoId,
            department: 'IT',
            points: 1000,
            behavioralProfile: {
                urgencySusceptibility: 10,
                authoritySusceptibility: 5,
                rewardSusceptibility: 2,
                curiositySusceptibility: 8,
                failureVelocity: 0
            }
        });

        res.status(201).json({
            success: true,
            message: 'Demo environment provisioned successfully.',
            data: {
                organizationId: demoId,
                loginHint: 'Use pavan@cyberdyne-demo.com / demoPassword123!'
            }
        });
    } catch (err) {
        console.error('Demo Seeding Error:', err);
        res.status(500).json({ success: false, message: 'Seeding failed' });
    }
};
