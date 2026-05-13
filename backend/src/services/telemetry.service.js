const UserBehavior = require('../models/UserBehavior');
const User = require('../models/User');
const Lab = require('../models/Lab');

class TelemetryService {
    /**
     * Process behavioral signals from a lab session
     * @param {string} userId 
     * @param {object} telemetryData 
     */
    async processSimulationTelemetry(userId, telemetryData) {
        try {
            let behavior = await UserBehavior.findOne({ user: userId });
            if (!behavior) {
                behavior = await UserBehavior.create({ user: userId });
            }

            const { 
                urgencySusceptibility, 
                authoritySusceptibility, 
                rewardSusceptibility, 
                curiositySusceptibility,
                fearSusceptibility,
                timeSpent,
                success
            } = telemetryData;

            // 1. Update Cognitive Vulnerability Map (Moving Average)
            const alpha = 0.3; // Smoothing factor
            if (urgencySusceptibility !== undefined) {
                behavior.cognitiveVulnerabilityMap.urgency = (1 - alpha) * behavior.cognitiveVulnerabilityMap.urgency + alpha * (urgencySusceptibility * 100);
            }
            if (authoritySusceptibility !== undefined) {
                behavior.cognitiveVulnerabilityMap.authority = (1 - alpha) * behavior.cognitiveVulnerabilityMap.authority + alpha * (authoritySusceptibility * 100);
            }
            if (rewardSusceptibility !== undefined) {
                behavior.cognitiveVulnerabilityMap.reward = (1 - alpha) * behavior.cognitiveVulnerabilityMap.reward + alpha * (rewardSusceptibility * 100);
            }
            
            // 2. Update Risk Score
            const vulnerabilityAvg = (
                behavior.cognitiveVulnerabilityMap.urgency + 
                behavior.cognitiveVulnerabilityMap.authority + 
                behavior.cognitiveVulnerabilityMap.reward
            ) / 3;
            
            behavior.riskScore = Math.round(vulnerabilityAvg);
            behavior.riskScoreHistory.push({ score: behavior.riskScore });

            // 3. AI Inference: Click Risk Probability
            // Simple heuristic for now, mimicking AI behavior
            behavior.aiInsights.clickRiskProbability = behavior.riskScore / 100;
            behavior.aiInsights.confidenceIndex = Math.min(0.95, behavior.aiInsights.confidenceIndex + 0.05);
            behavior.aiInsights.lastInferenceAt = Date.now();

            // 4. Generate Recommendations if risk is high
            if (behavior.riskScore > 60) {
                await this.generateRecommendations(behavior);
            }

            behavior.lastUpdated = Date.now();
            await behavior.save();

            // Sync risk score back to User model for quick access
            await User.findByIdAndUpdate(userId, {
                'behavioralProfile.riskScore': behavior.riskScore
            });

            return behavior;
        } catch (err) {
            console.error('Telemetry Processing Error:', err);
            throw err;
        }
    }

    /**
     * Generate AI-driven personalized recommendations
     */
    async generateRecommendations(behavior) {
        // Find weakest dimension
        const map = behavior.cognitiveVulnerabilityMap;
        const dimensions = [
            { name: 'urgency', score: map.urgency },
            { name: 'authority', score: map.authority },
            { name: 'reward', score: map.reward }
        ].sort((a, b) => b.score - a.score);

        const primaryWeakness = dimensions[0].name;

        // Recommendation Logic
        let rec = {
            title: '',
            description: '',
            reasoning: `AI detected high susceptibility to ${primaryWeakness}-based social engineering.`
        };

        switch (primaryWeakness) {
            case 'urgency':
                rec.title = 'Deep Calm Protocol';
                rec.description = 'Learn to identify artificial urgency cues in high-pressure vishing scenarios.';
                break;
            case 'authority':
                rec.title = 'Executive Verification Training';
                rec.description = 'Master the art of verifying identity for high-privilege requests.';
                break;
            default:
                rec.title = 'Incentive Analysis';
                rec.description = 'Critical evaluation of reward-based phishing lures.';
        }

        // Check if recommendation already exists to avoid duplicates
        const exists = behavior.personalRecommendations.some(r => r.title === rec.title);
        if (!exists) {
            behavior.personalRecommendations.unshift(rec);
            // Keep only latest 5
            if (behavior.personalRecommendations.length > 5) {
                behavior.personalRecommendations.pop();
            }
        }
    }
}

module.exports = new TelemetryService();
