const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const Course = require('./backend/src/models/Course');

async function getTopicDetails() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const topics = await Course.find({}).lean();
        console.log('TOPIC_DATA_START');
        console.log(JSON.stringify(topics, null, 2));
        console.log('TOPIC_DATA_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getTopicDetails();
