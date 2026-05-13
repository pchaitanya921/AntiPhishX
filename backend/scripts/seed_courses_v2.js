const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Course = require('../src/models/Course');
const Lab = require('../src/models/Lab');
const User = require('../src/models/User');

const DOMAINS = {
    EXECUTIVE_INTELLIGENCE: 'executive_intelligence',
    TACTICAL_DEFENSE: 'tactical_defense',
    COGNITIVE_SECURITY: 'cognitive_security',
    ADVANCED_AI_ADAPTIVE: 'advanced_ai_adaptive'
};

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find an admin user to set as instructor
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('❌ No admin user found. Please register an admin first.');
            process.exit(1);
        }

        console.log('🧹 Clearing existing courses...');
        await Course.deleteMany({});

        for (const domain of Object.values(DOMAINS)) {
            for (const level of LEVELS) {
                const domainName = domain.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const levelName = level.charAt(0).toUpperCase() + level.slice(1);
                
                const title = `${domainName} Mastery Track`;
                const description = `This professional ${levelName} track focuses on mastering ${domainName} through 25 interactive enterprise labs and specialized training modules.`;

                // Find the 25 labs for this domain and level
                const labs = await Lab.find({ topic: domain, level: level }).limit(25);
                const labIds = labs.map(l => l._id);

                console.log(`🚀 Creating Course: ${title} [${levelName}] with ${labIds.length} labs...`);

                await Course.create({
                    title: `${title} - ${levelName}`,
                    description,
                    category: domain,
                    level,
                    instructor: admin._id,
                    published: true,
                    duration: level === 'beginner' ? '5 hours' : (level === 'intermediate' ? '10 hours' : '15 hours'),
                    modules: [
                        {
                            title: "Core Objectives",
                            description: `Initial phase of the ${domainName} curriculum.`,
                            level: level,
                            labs: labIds
                        }
                    ]
                });
            }
        }

        console.log('✅ Successfully seeded 12 Learning Tracks!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
