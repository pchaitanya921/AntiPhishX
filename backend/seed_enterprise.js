const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const UserBehavior = require('./src/models/UserBehavior');

// Load env vars
dotenv.config();

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Sales', 'IT', 'Executive', 'Other'];
const MISTAKE_TYPES = [
    'trusted_fake_sender',
    'clicked_suspicious_link',
    'missed_urgency_cue',
    'failed_domain_verification',
    'downloaded_attachment'
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedEnterpriseData = async () => {
    try {
        console.log('Fetching users...');
        const users = await User.find({ role: 'learner' });
        
        for (const user of users) {
            // Assign random department
            const randomDept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
            user.department = randomDept;
            await user.save();

            // Create or update UserBehavior
            let behavior = await UserBehavior.findOne({ user: user._id });
            if (!behavior) {
                behavior = new UserBehavior({ user: user._id });
            }

            // Assign random risk score and performance metrics
            behavior.riskScore = Math.floor(Math.random() * 60) + 20; // 20-80
            behavior.detectionAccuracy = Math.floor(Math.random() * 50) + 40; // 40-90%
            behavior.averageResponseTime = Math.floor(Math.random() * 300) + 60; // 60-360s

            // Add random mistakes
            const numMistakes = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numMistakes; i++) {
                const mistakeType = MISTAKE_TYPES[Math.floor(Math.random() * MISTAKE_TYPES.length)];
                if (i === numMistakes - 1) {
                    await behavior.recordMistake(mistakeType);
                } else {
                    // Record without saving for intermediate steps
                    const existing = behavior.mistakes.find(m => m.mistakeType === mistakeType);
                    if (existing) {
                        existing.frequency += 1;
                        existing.lastSeen = Date.now();
                    } else {
                        behavior.mistakes.push({ mistakeType, frequency: 1, lastSeen: Date.now() });
                    }
                    behavior.totalFails += 1;
                }
            }
        }

        console.log(`Successfully seeded enterprise data for ${users.length} users!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedEnterpriseData();
