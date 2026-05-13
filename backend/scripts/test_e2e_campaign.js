const mongoose = require('mongoose');
const Organization = require('../src/models/Organization');
const User = require('../src/models/User');
const PhishingCampaign = require('../src/models/PhishingCampaign');
const AuditLog = require('../src/models/AuditLog');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testE2ECampaign() {
    console.log('--- AntiPhishX E2E Simulation Test ---');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 1. Get Demo Org & User
        const org = await Organization.findOne({ name: /CyberDyne/ });
        const user = await User.findOne({ email: 'pavan@cyberdyne-demo.com' });
        
        if (!org || !user) {
            console.error('❌ Demo data not found. Please seed first.');
            process.exit(1);
        }

        console.log(`📍 Testing with Org: ${org.name}, User: ${user.email}`);

        // 2. Create a test campaign
        const campaign = await PhishingCampaign.create({
            name: 'E2E Validation Campaign',
            organization: org._id,
            createdBy: user._id,
            templateType: 'urgent_invoice',
            status: 'active',
            targets: [{
                user: user._id,
                email: user.email,
                status: 'sent',
                trackingToken: 'e2e-test-token-' + Date.now()
            }]
        });
        console.log('✅ Campaign Created: active');

        // 3. Simulate a Click (Manually calling the logic that would be hit by the tracking endpoint)
        const target = campaign.targets[0];
        console.log(`🖱️ Simulating click for token: ${target.trackingToken}`);
        
        // We need to simulate the tracking logic. 
        // Instead of calling the controller (which needs req/res), we'll do what the controller does:
        
        // Find target in campaign
        const targetInCampaign = campaign.targets.find(t => t.trackingToken === target.trackingToken);
        if (!targetInCampaign) {
            throw new Error(`Target not found for token: ${target.trackingToken}`);
        }
        targetInCampaign.status = 'clicked';
        targetInCampaign.clickedAt = new Date();
        await campaign.save();
        console.log('✅ Campaign Target updated to "clicked"');

        // Trigger Audit Log (What RiskService/AuditService would do)
        const newLog = await AuditLog.create({
            organization: org._id,
            user: user._id,
            eventType: 'PHISHING_CLICKED',
            severity: 'HIGH',
            details: {
                campaignId: campaign._id,
                templateType: campaign.templateType,
                trackingToken: target.trackingToken
            },
            ipAddress: '127.0.0.1',
            userAgent: 'E2E-Validation-Script'
        });
        console.log('✅ Audit Log created: PHISHING_CLICKED');

        // Update Risk Profile (Mocking RiskService.processEvent)
        const updatedUser = await User.findById(user._id);
        updatedUser.behavioralProfile.urgencySusceptibility += 5;
        updatedUser.behavioralProfile.failureVelocity += 1;
        await updatedUser.save();
        console.log(`✅ User Risk Profile updated. New Urgency Susceptibility: ${updatedUser.behavioralProfile.urgencySusceptibility}`);

        console.log('\n--- E2E Simulation Success ---');
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ E2E Test Failed:', err);
        process.exit(1);
    }
}

testE2ECampaign();
