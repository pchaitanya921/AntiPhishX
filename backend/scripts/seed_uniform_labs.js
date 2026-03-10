const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lab = require('../src/models/Lab');
const CURRICULUM = require('./curriculum/index');

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// Helper to generate content based on the specific task title
const generateMissionContent = (topicId, topicName, taskTitle, level, index) => {
    const isPhishing = index % 3 !== 0;
    let decision = 'phishing';
    if (!isPhishing) decision = 'legitimate';

    // Adjust decision based on title keywords if possible
    if (taskTitle.toLowerCase().includes('legitimate') || taskTitle.toLowerCase().includes('safe')) {
        decision = 'legitimate';
    }

    const difficulty = Math.min(10, (LEVELS.indexOf(level) * 2) + 2 + (index % 3));

    // Dynamic Scenario Generation based on Title
    let scenario = `Scenario for ${taskTitle}.`;
    let steps = [
        `Analyze the provided artifacts for ${topicId}.`,
        `Investigate specific indicators related to ${taskTitle}.`,
        `Determine if the threat is malicious or benign.`
    ];
    let content = {};
    let type = 'email';

    // Topic-Specific Logic
    switch (topicId) {
        case 'phishing':
        case 'social_engineering':
            type = 'email';
            scenario = `You are a SOC analyst. An email has been flagged with the subject related to "${taskTitle}". You need to determining its legitimacy.`;
            content = {
                email: {
                    sender: isPhishing ? "support@legit-update.com" : "support@legit.com",
                    subject: `Urgent: ${taskTitle}`,
                    body: `Please review the attached request regarding ${taskTitle}.`,
                    to: "employee@company.com",
                    date: new Date().toISOString()
                }
            };
            steps = [
                `Examine the sender address for spoofing indicators affecting ${taskTitle}.`,
                `Analyze the email body for psychological triggers.`,
                `Verify links or attachments mentioned in "${taskTitle}".`
            ];
            break;

        case 'vishing':
            type = 'call';
            scenario = `A suspicious call was recorded regarding "${taskTitle}". Analyze the audio transcript.`;
            content = {
                call: {
                    caller: "Unknown Caller",
                    callerId: "+1-555-0123",
                    transcript: `Operator: Hello, I am calling regarding ${taskTitle}. We need you to verify your details...`
                }
            };
            steps = [
                `Listen to the call transcript for coercion techniques.`,
                `Verify the stated purpose: "${taskTitle}".`,
                `Check if the caller requests sensitive PII.`
            ];
            break;

        case 'smishing':
            type = 'sms';
            scenario = `An SMS was received on a corporate device related to "${taskTitle}".`;
            content = {
                sms: {
                    sender: "+15550987654",
                    message: `Alert: ${taskTitle}. Click here to resolve: http://bit.ly/secure`,
                    timestamp: "Now"
                }
            };
            steps = [
                `Analyze the SMS sender origin.`,
                `Inspect the link provided in the message.`,
                `Evaluate the context of "${taskTitle}".`
            ];
            break;

        case 'qr_code':
            type = 'url';
            scenario = `A QR code was found in a public area labeled "${taskTitle}". Analyze the decoded URL.`;
            content = {
                fullUrl: "https://suspicious-redirect.com/login",
                analysis_hint: `Decoded from QR sticker: ${taskTitle}`
            };
            steps = [
                `Analyze the decoded URL structure.`,
                `Check for redirect chains or obfuscation.`,
                `Verify the destination domain against known safe lists.`
            ];
            break;

        case 'advanced_threats':
        case 'malware_detection':
            type = 'file';
            scenario = `Endpoint detection systems flagged a file associated with "${taskTitle}". Perform static analysis.`;
            content = {
                file: {
                    filename: "suspicious_artifact.exe",
                    filetype: "PE32 Executable",
                    size: "2.4 MB",
                    hash: "a4f5..."
                }
            };
            steps = [
                `Analyze the file metadata and signature.`,
                `Check for indicators of ${taskTitle}.`,
                `Determine if the file exhibits malicious behavior.`
            ];
            break;
    }

    // Refine Steps based on Title Keywords (Simple heuristic to make it feel custom)
    if (taskTitle.toLowerCase().includes('header')) {
        steps.push("Perform deep header analysis (SPF/DKIM/DMARC).");
    }
    if (taskTitle.toLowerCase().includes('url') || taskTitle.toLowerCase().includes('link')) {
        steps.push("Analyze the URL structure and domain reputation.");
    }
    if (taskTitle.toLowerCase().includes('attachment')) {
        steps.push("Scan the attachment for known malware signatures.");
    }

    // Ensure 3-5 steps
    try {
        if (steps.length < 3) steps.push("Formulate a final verdict.");
        steps = steps.slice(0, 5);
    } catch (err) {
        console.log('Error slicing steps:', err);
    }

    return {
        title: `${topicName} - ${taskTitle}`, // Use the specific task title
        scenario,
        description: `MISSION: ${taskTitle}\n\nOBJECTIVE: ${scenario}`,
        difficulty,
        points: 100 * (LEVELS.indexOf(level) + 1),
        timeLimit: 600 + (LEVELS.indexOf(level) * 300),
        correctAnswer: decision,
        type,
        content,
        steps,
        explanation: `Detailed analysis for ${taskTitle}: The indicators present suggests a ${decision} classification.`,
        hints: [
            { content: `Focus on the specific indicators of ${taskTitle}.`, cost: 10 },
            { content: "Review standard operating procedures for this threat type.", cost: 20 }
        ]
    };
};

const seedUniformLabs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Clearing existing labs...');
        await Lab.deleteMany({});
        console.log('Labs cleared.');

        const TOPIC_MAP = {
            'phishing': 'Email Phishing',
            'vishing': 'Vishing',
            'smishing': 'Smishing',
            'qr_code': 'QR Attacks',
            'social_engineering': 'Social Engineering',
            'advanced_threats': 'Advanced Threats',
            'malware_detection': 'Malware Detection'
        };

        const topics = Object.keys(CURRICULUM);
        console.log(`Found ${topics.length} topics in curriculum: ${topics.join(', ')}`);

        let totalInserted = 0;

        for (const topicId of topics) {
            const levels = CURRICULUM[topicId];
            const topicName = TOPIC_MAP[topicId] || topicId;

            if (!levels || typeof levels !== 'object') continue;

            for (const level of Object.keys(levels)) {
                if (!LEVELS.includes(level)) continue;

                const tasks = levels[level];
                if (!Array.isArray(tasks)) continue;

                console.log(`Processing ${tasks.length} labs for ${topicName} - ${level}...`);
                const batchLabs = [];

                tasks.forEach((taskItem, index) => {
                    try {
                        let mission;

                        if (typeof taskItem === 'object') {
                            // High-Fidelity Blueprint (Phase 17)
                            mission = {
                                title: `${topicName} - ${taskItem.title}`,
                                description: `MISSION: ${taskItem.title}\n\nOBJECTIVE: ${taskItem.briefing}`,
                                scenario: taskItem.briefing,
                                topic: topicId,
                                level: level,
                                difficulty: Math.min(10, (LEVELS.indexOf(level) * 2) + 2 + (index % 3)),
                                type: {
                                    'phishing': 'email',
                                    'smishing': 'sms',
                                    'vishing': 'call',
                                    'qr_code': 'qr',
                                    'social_engineering': 'social_engineering',
                                    'malware_detection': 'file',
                                    'advanced_threats': 'file'
                                }[topicId] || 'email',
                                points: 100 * (LEVELS.indexOf(level) + 1),
                                timeLimit: 600 + (LEVELS.indexOf(level) * 300),
                                content: {
                                    ...taskItem.artifacts,
                                    quiz: {
                                        question: taskItem.question,
                                        options: taskItem.options
                                    }
                                },
                                steps: [taskItem.task], // Wrap single task in array
                                hints: [
                                    { content: "Review the artifacts carefully.", cost: 10 }
                                ],
                                correctAnswer: taskItem.correctAnswer,
                                explanation: taskItem.explanation,
                                status: 'published'
                            };
                        } else {
                            // Legacy String-based Generation
                            const generated = generateMissionContent(topicId, topicName, taskItem, level, index);
                            mission = {
                                title: generated.title,
                                description: generated.description,
                                scenario: generated.scenario,
                                topic: topicId,
                                level: level,
                                difficulty: generated.difficulty,
                                type: generated.type,
                                points: generated.points,
                                timeLimit: generated.timeLimit,
                                content: generated.content,
                                steps: generated.steps,
                                hints: generated.hints,
                                correctAnswer: generated.correctAnswer,
                                explanation: generated.explanation,
                                status: 'published'
                            };
                        }

                        batchLabs.push(mission);
                    } catch (err) {
                        console.error(`Skipping invalid mission generation for ${taskTitle}:`, err.message);
                    }
                });

                if (batchLabs.length > 0) {
                    try {
                        await Lab.insertMany(batchLabs);
                        totalInserted += batchLabs.length;
                        process.stdout.write(`+${batchLabs.length} `);
                    } catch (dbErr) {
                        console.error(`\nDB Insert Failed for ${topicName} - ${level}:`);
                        if (dbErr.writeErrors) {
                            console.error(`First error: ${dbErr.writeErrors[0].errmsg}`);
                        } else {
                            console.error(dbErr.message);
                        }
                    }
                }
            }
            console.log(''); // Newline after topic
        }

        console.log(`\nSuccessfully seeded ${totalInserted} labs from detailed curriculum.`);
        process.exit(0);
    } catch (error) {
        console.error('\nCritical Error seeding labs:', error);
        process.exit(1);
    }
};

seedUniformLabs();
