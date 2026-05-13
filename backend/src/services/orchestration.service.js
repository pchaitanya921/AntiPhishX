const Lab = require('../models/Lab');
const UserBehavior = require('../models/UserBehavior');
const UserProgress = require('../models/UserProgress');
const mongoose = require('mongoose');

class AdaptiveOrchestrationService {
    /**
     * Get the next recommended lab for a user based on their AI profile
     */
    async getNextRecommendedLab(userId) {
        try {
            const behavior = await UserBehavior.findOne({ user: userId });
            if (!behavior) {
                // Return a basic introductory lab if no behavior profile exists yet
                return await Lab.findOne({ level: 'beginner', status: 'published' }).sort({ createdAt: 1 });
            }

            // 1. Identify the highest risk dimension
            const map = behavior.cognitiveVulnerabilityMap;
            const dimensions = [
                { name: 'urgency', score: map.urgency },
                { name: 'authority', score: map.authority },
                { name: 'reward', score: map.reward },
                { name: 'curiosity', score: map.curiosity },
                { name: 'fear', score: map.fear }
            ].sort((a, b) => b.score - a.score);

            const primaryWeakness = dimensions[0];
            
            // 2. Find published labs that target this weakness
            // We look for labs where the behavioralVector for that weakness is > 0
            const queryField = `behavioralVectors.${primaryWeakness.name}`;
            
            // 3. Exclude already completed labs with good scores
            const completedLabs = await UserProgress.find({ 
                user: userId, 
                completed: true, 
                score: { $gte: 80 } 
            }).distinct('lab');

            let recommendedLab = await Lab.findOne({
                _id: { $nin: completedLabs },
                status: 'published',
                [queryField]: { $gt: 5 } // Significant focus on the weakness
            }).sort({ difficulty: 1 });

            // 4. Fallback if no specific lab matches or all are completed
            if (!recommendedLab) {
                recommendedLab = await Lab.findOne({
                    _id: { $nin: completedLabs },
                    status: 'published'
                }).sort({ difficulty: 1 });
            }

            return recommendedLab;
        } catch (err) {
            console.error('Orchestration Recommendation Error:', err);
            throw err;
        }
    }

    /**
     * Get Neural Training Roadmap data
     */
    async getNeuralRoadmap(userId) {
        try {
            const [behavior, progress] = await Promise.all([
                UserBehavior.findOne({ user: userId }),
                UserProgress.find({ user: userId }).populate('lab')
            ]);

            if (!behavior) return { status: 'initializing', steps: [] };

            const map = behavior.cognitiveVulnerabilityMap;
            const recommendations = behavior.personalRecommendations || [];
            
            // Construct a roadmap based on risk profile
            const roadmapSteps = [
                {
                    id: 'current_posture',
                    title: 'Current Neural Posture',
                    status: 'active',
                    score: behavior.riskScore,
                    metrics: map
                }
            ];

            // Add upcoming recommendations as future steps
            recommendations.forEach((rec, i) => {
                roadmapSteps.push({
                    id: `rec_${i}`,
                    title: rec.title,
                    description: rec.description,
                    status: i === 0 ? 'prioritized' : 'queued',
                    reasoning: rec.reasoning,
                    type: 'adaptive_module'
                });
            });

            // Add completed milestones
            const milestones = progress.filter(p => p.completed && p.score >= 90).slice(0, 3);
            milestones.forEach(m => {
                roadmapSteps.unshift({
                    id: `milestone_${m._id}`,
                    title: m.lab?.title || 'Unknown Lab',
                    status: 'mastered',
                    date: m.updatedAt
                });
            });

            return {
                riskScore: behavior.riskScore,
                confidenceIndex: behavior.aiInsights?.confidenceIndex || 0,
                roadmap: roadmapSteps,
                forecast: this.calculateResilienceForecast(behavior)
            };
        } catch (err) {
            console.error('Neural Roadmap Generation Error:', err);
            throw err;
        }
    }

    calculateResilienceForecast(behavior) {
        // Simple linear projection for demonstration
        const score = behavior.riskScore;
        return {
            projection30Days: Math.max(0, score - 15),
            confidence: behavior.aiInsights?.confidenceIndex || 0,
            trend: 'improving'
        };
    }
}

module.exports = new AdaptiveOrchestrationService();
