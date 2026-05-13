const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const User = require('../models/User');
const Lab = require('../models/Lab');

dotenv.config();

const createVideoList = (titles) => {
    return titles.map(title => ({
        title,
        source: "SECURE_NODE",
        url: "https://res.cloudinary.com/demo/video/upload/v1631234567/security_intro.mp4", // Placeholder
        duration: Math.floor(Math.random() * 300) + 300, // 5-10 mins
        summary: `Strategic overview and tactical deep-dive into: ${title}.`,
        transcripts: [
            {
                language: 'en',
                summary: `This session covers the core concepts of ${title}, focusing on threat detection and neutralization strategies.`,
                content: `Welcome to this unit on ${title}. In the current threat landscape, understanding this vector is critical for maintaining organizational resilience...`,
                segments: [
                    { start: 0, end: 10, text: "Welcome to the AntiPhishX Intelligence Node." },
                    { start: 10, end: 30, text: `Today we are analyzing ${title} and its impact on the human-risk surface.` }
                ]
            }
        ]
    }));
};

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for Massive Course Seeding...');

        let admin = await User.findOne({ role: { $in: ['admin', 'superAdmin'] } });
        if (!admin) {
            console.log('No admin found. Provisioning System Node Admin...');
            admin = await User.create({
                firstName: 'System',
                lastName: 'Admin',
                email: 'admin@antiphishx.com',
                password: 'ChangeMe123!', // Required field in schema
                role: 'superAdmin',
                currentPlan: 'enterprise_lattice',
                subscriptionStatus: 'active'
            });
            console.log('System Node Admin Created: admin@antiphishx.com');
        }

        const labs = await Lab.find({});
        const getLabsByTopic = (topic, level) => labs.filter(l => l.topic === topic && l.level === level).map(l => l._id);

        await Course.deleteMany({});
        console.log('Cleared existing courses.');

        const courseData = [
            {
                title: "EXECUTIVE INTELLIGENCE LABS",
                category: "executive_intelligence",
                description: "Master the art of organizational resilience. Designed for leaders to map, predict, and neutralize human-risk through behavioral intelligence.",
                level: "advanced",
                duration: "15 Hours",
                thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2070",
                videoTitles: {
                    beginner: [
                        "Introduction to Executive Phishing Threats", "CEO Fraud Fundamentals", "Understanding Business Email Compromise", 
                        "Identifying Fake Executive Requests", "Email Urgency Manipulation", "Password & MFA Security for Executives", 
                        "Secure Communication Practices", "LinkedIn Reconnaissance Awareness", "QR Code Scam Awareness", 
                        "AI-generated Email Threats", "Safe File Sharing for Executives", "Social Engineering Psychology", 
                        "Fake Invoice Detection", "Calendar Invite Phishing", "Secure Remote Work Habits", 
                        "Deepfake Voice Scam Basics", "Protecting Corporate Data", "Insider Manipulation Awareness", 
                        "Secure Financial Approval Flow", "Spear Phishing Basics", "Browser Session Hijacking Intro", 
                        "Credential Harvesting Awareness", "Executive Mobile Security", "Secure Travel Cyber Practices", 
                        "Executive Threat Simulation Review"
                    ],
                    intermediate: [
                        "Advanced CEO Fraud Attacks", "Executive Deepfake Detection", "Cloud-sharing Attack Scenarios", 
                        "Financial Wire Transfer Fraud", "AI-generated Social Engineering", "Credential Replay Attacks", 
                        "MFA Fatigue Exploitation", "High-value Target Reconnaissance", "Advanced Quishing Campaigns", 
                        "Secure Board-Level Communication", "AI Voice Clone Threats", "Browser Cookie Hijacking", 
                        "Threat Intelligence for Executives", "Executive Risk Analysis", "Insider Threat Coordination", 
                        "Supply-chain Social Engineering", "Corporate Espionage Awareness", "Executive Travel Attack Vectors", 
                        "Secure Enterprise Decision Flow", "Behavioral Threat Profiling", "Cloud Credential Exposure", 
                        "Privileged Access Security", "Crisis Communication Security", "AI-assisted Fraud Operations", 
                        "Executive Incident Response"
                    ],
                    advanced: [
                        "Nation-state Executive Targeting", "Advanced BEC Campaign Analysis", "Enterprise Financial Manipulation", 
                        "AI-powered Executive Fraud", "Multi-vector Executive Attacks", "Strategic Threat Hunting", 
                        "Enterprise Intelligence Correlation", "Executive Digital Footprint Analysis", "AI Behavioral Manipulation", 
                        "Deepfake Executive Extortion", "Advanced Insider Threat Operations", "C-suite Social Engineering Labs", 
                        "Adaptive Threat Modeling", "Advanced Credential Abuse", "Enterprise Trust Exploitation", 
                        "Real-time Executive Attack Response", "AI-generated Corporate Espionage", "Executive Incident Command", 
                        "High-value Identity Protection", "Executive Threat Simulations", "Red Team Executive Operations", 
                        "AI Fraud Decision Trees", "Enterprise Security Leadership", "Crisis-level Threat Coordination", 
                        "Strategic Security Intelligence"
                    ]
                }
            },
            {
                title: "TACTICAL DEFENSE LABS",
                category: "tactical_defense",
                description: "High-intensity technical training for security professionals to identify and disrupt multi-stage phishing and social engineering attacks.",
                level: "intermediate",
                duration: "18 Hours",
                thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
                videoTitles: {
                    beginner: [
                        "Phishing Email Header Basics", "URL Inspection Fundamentals", "Malware Attachment Awareness", 
                        "Secure Password Practices", "MFA Protection Basics", "Browser Security Essentials", 
                        "QR Code Threat Awareness", "Safe Download Practices", "Fake Login Page Detection", 
                        "Social Engineering Red Flags", "Network Security Basics", "Endpoint Protection Intro", 
                        "Mobile Threat Awareness", "Secure Email Usage", "Threat Intelligence Intro", 
                        "Safe USB Usage", "Browser Cookie Awareness", "Incident Reporting Basics", 
                        "Secure Wi-Fi Practices", "Basic Threat Hunting", "Ransomware Awareness", 
                        "Cloud Security Fundamentals", "Secure Authentication Methods", "Secure Collaboration Tools", 
                        "Beginner SOC Workflow"
                    ],
                    intermediate: [
                        "Email Header Forensics", "Malware Traffic Analysis", "Browser Session Hijacking", 
                        "Reverse Proxy Phishing", "Credential Harvesting Analysis", "Quishing Investigation", 
                        "Smishing Analysis Labs", "Vishing Detection Labs", "MFA Fatigue Response", 
                        "Threat Intelligence Correlation", "Secure Cloud Access", "DNS-based Phishing Detection", 
                        "Enterprise Incident Handling", "IOC Analysis", "Webhook Exploitation Awareness", 
                        "SIEM Workflow Fundamentals", "Identity Attack Detection", "Secure API Authentication", 
                        "Browser Exploit Awareness", "Mobile Malware Defense", "Network Traffic Inspection", 
                        "Threat Actor Profiling", "SOC Alert Prioritization", "Enterprise Threat Mapping", 
                        "Intermediate SOC Operations"
                    ],
                    advanced: [
                        "Advanced Threat Hunting", "Enterprise SOC Response", "Multi-stage Phishing Campaign Analysis", 
                        "Adversary Infrastructure Mapping", "Deepfake Detection Operations", "AI-assisted Threat Correlation", 
                        "Advanced SIEM Analytics", "Reverse Engineering Basics", "Enterprise Attack Chain Analysis", 
                        "Cloud Identity Attacks", "Session Token Exploitation", "Advanced Malware Triage", 
                        "Threat Intelligence Automation", "Red Team Detection Labs", "SOC Incident Escalation", 
                        "Browser Exploit Chains", "Zero-day Awareness", "AI-generated Malware Threats", 
                        "Enterprise IOC Correlation", "Threat Actor Attribution", "Cross-platform Attack Detection", 
                        "Adaptive Security Operations", "Advanced Incident Containment", "Enterprise Recovery Operations", 
                        "Blue Team Mastery Labs"
                    ]
                }
            },
            {
                title: "COGNITIVE SECURITY LABS",
                category: "cognitive_security",
                description: "Explore the psychological triggers used by modern threat actors. Learn how to identify and resist emotional manipulation patterns.",
                level: "beginner",
                duration: "12 Hours",
                thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=2070",
                videoTitles: {
                    beginner: [
                        "Introduction to Social Engineering", "Human Psychology in Cybersecurity", "Phishing Emotion Triggers", 
                        "Authority Manipulation Awareness", "Fear-based Scam Detection", "Curiosity Exploitation Awareness", 
                        "Urgency Scam Identification", "Reward Scam Psychology", "SMS Scam Awareness", 
                        "Fake Support Scam Detection", "Social Media Manipulation", "Deepfake Awareness Basics", 
                        "Behavioral Security Habits", "Mobile Social Engineering", "Fake QR Campaigns", 
                        "Trust Exploitation Basics", "Emotional Trigger Awareness", "AI-generated Scam Awareness", 
                        "Human Error Prevention", "Digital Trust Verification", "Online Identity Protection", 
                        "Voice Scam Awareness", "Personal Information Security", "Manipulation Resistance Training", 
                        "Cognitive Security Review"
                    ],
                    intermediate: [
                        "Advanced Social Engineering Psychology", "AI-generated Human Manipulation", "Behavioral Risk Analysis", 
                        "Deepfake Voice Fraud", "Multi-platform Scam Campaigns", "Advanced Smishing Operations", 
                        "Emotional Pressure Simulations", "Corporate Trust Exploitation", "Insider Manipulation Tactics", 
                        "Behavioral Threat Intelligence", "Psychological Attack Chains", "Social Media Reconnaissance", 
                        "AI Chat Scam Detection", "Human Vulnerability Mapping", "Influence Operations", 
                        "Scam Funnel Analysis", "Trust Hijacking Techniques", "Authority-based Fraud Labs", 
                        "Decision Manipulation Awareness", "Cognitive Bias Exploitation", "Online Behavioral Profiling", 
                        "Fake Persona Detection", "Psychological Defense Strategies", "Adaptive Human Threats", 
                        "Intermediate Cognitive Labs"
                    ],
                    advanced: [
                        "AI-driven Psychological Warfare", "Deepfake Human Manipulation", "Advanced Behavioral Exploitation", 
                        "Nation-state Influence Operations", "Cognitive Warfare Strategies", "AI Persona Fabrication", 
                        "Executive Manipulation Operations", "Psychological Attack Simulations", "Multi-stage Human Exploitation", 
                        "Adaptive Social Engineering", "Trust-chain Manipulation", "AI Behavioral Cloning", 
                        "Emotional Intelligence Attacks", "Human Exploit Modeling", "Psychological Red Teaming", 
                        "Enterprise Manipulation Campaigns", "Advanced Influence Engineering", "Social Trust Hijacking", 
                        "Digital Persona Exploitation", "Human-factor Threat Hunting", "AI-generated Propaganda Threats", 
                        "Cognitive Risk Intelligence", "Advanced Human Attack Vectors", "Psychological Defense Operations", 
                        "Cognitive Warfare Mastery"
                    ]
                }
            },
            {
                title: "ADVANCED AI ADAPTIVE LABS",
                category: "advanced_ai_adaptive",
                description: "The frontier of cybersecurity. Defend against autonomous threats and utilize neural networks for predictive behavioral defense.",
                level: "advanced",
                duration: "20 Hours",
                thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
                videoTitles: {
                    beginner: [
                        "Introduction to AI Cyber Threats", "AI-generated Phishing Basics", "Deepfake Fundamentals", 
                        "AI Voice Scam Awareness", "AI Email Fraud Detection", "AI Behavioral Analysis Intro", 
                        "Prompt Injection Basics", "AI-generated QR Threats", "AI Chat Manipulation", 
                        "Synthetic Identity Awareness", "AI-assisted Scam Detection", "AI Social Engineering Basics", 
                        "AI Security Ethics", "Generative AI Risks", "AI Threat Landscape", 
                        "AI-assisted Malware Intro", "Fake AI Platform Scams", "AI Data Poisoning Basics", 
                        "AI Privacy Risks", "AI Credential Theft Awareness", "AI Fraud Recognition", 
                        "AI-driven Smishing", "AI Threat Intelligence Intro", "AI Automation Risks", 
                        "Beginner AI Threat Review"
                    ],
                    intermediate: [
                        "Advanced Deepfake Detection", "AI-powered BEC Attacks", "Adaptive Phishing Campaigns", 
                        "Prompt Injection Exploitation", "AI-generated Malware Awareness", "AI Behavioral Manipulation", 
                        "LLM Security Fundamentals", "Synthetic Identity Fraud", "AI Voice Clone Attacks", 
                        "AI Threat Intelligence Mapping", "Automated Scam Infrastructure", "AI-generated Vishing Operations", 
                        "AI Model Manipulation", "AI Social Graph Exploitation", "AI-assisted Credential Harvesting", 
                        "Autonomous Attack Systems", "AI Threat Simulation Labs", "AI-driven Session Hijacking", 
                        "AI Fraud Detection Techniques", "Adaptive Threat Correlation", "AI Security Governance", 
                        "AI Data Exposure Risks", "Intelligent Automation Abuse", "AI Threat Containment", 
                        "Intermediate AI Defense Labs"
                    ],
                    advanced: [
                        "Autonomous AI Attack Chains", "AI-generated Cyber Warfare", "Enterprise AI Threat Hunting", 
                        "AI Behavioral Exploitation Systems", "Advanced Prompt Injection Attacks", "Deepfake Operational Analysis", 
                        "AI-powered Social Engineering", "Adaptive AI Malware Systems", "Synthetic Enterprise Identity Fraud", 
                        "AI Red Team Operations", "LLM Exploit Simulation Labs", "AI-assisted Reconnaissance", 
                        "Autonomous Credential Theft", "AI-generated Attack Automation", "AI Threat Intelligence Fusion", 
                        "Generative Adversarial Threats", "Enterprise AI Defense Operations", "AI-powered Threat Prediction", 
                        "Autonomous Phishing Infrastructure", "AI Risk Governance", "Intelligent Threat Modeling", 
                        "AI Incident Response Systems", "Adaptive Security Automation", "AI-driven Enterprise Defense", 
                        "AI Cyber Warfare Mastery"
                    ]
                }
            }
        ];

        const finalCourses = [];

        for (const data of courseData) {
            const course = {
                title: data.title,
                description: data.description,
                category: data.category,
                level: data.level,
                duration: data.duration,
                thumbnail: data.thumbnail,
                instructor: admin._id,
                published: true,
                modules: [
                    {
                        level: 'beginner',
                        title: 'Beginner Sector',
                        description: 'Foundational concepts and basic threat detection.',
                        videos: createVideoList(data.videoTitles.beginner),
                        labs: getLabsByTopic(data.category, 'beginner')
                    },
                    {
                        level: 'intermediate',
                        title: 'Intermediate Sector',
                        description: 'Advanced technical analysis and complex simulations.',
                        videos: createVideoList(data.videoTitles.intermediate),
                        labs: getLabsByTopic(data.category, 'intermediate')
                    },
                    {
                        level: 'advanced',
                        title: 'Advanced Sector',
                        description: 'Enterprise-level strategic intelligence and autonomous defense.',
                        videos: createVideoList(data.videoTitles.advanced),
                        labs: getLabsByTopic(data.category, 'advanced')
                    }
                ]
            };
            finalCourses.push(course);
        }

        const inserted = await Course.insertMany(finalCourses);
        console.log(`Successfully Synchronized ${inserted.length} Massive Course Tracks.`);
        
        inserted.forEach(c => {
            console.log(`COURSE: ${c.title} | ${c.modules.reduce((acc, m) => acc + m.videos.length, 0)} Units Initialized`);
        });

        console.log('--- NEURAL ARCHIVE RE-INDEXED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedCourses();
