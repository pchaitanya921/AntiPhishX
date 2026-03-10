const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lab = require('../src/models/Lab');

const verifyVishing = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const lab = await Lab.findOne({ topic: 'vishing', level: 'beginner' });
        if (!lab) {
            console.error('No Vishing lab found!');
            process.exit(1);
        }

        console.log('Found Lab:', lab.title);
        console.log('Content Type:', typeof lab.content);

        let transcript;
        // Check legacy vs new structure location
        // The seed script puts artifacts into content.
        // My conversion script put transcript into artifacts.call.transcript

        if (lab.content.call && Array.isArray(lab.content.call.transcript)) {
            transcript = lab.content.call.transcript;
            console.log('✅ Structure Valid: content.call.transcript is Array');
        } else if (lab.content.transcript && Array.isArray(lab.content.transcript)) {
            transcript = lab.content.transcript;
            console.log('⚠️ Structure Valid but root: content.transcript is Array');
        } else {
            console.error('❌ Invalid Structure:', JSON.stringify(lab.content, null, 2));
            process.exit(1);
        }

        console.log('First Line:', transcript[0]);
        console.log('Duration:', lab.content.call?.duration || lab.content.duration);
        console.log('Audio URL:', lab.content.call?.audioUrl || 'MISSING');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyVishing();
