const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lab = require('../src/models/Lab');

const debugDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check Phishing
        const phishingCount = await Lab.countDocuments({ topic: 'phishing' });
        console.log(`Phishing Labs: ${phishingCount}`);

        const phishingExample = await Lab.findOne({ topic: 'phishing' });
        if (phishingExample) {
            console.log('Phishing Example Type:', phishingExample.type);
            console.log('Phishing Example Status:', phishingExample.status);
        }

        // Check Malware
        const malwareCount = await Lab.countDocuments({ topic: 'malware_detection' });
        console.log(`Malware Labs: ${malwareCount}`);

        const malwareExample = await Lab.findOne({ topic: 'malware_detection' });
        if (malwareExample) {
            console.log('Malware Example Type:', malwareExample.type);
            console.log('Malware Example Status:', malwareExample.status);
        }

        // Check Legacy "text" types
        const invalidTypeCount = await Lab.countDocuments({ type: 'text' });
        console.log(`Invalid 'text' Type Labs: ${invalidTypeCount}`);

        process.exit(0);
    } catch (err) {
        console.error('DB Error:', err);
        process.exit(1);
    }
};

debugDB();
