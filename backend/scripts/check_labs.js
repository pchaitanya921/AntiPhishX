const mongoose = require('mongoose');
const Lab = require('../src/models/Lab');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkLabs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const labCounts = await Lab.aggregate([
            { $group: { _id: { topic: "$topic", level: "$level" }, count: { $sum: 1 } } }
        ]);

        console.log('Lab Distribution:');
        labCounts.forEach(lc => {
            console.log(`- Topic: ${lc._id.topic}, Level: ${lc._id.level}, Count: ${lc.count}`);
        });

        const total = await Lab.countDocuments();
        console.log('Total Labs:', total);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLabs();
