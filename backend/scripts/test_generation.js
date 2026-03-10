const CURRICULUM = require('./lab_curriculum');

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// Helper to generate content based on the specific task title
const generateMissionContent = (topicId, taskTitle, level, index) => {
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
        title: `${topicId} - ${taskTitle}`, // TEMP title for validation
        difficulty,
        steps
    };
};

const runTest = () => {
    try {
        console.log('Testing generation logic...');
        const labsToInsert = [];

        const topics = Object.keys(CURRICULUM);
        console.log(`Found ${topics.length} topics: ${topics.join(', ')}`);

        for (const topicId of topics) {
            const levels = CURRICULUM[topicId];

            for (const level of Object.keys(levels)) {
                const tasks = levels[level];
                console.log(`Generating ${tasks.length} labs for ${topicId} - ${level}...`);

                tasks.forEach((taskTitle, index) => {
                    const mission = generateMissionContent(topicId, taskTitle, level, index);
                    process.stdout.write('.'); // progress dot
                    labsToInsert.push(mission);
                });
                console.log(' Done.');
            }
        }

        console.log(`\nSuccessfully generated ${labsToInsert.length} lab objects.`);
    } catch (error) {
        console.error('\nCRASHED:', error);
    }
};

runTest();
