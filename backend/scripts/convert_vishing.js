const fs = require('fs');
const path = require('path');
const vishing = require('./curriculum/vishing');

function convertTranscript(text) {
    if (!text) return [];

    // Split by common delimiters or newlines if present, 
    // otherwise try to find "Name:" patterns
    // Simple heuristic: Split by sentences or specific patterns

    // For this specific dataset, transcripts are often single strings like:
    // "Operator: Hello... We need to..."
    // or
    // "Caller: Grandma? It's me... I got arrested..."

    // We will attempt to split by sentences for better "pacing" in the player
    const sentences = text.match(/[^.!?]+[.!?]+]*/g) || [text];

    let currentTime = 2; // Start at 2 seconds
    const structured = sentences.map((sentence, index) => {
        let speaker = "Caller";
        let cleanText = sentence.trim();

        // Check for Speaker prefix (e.g., "Operator:", "Bank Bot:")
        const speakerMatch = cleanText.match(/^([A-Za-z\s]+):(.+)/);
        if (speakerMatch) {
            speaker = speakerMatch[1].trim();
            cleanText = speakerMatch[2].trim();
        }

        const item = {
            time: currentTime,
            speaker: speaker,
            text: cleanText
        };

        // Increment time based on length (approx read time)
        // 1 sec per 15 chars, min 3 seconds
        const duration = Math.max(3, Math.ceil(cleanText.length / 15));
        currentTime += duration;

        return item;
    });

    return {
        transcript: structured,
        duration: currentTime + 2 // Add buffer at end
    };
}

const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

levels.forEach(level => {
    vishing[level].forEach(lab => {
        // Find the transcript field
        let sourceText = "";
        let targetKey = "";

        if (lab.artifacts.call_log?.transcript) {
            sourceText = lab.artifacts.call_log.transcript;
            targetKey = 'call_log';
        } else if (lab.artifacts.call_transcript) {
            sourceText = lab.artifacts.call_transcript;
            targetKey = 'call_transcript';
            delete lab.artifacts.call_transcript; // We will unify to 'call_log' or 'transcript' logic?
            // Actually, let's keep the original structure for compatibility but formatted as array?
            // User requested standard format: 
            // "transcript": [...]
            // Let's standardise to a root 'transcript' property in the artifacts or keep it inside the specific key but as array?
            // The request showed: "transcript": [...] in the artifact OR "transcript": [...] in the root lab object?
            // The prompt implied artifacts.transcript or similar.
            // Let's standardize on `artifacts.call` object with transcript inside.
        } else if (lab.artifacts.voicemail) {
            sourceText = lab.artifacts.voicemail;
            targetKey = 'voicemail';
            delete lab.artifacts.voicemail;
        } else if (lab.artifacts.transcript) {
            sourceText = lab.artifacts.transcript;
            targetKey = 'transcript';
            delete lab.artifacts.transcript;
        }

        const converted = convertTranscript(sourceText);

        // Standardize artifact structure for the new Frontend
        // Frontend expects: artifacts.call = { caller, callerId, transcript, duration }
        // or just strict fields.

        // Let's create a unified 'call' object in artifacts
        lab.artifacts.call = {
            caller: lab.artifacts.call_log?.caller || "Unknown Caller",
            callerId: lab.artifacts.call_log?.caller_id || lab.artifacts.caller_id || "Unknown",
            transcript: converted.transcript,
            duration: converted.duration
        };

        // Remove old mixed keys to be clean
        if (lab.artifacts.call_log) delete lab.artifacts.call_log;
        if (lab.artifacts.caller_id) delete lab.artifacts.caller_id;

        // Preserve other artifacts like 'context', 'logs'
    });
});

const fileContent = `const vishing = ${JSON.stringify(vishing, null, 4)};\n\nmodule.exports = vishing;`;
fs.writeFileSync(path.join(__dirname, 'curriculum/vishing.js'), fileContent);
console.log('Successfully upgraded vishing.js with structured transcripts!');
