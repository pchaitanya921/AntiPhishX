const fs = require('fs');
const path = require('path');
const vishing = require('./curriculum/vishing');

const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

levels.forEach(level => {
    vishing[level].forEach(lab => {
        // Add audioUrl if missing
        // Use a realistic path that we can serve or mock
        // backend/src/app.js serves '/uploads' -> '../uploads'
        // We will assume mp3s are stored there.
        if (!lab.artifacts.call) {
            lab.artifacts.call = {};
        }

        lab.artifacts.call.audioUrl = `/uploads/audio/vishing/${lab.id}.mp3`;

        // Ensure duration is present (default logic from previous step is fine, but good to ensure)
        if (!lab.artifacts.call.duration) {
            lab.artifacts.call.duration = 60;
        }
    });
});

const fileContent = `const vishing = ${JSON.stringify(vishing, null, 4)};\n\nmodule.exports = vishing;`;
fs.writeFileSync(path.join(__dirname, 'curriculum/vishing.js'), fileContent);
console.log('Successfully added audioUrl to vishing labs!');
