const mongoose = require('mongoose');
require('dotenv').config();
const Achievement = require('../models/Achievement');
const Badge = require('../models/Badge');

const seed = async () => {
    try {
        const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
        await mongoose.connect(DB);
        console.log('✅ Connected to MongoDB');

        const achievementSeeds = [
            { name: 'First Login', description: 'Log in for the first time', type: 'milestone', points: 10, icon: 'Users', criteria: { type: 'login_count', value: 1 } },
            { name: 'First Lab', description: 'Complete your first lab', type: 'milestone', points: 50, icon: 'CheckCircle', criteria: { type: 'labs_completed', value: 1 } },
            { name: 'Phishing Master', description: 'Complete all Phishing labs', type: 'mastery', points: 200, icon: 'Shield', criteria: { type: 'topic_completed', value: 'Phishing' } },
            { name: 'Quiz Whiz', description: 'Score 100% on 5 labs', type: 'performance', points: 150, icon: 'Zap', criteria: { type: 'perfect_scores', value: 5 } }
        ];

        const badgeSeeds = [
            { name: 'Vanguard', description: 'Complete 5 phishing labs without a single mistake.', type: 'technical', points: 100, icon: 'shield', criteria: { type: 'streak', value: 5, topic: 'phishing' } },
            { name: 'Swift Response', description: 'Complete a lab in under 2 minutes.', type: 'technical', points: 50, icon: 'clock', criteria: { type: 'time', value: 120 } },
            { name: 'Pathfinder', description: 'Complete all beginner-level training modules.', type: 'milestone', points: 150, icon: 'target', criteria: { type: 'level_mastery', value: 'beginner' } }
        ];

        for (const seed of achievementSeeds) {
            await Achievement.findOneAndUpdate({ name: seed.name }, seed, { upsert: true, new: true });
            console.log(`- Seeded Achievement: ${seed.name}`);
        }

        for (const seed of badgeSeeds) {
            await Badge.findOneAndUpdate({ name: seed.name }, seed, { upsert: true, new: true });
            console.log(`- Seeded Badge: ${seed.name}`);
        }

        console.log('✅ Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seed();
