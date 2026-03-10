require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Lab = require('../src/models/Lab');

const migrateLabs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all labs that don't have a status or have status null
        const result = await Lab.updateMany(
            { $or: [{ status: { $exists: false } }, { status: null }] },
            { $set: { status: 'published' } }
        );

        console.log(`Matched ${result.matchedCount} labs.`);
        console.log(`Modified ${result.modifiedCount} labs to 'published' status.`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateLabs();
