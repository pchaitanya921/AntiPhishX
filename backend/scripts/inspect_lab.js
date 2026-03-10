const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lab = require('../src/models/Lab');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
console.log('Loading .env from:', path.join(__dirname, '../.env'));

const inspectLab = async () => {
    try {
        // Use 127.0.0.1 for local connection if MONGO_URI is not set correctly
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/antiphishx';
        console.log('Connecting to MongoDB at:', mongoURI);
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');

        const labId = '69776f24861effdaf992ec71'; // ID from the screenshot URL
        // If the ID is not a valid ObjectId, we might need to search by title or just list all labs to find it.
        // However, let's try to query by ID first.

        // Note: The ID in the URL '69776f24861effdaf992ec71' looks like a valid 24-char hex string.

        const lab = await Lab.findById(labId);

        if (!lab) {
            console.log('Lab not found with ID:', labId);
            // List all labs to see what we have
            const labs = await Lab.find({}, 'title type content');
            console.log('Available Labs:', JSON.stringify(labs, null, 2));
        } else {
            console.log('Lab Found:', lab.title);
            console.log('Type:', lab.type);
            console.log('Content Structure:', JSON.stringify(lab.content, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

inspectLab();
