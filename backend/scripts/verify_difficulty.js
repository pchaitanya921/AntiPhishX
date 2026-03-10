const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lab = require('../src/models/Lab');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const labs = await Lab.find({}, 'title scenario description steps correctAnswer').limit(3);
        console.log('Sample Labs:', JSON.stringify(labs, null, 2));

        const count = await Lab.countDocuments();
        console.log('Total Labs:', count);

        const difficultyStats = await Lab.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log('Difficulty Distribution:', difficultyStats);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
