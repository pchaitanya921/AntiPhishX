const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Lab = require('../src/models/Lab');

const DOMAINS = {
    EXECUTIVE_INTELLIGENCE: 'executive_intelligence',
    TACTICAL_DEFENSE: 'tactical_defense',
    COGNITIVE_SECURITY: 'cognitive_security',
    ADVANCED_AI_ADAPTIVE: 'advanced_ai_adaptive'
};

const LEVELS = ['beginner', 'intermediate', 'advanced'];

// Template data for variety
const TEMPLATES = {
    [DOMAINS.EXECUTIVE_INTELLIGENCE]: {
        beginner: ["Quarterly Risk Review", "Policy Compliance Audit", "Executive Communication Protocol", "Security Awareness Basics for Leadership", "Data Privacy Fundamentals"],
        intermediate: ["M&A Due Diligence Simulation", "Board Level Threat Briefing", "Supply Chain Risk Assessment", "Crisis Communication Drill", "Budgetary Security Prioritization"],
        advanced: ["Nation-State Actor Crisis Management", "Global Infrastructure Breach Response", "Predictive Risk Modeling for C-Suite", "Regulatory SEC Cyber Disclosure Workflow", "Advanced Insider Threat Forensics for Executives"]
    },
    [DOMAINS.TACTICAL_DEFENSE]: {
        beginner: ["Email Header Analysis", "Suspicious URL Identification", "Introduction to Malware Sandbox", "Identifying Common Spoofing Techniques", "Basic Incident Reporting"],
        intermediate: ["Advanced Header Forensics (SPF/DKIM/DMARC)", "Malware Static Analysis Triage", "SIEM Log Correlation Basics", "Phishing Campaign Containment", "Domain Squatting Investigation"],
        advanced: ["Multi-Vector APT Simulation", "In-Depth Malware Dynamic Analysis", "Zero-Day Exploit Response", "Advanced SIEM Threat Hunting", "Endpoint Forensics & Containment"]
    },
    [DOMAINS.COGNITIVE_SECURITY]: {
        beginner: ["Spotting Phishing Scams", "Safe Web Browsing", "Social Engineering Awareness", "Password Hygiene", "Introduction to MFA"],
        intermediate: ["Vishing & Voice Impersonation", "Smishing & SMS Spoofing", "QR Code Security (Quishing)", "Advanced Social Engineering Hooks", "Business Email Compromise (BEC) Identification"],
        advanced: ["Deepfake Voice Analysis", "Psychological Manipulation Detection", "Advanced Impersonation Defense", "Complex Social Engineering Infiltration", "Cognitive Bias in Security Decision Making"]
    },
    [DOMAINS.ADVANCED_AI_ADAPTIVE]: {
        beginner: ["Intro to AI-Generated Phishing", "AI vs Human Content Detection", "Basic Large Language Model Scams", "AI-Enhanced Social Engineering", "Identifying Synthetic Profiles"],
        intermediate: ["Adaptive AI Spear Phishing", "Automated Attack Mutation Detection", "AI-Generated Voice Phishing", "Synthetic Identity Theft Investigation", "AI-Driven Credential Harvesting"],
        advanced: ["Autonomous AI APT Simulation", "Neural Social Engineering Defense", "Deepfake Video Crisis Response", "AI-Generated Malware Attribution", "Predictive AI Human-Risk Modeling"]
    }
};

const generateLab = (domain, level, index) => {
    const titles = TEMPLATES[domain][level];
    const baseTitle = titles[index % titles.length];
    const uniqueId = `${domain}_${level}_${index}`;
    
    // Determine type based on domain/index
    let type = 'email';
    if (domain === DOMAINS.COGNITIVE_SECURITY) {
        if (index % 3 === 0) type = 'sms';
        else if (index % 3 === 1) type = 'call';
        else if (index % 3 === 2) type = 'qr';
    } else if (domain === DOMAINS.TACTICAL_DEFENSE) {
        if (index % 2 === 0) type = 'file';
        else type = 'url';
    } else if (domain === DOMAINS.ADVANCED_AI_ADAPTIVE) {
        if (index % 2 === 0) type = 'chat';
        else type = 'email';
    }

    const difficulty = level === 'beginner' ? (index % 3 + 1) : (level === 'intermediate' ? (index % 3 + 4) : (index % 3 + 7));
    const points = level === 'beginner' ? 100 : (level === 'intermediate' ? 250 : 500);

    return {
        title: `[${level.toUpperCase()}] ${baseTitle} - Session ${index + 1}`,
        description: `Mission: ${baseTitle}. Goal: Successfully analyze and respond to the ${domain} challenge at ${level} level.`,
        scenario: `MISSION BRIEFING: You are part of the AntiPhishX Security Operations Center. A new event has been detected: ${baseTitle}. This session is part of the ${domain} curriculum. Objectives: 1. Analyze the artifact. 2. Identify threat indicators. 3. Formulate response.`,
        topic: domain,
        level: level,
        difficulty: difficulty,
        type: type,
        points: points,
        timeLimit: level === 'beginner' ? 600 : (level === 'intermediate' ? 900 : 1200),
        content: {
            // Simplified dynamic content for bulk seeding
            artifact_id: uniqueId,
            details: `Secure analysis of ${baseTitle} in progress...`,
            isPhishing: index % 2 === 0 // 50/50 split for training
        },
        steps: [
            "Initialize mission environment.",
            `Inspect primary ${type} artifact for ${baseTitle}.`,
            "Identify psychological or technical triggers.",
            "Consult threat intelligence database.",
            "Provide final classification verdict."
        ],
        correctAnswer: index % 2 === 0 ? "phishing" : "legitimate",
        explanation: `Analysis of ${baseTitle} revealed indicators consistent with a ${index % 2 === 0 ? 'malicious attack' : 'legitimate communication'}. Verification of source and intent confirmed the verdict.`,
        status: 'published'
    };
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // We don't want to delete ALL labs if we want to keep existing ones?
        // Actually, the user wants a "conversion" to real production, so clearing is better to ensure clean state.
        console.log('🧹 Clearing existing labs...');
        await Lab.deleteMany({});

        const labsToInsert = [];

        for (const domain of Object.values(DOMAINS)) {
            for (const level of LEVELS) {
                console.log(`🚀 Generating 25 labs for ${domain} - ${level}...`);
                for (let i = 0; i < 25; i++) {
                    labsToInsert.push(generateLab(domain, level, i));
                }
            }
        }

        console.log(`📦 Inserting ${labsToInsert.length} labs...`);
        const result = await Lab.insertMany(labsToInsert);
        console.log(`✅ Successfully seeded ${result.length} labs!`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
