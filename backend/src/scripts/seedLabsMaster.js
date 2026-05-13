const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lab = require('../models/Lab');

dotenv.config();

const seedLabs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for Seeding...');

        // Clear existing labs to prevent duplicates (Optional, but recommended for clean slate)
        await Lab.deleteMany({});
        console.log('Cleared existing labs.');

        const labs = [];

        // --- 1. EXECUTIVE INTELLIGENCE LABS ---
        const executiveTitles = {
            beginner: [
                "Executive Email Spoofing Awareness", "CEO Impersonation Basics", "Boardroom Phishing Introduction",
                "Fake Financial Approval Request", "Executive QR Scam Awareness", "Deepfake Awareness Basics",
                "Business Email Compromise Intro", "Enterprise Threat Reporting", "Fake HR Executive Notice",
                "Security KPI Awareness", "Risk Dashboard Interpretation", "Executive Vishing Awareness",
                "Credential Theft Awareness", "Authority Manipulation Detection", "Corporate Data Leak Awareness",
                "Insider Risk Recognition", "Fake Vendor Communication", "AI Scam Awareness for Leaders",
                "Enterprise Password Policy Simulation", "Executive Device Security", "Corporate Cloud Sharing Risks",
                "Basic Threat Escalation", "Security Culture Analysis", "Phishing Trend Interpretation",
                "Organizational Risk Introduction"
            ],
            intermediate: [
                "Executive Wire Fraud Simulation", "Enterprise Risk Heatmap Analysis", "Multi-Department Attack Analysis",
                "Deepfake CEO Voice Attack", "Strategic Threat Escalation", "Executive Mobile Attack Investigation",
                "Enterprise Phishing Campaign Analysis", "Insider Threat Correlation", "Security Budget Prioritization",
                "Enterprise QR Payment Fraud", "Board-Level Breach Simulation", "Cloud Access Compromise",
                "Business Email Compromise Analysis", "Fake M&A Communication Attack", "Executive Credential Harvesting",
                "Multi-Region Attack Coordination", "Corporate SIEM Event Analysis", "Enterprise Security Metrics",
                "Enterprise Risk Forecasting", "Fake Legal Notice Attack", "Advanced Authority Manipulation",
                "Executive SOC Coordination", "Human-Risk Trend Analysis", "Executive MFA Fatigue Attack",
                "Security Governance Workflow"
            ],
            advanced: [
                "Global Executive Breach Crisis", "AI-Generated Executive Spear Phishing", "Deepfake Boardroom Crisis",
                "Enterprise Threat War Room", "Predictive Human-Risk Modeling", "Multi-Stage Executive Fraud",
                "Enterprise Insider Manipulation", "Autonomous Threat Intelligence", "Executive Incident Command",
                "Enterprise AI Threat Forecasting", "Adaptive Executive Phishing", "Advanced Board-Level Reporting",
                "Strategic Crisis Coordination", "Enterprise Cloud Hijacking", "Real-Time Executive Risk Dashboard",
                "AI Behavioral Attack Mapping", "Enterprise Zero Trust Simulation", "Global Enterprise Escalation",
                "Multi-Tenant Risk Analysis", "Enterprise Data Exfiltration Crisis", "Deepfake Investor Call Attack",
                "Executive Mobile Device Breach", "Enterprise Attack Surface Analysis", "Human-Risk Intelligence Forecasting",
                "Organizational Resilience Command"
            ]
        };

        // --- 2. TACTICAL DEFENSE LABS ---
        const tacticalTitles = {
            beginner: [
                "Basic Phishing Email Detection", "Suspicious URL Inspection", "Fake Login Page Analysis",
                "Attachment Malware Awareness", "Browser Warning Recognition", "Basic Smishing Detection",
                "QR Phishing Awareness", "Credential Theft Introduction", "Social Engineering Basics",
                "Fake Banking Alert Detection", "Browser Session Awareness", "Email Header Basics",
                "Cloud File Sharing Risks", "Password Reset Scam", "Basic Vishing Detection",
                "MFA Awareness Simulation", "Safe Attachment Handling", "Public Wi-Fi Threat Awareness",
                "Basic Threat Reporting", "Mobile App Scam Detection", "Fake IT Support Call",
                "Delivery Scam SMS", "Fake HR Portal Detection", "Basic SOC Workflow",
                "Security Alert Prioritization"
            ],
            intermediate: [
                "Credential Harvesting Investigation", "Malware Attachment Analysis", "SIEM Alert Correlation",
                "Browser Session Hijacking", "QR Payment Fraud Investigation", "Fake Microsoft Login Attack",
                "Cloud Account Takeover", "Multi-Stage Phishing Analysis", "Advanced Email Header Investigation",
                "Smishing Campaign Investigation", "Vishing Call Escalation", "MFA Fatigue Investigation",
                "Deepfake Audio Detection", "Fake Invoice Attack Analysis", "Business Email Compromise Detection",
                "Threat Hunting Workflow", "Corporate VPN Attack", "Web Session Token Theft",
                "DNS Phishing Investigation", "Enterprise Malware Containment", "Internal Spoofing Investigation",
                "Browser Extension Malware", "Fake Security Update Attack", "SOC Escalation Procedures",
                "Incident Response Coordination"
            ],
            advanced: [
                "Red Team Phishing Simulation", "Enterprise Threat Hunting", "Adaptive Phishing Campaign Defense",
                "Autonomous Malware Analysis", "AI Spear Phishing Detection", "Deepfake Executive Attack Defense",
                "Multi-Stage Credential Theft", "Enterprise Cloud Hijacking Defense", "Real-Time SOC Command Center",
                "Browser Zero-Day Investigation", "Cross-Platform Mobile Attack", "Enterprise Email Gateway Defense",
                "Advanced Threat Correlation", "Insider Threat Investigation", "AI-Generated Malware Campaign",
                "Multi-Vector Attack Containment", "Enterprise Session Hijacking", "QR Infrastructure Attack",
                "Advanced Incident Response", "Enterprise Lateral Movement Tracking", "Human-Risk Threat Mapping",
                "AI Threat Mutation Defense", "Autonomous SOC Operations", "Enterprise Data Exfiltration Defense",
                "Full Attack Chain Investigation"
            ]
        };

        // --- 3. COGNITIVE SECURITY LABS ---
        const cognitiveTitles = {
            beginner: [
                "Intro to Phishing Psychology", "Urgency Manipulation Awareness", "Authority Manipulation Awareness",
                "Curiosity Trap Detection", "Reward Scam Awareness", "Fake Giveaway Detection",
                "Safe Browsing Basics", "QR Code Safety Basics", "Social Media Scam Awareness",
                "Fake Delivery SMS Detection", "Public Wi-Fi Awareness", "Secure Password Habits",
                "Basic Vishing Awareness", "Emotional Manipulation Detection", "Fake Customer Support Scam",
                "Browser Pop-Up Scam Awareness", "Fake Banking Alert Awareness", "Cyber Hygiene Basics",
                "Credential Sharing Risks", "Mobile Security Awareness", "Cloud Sharing Awareness",
                "Safe Download Practices", "Basic Deepfake Awareness", "Digital Trust Verification",
                "Employee Cyber Awareness"
            ],
            intermediate: [
                "Advanced Social Engineering", "Multi-Stage Manipulation Detection", "QR Restaurant Scam Simulation",
                "Fake Investment Scam", "Fake Recruiter Scam", "Voice Impersonation Analysis",
                "Mobile Banking Fraud Awareness", "Browser Redirect Attack Awareness", "Fake Corporate Communication",
                "Curiosity-Based Attack Simulation", "Reward Manipulation Analysis", "Authority Escalation Attack",
                "AI Chat Scam Awareness", "Fake OTP Collection Attack", "Emotional Pressure Simulation",
                "Fake Cloud Share Link", "Insider Information Manipulation", "Fake Emergency Call Simulation",
                "Social Media Identity Theft", "AI Voice Scam Awareness", "Suspicious Attachment Awareness",
                "Browser Cookie Theft Awareness", "Fake Payment Gateway Scam", "Human Behavior Risk Analysis",
                "Multi-Vector Scam Detection"
            ],
            advanced: [
                "AI Social Engineering Campaign", "Deepfake Relationship Scam", "Multi-Vector Human Manipulation",
                "Enterprise Insider Manipulation", "AI Behavioral Exploitation", "Fake Crisis Communication Attack",
                "Coordinated Psychological Attack", "Advanced Reward Manipulation", "Executive Authority Exploitation",
                "AI Recruitment Scam Simulation", "Deepfake Executive Voice Manipulation", "Cross-Channel Social Engineering",
                "Human Trust Exploitation Mapping", "Adaptive Manipulation Campaign", "AI Emotional Intelligence Attack",
                "Advanced Vishing Chains", "Social Engineering Red Team", "Real-Time Human Exploitation",
                "Autonomous Manipulation Engine", "Enterprise Behavioral Weakness Mapping", "Multi-Stage Identity Fraud",
                "AI Trust Exploitation Workflow", "Adaptive Human-Risk Campaign", "Enterprise Psychological Warfare",
                "Human-Risk Intelligence Simulation"
            ]
        };

        // --- 4. ADVANCED AI ADAPTIVE LABS ---
        const aiTitles = {
            beginner: [
                "AI Phishing Awareness", "Adaptive Email Detection", "Personalized Scam Recognition",
                "AI Chatbot Scam Awareness", "Basic AI Deepfake Awareness", "AI QR Scam Detection",
                "Intro to Behavioral AI", "AI Threat Mutation Basics", "Adaptive Security Awareness",
                "AI Voice Scam Basics", "Dynamic Threat Awareness", "AI Spear Phishing Intro",
                "Personalized Threat Detection", "Behavioral Risk Basics", "AI Threat Intelligence Intro",
                "AI Email Generation Awareness", "AI Credential Theft Awareness", "Neural Attack Awareness",
                "AI Social Engineering Intro", "AI Malware Awareness", "Adaptive Browser Threats",
                "AI SMS Scam Detection", "AI Threat Pattern Recognition", "Intro to Human-Risk AI",
                "Adaptive Security Foundations"
            ],
            intermediate: [
                "AI-Generated Phishing Analysis", "Adaptive Threat Evolution", "AI Credential Harvesting Attack",
                "Behavioral Telemetry Mapping", "Dynamic Phishing Mutation", "Personalized Attack Investigation",
                "AI Voice Clone Investigation", "AI Deepfake Analysis", "Adaptive QR Fraud Detection",
                "AI Browser Hijacking", "Threat Prediction Engine", "Adaptive Smishing Analysis",
                "AI Social Engineering Investigation", "Human-Risk Telemetry Correlation", "AI Session Hijacking Attack",
                "AI Cloud Share Attack", "Dynamic Attack Surface Mapping", "Behavioral Failure Analysis",
                "Adaptive Threat Prioritization", "Neural Threat Correlation", "AI Malware Delivery Simulation",
                "Adaptive Risk Intelligence", "AI Security Decision Engine", "Personalized Threat Forecasting",
                "AI Human-Risk Analytics"
            ],
            advanced: [
                "Autonomous AI Red Team", "AI Spear Phishing Orchestration", "Behavioral Prediction Engine",
                "Neural Social Engineering System", "Autonomous Threat Mutation", "AI Human-Risk Intelligence Core",
                "Real-Time Adaptive Campaigns", "AI Executive Impersonation", "Deepfake Crisis Orchestration",
                "Autonomous Credential Theft", "AI Multi-Vector Attack Engine", "Predictive Human Exploitation",
                "AI Threat Evolution Framework", "Autonomous QR Attack Infrastructure", "Enterprise AI Manipulation System",
                "AI Behavioral Warfare Simulation", "Real-Time Neural Attack Engine", "Autonomous Vishing Campaign",
                "AI Threat Escalation Framework", "Adaptive Enterprise Breach Simulation", "Continuous Human-Risk Intelligence",
                "AI Psychological Exploitation Engine", "Autonomous Security Evasion", "AI-Driven Insider Manipulation",
                "Full Autonomous Breach Analysis"
            ]
        };

        const domains = [
            { id: 'executive_intelligence', titles: executiveTitles },
            { id: 'tactical_defense', titles: tacticalTitles },
            { id: 'cognitive_security', titles: cognitiveTitles },
            { id: 'advanced_ai_adaptive', titles: aiTitles }
        ];

        const generateContent = (type, title) => {
            if (type === 'email') {
                return {
                    sender: "admin@secure-node.internal",
                    subject: `URGENT: ${title}`,
                    body: `This is a high-priority alert regarding ${title}. Please review the attached security documentation immediately.`,
                    headers: { "X-Priority": "1", "X-Secure": "True" }
                };
            }
            if (type === 'sms') {
                return {
                    from: "SECURE_AUTH",
                    message: `Alert: ${title} detected on your node. Authenticate now to neutralize: https://secure-link.com/verify`
                };
            }
            if (type === 'call') {
                return {
                    caller: "Executive Support",
                    transcript: `Hello, this is the executive support team. We've detected an anomaly related to ${title}. Please provide your secondary auth token.`
                };
            }
            if (type === 'qr') {
                return {
                    label: "Scan to Authenticate",
                    url: `https://secure-auth-node.io/scan/${title.replace(/ /g, '_')}`
                };
            }
            return {
                data: `Simulated data for ${title}`,
                vector: "Neural Network 7"
            };
        };

        const getType = (title) => {
            const t = title.toLowerCase();
            if (t.includes('email') || t.includes('phishing')) return 'email';
            if (t.includes('sms') || t.includes('smishing')) return 'sms';
            if (t.includes('call') || t.includes('vishing') || t.includes('voice')) return 'call';
            if (t.includes('qr')) return 'qr';
            if (t.includes('browser') || t.includes('url')) return 'url';
            if (t.includes('file') || t.includes('malware')) return 'file';
            if (t.includes('ai') || t.includes('neural')) return 'chat';
            return 'social_engineering';
        };

        domains.forEach(domain => {
            ['beginner', 'intermediate', 'advanced'].forEach(level => {
                domain.titles[level].forEach((title, index) => {
                    const type = getType(title);
                    labs.push({
                        title: title.toUpperCase(),
                        description: `Interactive enterprise simulation for ${title}. Analyze threat vectors and implement strategic defense.`,
                        topic: domain.id,
                        level: level,
                        difficulty: level === 'beginner' ? (index % 3) + 1 : level === 'intermediate' ? (index % 3) + 4 : (index % 3) + 7,
                        type: type,
                        points: level === 'beginner' ? 100 : level === 'intermediate' ? 250 : 500,
                        timeLimit: level === 'beginner' ? 600 : level === 'intermediate' ? 1200 : 1800,
                        content: generateContent(type, title),
                        scenario: `You are a high-level security operative tasked with neutralizing the ${title} threat. The organization's integrity depends on your accuracy.`,
                        steps: [
                            "Analyze the incoming communication for behavioral anomalies.",
                            "Cross-reference headers and metadata with the threat intelligence database.",
                            "Execute the correct neutralization protocol."
                        ],
                        correctAnswer: "neutralize",
                        explanation: `The ${title} vector was successfully identified and neutralized using standard enterprise protocols.`,
                        behavioralVectors: {
                            urgency: title.toLowerCase().includes('urgent') || title.toLowerCase().includes('priority') ? 8 : (index % 3),
                            authority: title.toLowerCase().includes('ceo') || title.toLowerCase().includes('executive') || title.toLowerCase().includes('authority') ? 9 : (index % 2),
                            reward: title.toLowerCase().includes('reward') || title.toLowerCase().includes('financial') || title.toLowerCase().includes('bonus') ? 8 : 0,
                            curiosity: title.toLowerCase().includes('curiosity') || title.toLowerCase().includes('leak') || title.toLowerCase().includes('secret') ? 7 : (index % 4),
                            fear: title.toLowerCase().includes('fear') || title.toLowerCase().includes('threat') || title.toLowerCase().includes('legal') ? 8 : 0,
                            technical: level === 'advanced' ? 8 : (level === 'intermediate' ? 5 : 2)
                        },
                        status: 'published'
                    });
                });
            });
        });

        console.log(`Prepared ${labs.length} labs for insertion.`);

        // Insert in chunks to avoid memory issues with 300 large objects
        const chunkSize = 50;
        for (let i = 0; i < labs.length; i += chunkSize) {
            const chunk = labs.slice(i, i + chunkSize);
            await Lab.insertMany(chunk);
            console.log(`Inserted labs ${i + 1} to ${Math.min(i + chunkSize, labs.length)}`);
        }

        console.log('--- SEEDING COMPLETE: 300 LABS DEPLOYED ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedLabs();
