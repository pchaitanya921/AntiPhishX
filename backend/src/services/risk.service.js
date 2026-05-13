const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

class RiskService {
    /**
     * Process an audit log event to update user behavioral profile
     */
    async processEvent(logEntry) {
        try {
            if (!logEntry.user) return;

            const user = await User.findById(logEntry.user);
            if (!user) return;

            // Initialize behavioral metadata if not present
            if (!user.behavioralProfile) {
                user.behavioralProfile = {
                    urgencySusceptibility: 0,
                    authoritySusceptibility: 0,
                    rewardSusceptibility: 0,
                    curiositySusceptibility: 0,
                    failureVelocity: 0,
                    lastFailureAt: null
                };
            }

            // Logic to update risk based on event type
            if (logEntry.eventType === 'PHISHING_CLICKED') {
                await this.handlePhishingClick(user, logEntry);
            } else if (logEntry.eventType === 'USER_LOGIN') {
                // Optional: Reduce risk slightly for active/engaged users
            }

            // Recalculate overall Risk Score (0-100)
            user.points = this.calculatePoints(user); // Map points to risk for now or add a riskScore field
            
            await user.save();
        } catch (error) {
            console.error('Risk Processing Error:', error);
        }
    }

    async handlePhishingClick(user, logEntry) {
        const details = logEntry.details || {};
        const templateType = details.templateType || 'generic';

        // Increment susceptibility based on template theme
        if (templateType.includes('urgent') || templateType.includes('reset')) {
            user.behavioralProfile.urgencySusceptibility += 10;
        }
        if (templateType.includes('executive') || templateType.includes('hr')) {
            user.behavioralProfile.authoritySusceptibility += 10;
        }
        if (templateType.includes('invoice') || templateType.includes('reward')) {
            user.behavioralProfile.rewardSusceptibility += 10;
        }

        // Increase failure velocity
        const now = new Date();
        if (user.behavioralProfile.lastFailureAt) {
            const timeSinceLast = (now - user.behavioralProfile.lastFailureAt) / (1000 * 60 * 60 * 24); // days
            if (timeSinceLast < 7) {
                user.behavioralProfile.failureVelocity += 20; // Rapid repeated failures
            }
        }

        user.behavioralProfile.lastFailureAt = now;
        
        // Cap values at 100
        ['urgencySusceptibility', 'authoritySusceptibility', 'rewardSusceptibility', 'curiositySusceptibility', 'failureVelocity'].forEach(dim => {
            if (user.behavioralProfile[dim] > 100) user.behavioralProfile[dim] = 100;
        });
    }

    calculatePoints(user) {
        // Simplified risk calculation logic
        const profile = user.behavioralProfile;
        const totalRisk = (
            profile.urgencySusceptibility + 
            profile.authoritySusceptibility + 
            profile.rewardSusceptibility + 
            profile.failureVelocity
        ) / 4;

        // Map to points (lower points = higher risk in this context? 
        // Or we should add a dedicated riskScore field to User model)
        return Math.max(0, 100 - totalRisk); 
    }
    /**
     * Process a lab submission to update HRI metrics
     */
    async processLabSubmission(userId, lab, submission) {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            // Initialize profile if missing
            if (!user.behavioralProfile) {
                user.behavioralProfile = {
                    urgencySusceptibility: 0,
                    authoritySusceptibility: 0,
                    rewardSusceptibility: 0,
                    curiositySusceptibility: 0,
                    fearSusceptibility: 0,
                    socialPressureSusceptibility: 0,
                    detectionSpeed: 0,
                    neutralizationAccuracy: 0,
                    failureVelocity: 0,
                    riskScore: 50,
                    domainExpertise: {
                        executive_intelligence: 0,
                        tactical_defense: 0,
                        cognitive_security: 0,
                        advanced_ai_adaptive: 0
                    }
                };
            }

            const { isCorrect, timeSpent, telemetry = {} } = submission;

            // 1. Update Domain Expertise
            const domain = lab.topic;
            if (isCorrect && user.behavioralProfile.domainExpertise[domain] !== undefined) {
                user.behavioralProfile.domainExpertise[domain] = Math.min(100, user.behavioralProfile.domainExpertise[domain] + 5);
            }

            // 2. Update Susceptibility based on Lab Scenario & Failure
            if (!isCorrect) {
                const vectors = lab.behavioralVectors || {};
                
                // Use behavioral vectors if available, fallback to title matching
                if (vectors.urgency > 0) user.behavioralProfile.urgencySusceptibility += (vectors.urgency || 8);
                else if (lab.title.toLowerCase().includes('urgency')) user.behavioralProfile.urgencySusceptibility += 8;

                if (vectors.authority > 0) user.behavioralProfile.authoritySusceptibility += (vectors.authority || 8);
                else if (lab.title.toLowerCase().includes('ceo') || lab.title.toLowerCase().includes('executive')) user.behavioralProfile.authoritySusceptibility += 8;

                if (vectors.reward > 0) user.behavioralProfile.rewardSusceptibility += (vectors.reward || 8);
                else if (lab.title.toLowerCase().includes('reward') || lab.title.toLowerCase().includes('financial')) user.behavioralProfile.rewardSusceptibility += 8;

                if (vectors.curiosity > 0) user.behavioralProfile.curiositySusceptibility += (vectors.curiosity || 8);
                else if (lab.title.toLowerCase().includes('curiosity') || lab.title.toLowerCase().includes('leak')) user.behavioralProfile.curiositySusceptibility += 8;

                if (vectors.fear > 0) user.behavioralProfile.fearSusceptibility += (vectors.fear || 8);
                else if (lab.title.toLowerCase().includes('fear') || lab.title.toLowerCase().includes('threat')) user.behavioralProfile.fearSusceptibility += 8;
                
                user.behavioralProfile.lastFailureAt = new Date();
                user.behavioralProfile.failureVelocity += 15;

                // 🔔 Trigger AI Vulnerability Warning if high susceptibility detected
                const notificationService = require('./notification.service');
                if (user.behavioralProfile.urgencySusceptibility > 70) {
                    await notificationService.securityAlert(userId, 'AI Risk: High Urgency Susceptibility', 'Your profile indicates a high vulnerability to urgency-based attacks. Recommended: Neural Hardening Lab 04.');
                }
                if (user.behavioralProfile.authoritySusceptibility > 70) {
                    await notificationService.securityAlert(userId, 'AI Risk: Authority Exploitation detected', 'Cognitive mapping shows authority figures can easily bypass your defense. Review Executive Intelligence modules.');
                }
            } else {
                // Decay susceptibility on success
                const decay = 2;
                user.behavioralProfile.urgencySusceptibility = Math.max(0, user.behavioralProfile.urgencySusceptibility - decay);
                user.behavioralProfile.authoritySusceptibility = Math.max(0, user.behavioralProfile.authoritySusceptibility - decay);
                user.behavioralProfile.failureVelocity = Math.max(0, user.behavioralProfile.failureVelocity - 5);
            }

            // 3. Update Detection Speed and Accuracy
            const currentSpeed = user.behavioralProfile.detectionSpeed || timeSpent;
            user.behavioralProfile.detectionSpeed = Math.round((currentSpeed * 0.7) + (timeSpent * 0.3));
            
            const currentAcc = user.behavioralProfile.neutralizationAccuracy || (isCorrect ? 100 : 0);
            user.behavioralProfile.neutralizationAccuracy = Math.round((currentAcc * 0.9) + ((isCorrect ? 100 : 0) * 0.1));

            // 4. Recalculate Risk Score
            user.behavioralProfile.riskScore = this.calculateHRIScore(user.behavioralProfile);

            await user.save();
            console.log(`[HRI] Updated profile for user ${userId}. New Risk Score: ${user.behavioralProfile.riskScore}`);
        } catch (error) {
            console.error('[HRI_ERROR] Risk processing failed:', error);
        }
    }

    calculateHRIScore(profile) {
        const susceptibilityRisk = (
            profile.urgencySusceptibility + 
            profile.authoritySusceptibility + 
            profile.rewardSusceptibility + 
            profile.curiositySusceptibility +
            profile.fearSusceptibility
        ) / 5;

        const skillFactor = (100 - profile.neutralizationAccuracy) * 0.4;
        const velocityFactor = profile.failureVelocity * 0.2;

        const totalRisk = (susceptibilityRisk * 0.4) + skillFactor + velocityFactor;
        return Math.min(100, Math.round(totalRisk));
    }
}

module.exports = new RiskService();
