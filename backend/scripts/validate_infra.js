const mongoose = require('mongoose');
const IORedis = require('ioredis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function validateInfrastructure() {
    console.log('--- AntiPhishX Infrastructure Validation ---');
    
    // 1. MongoDB Check
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB: Connected successfully');
        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ MongoDB: Connection failed -', err.message);
    }

    // 2. Redis Check
    const redis = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 5000
    });

    try {
        await redis.ping();
        console.log('✅ Redis: Connected successfully');
        redis.disconnect();
    } catch (err) {
        console.error('❌ Redis: Connection failed -', err.message);
        console.log('   (Note: Ensure Redis is running on localhost:6379 for BullMQ)');
        redis.disconnect();
    }

    process.exit(0);
}

validateInfrastructure();
