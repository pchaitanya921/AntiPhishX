const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../src/models/Course');

dotenv.config();

const neutralizeBranding = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx');
        console.log('✅ Connected to MongoDB');

        const courses = await Course.find({});
        let updateCount = 0;

        for (const course of courses) {
            let courseModified = false;

            for (const module of course.modules) {
                for (const video of module.videos) {
                    // Replace YouTube channel-like names or source
                    if (video.source && (video.source.toLowerCase().includes('youtube') || video.source.toLowerCase().includes('global'))) {
                        video.source = 'SECURE_NODE';
                        courseModified = true;
                    }

                    // Optional: You could also scan titles for specific strings if needed.
                }
            }

            if (courseModified) {
                await course.save();
                updateCount++;
            }
        }

        console.log(`✅ Neutralized branding in ${updateCount} courses.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during neutralization:', err);
        process.exit(1);
    }
};

neutralizeBranding();
