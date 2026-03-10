require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Lab = require('../src/models/Lab');

const seedLab = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const labData = {
            title: "CEO Fraud Analysis",
            description: "Analyze a suspicious email from the CEO requesting an urgent wire transfer.",
            topic: "phishing",
            level: "intermediate",
            type: "email",
            points: 150,
            timeLimit: 900,
            scenario: "You are a senior accountant at FinCorp. It's Friday afternoon, and you just received an urgent email from the CEO, asking you to process a wire transfer for a confidential acquisition. The email looks legitimate at first glance, but company policy requires strict verification for all external transfers.",
            steps: [
                "Review the email sender's address carefully.",
                "Analyze the email body for psychological triggers (urgency, authority).",
                "Check the reply-to header if available.",
                "Identify the specific red flags that indicate this is a BEC (Business Email Compromise) attack."
            ],
            hints: [
                { content: "Look closely at the domain name in the sender's email address. Is it exactly 'fincorp.com'?", cost: 10 },
                { content: "The email uses phrases like 'Immediate attention required' and 'Confidential'. These are common social engineering tactics.", cost: 15 },
                { content: "Hover over the 'Reply' button to see the actual destination address.", cost: 20 }
            ],
            content: {
                email: {
                    sender: "John CEO <john.doe@fincorp-secure.com>",
                    subject: "URGENT: Acquisition Payment - Confidential",
                    date: "Fri, 10 Oct 2025 16:45:00",
                    to: "Accountant <finance@fincorp.com>",
                    body: "Hi,\n\nI need you to process an urgent wire transfer for the acquisition we discussed. The board has just approved it, and we need to beat the cutoff time.\n\nPlease transfer $45,000 to the attached account details immediately.\n\nThis is highly confidential. Do not discuss with anyone in the office until I announce it on Monday.\n\nSent from my iPhone",
                    hasAttachment: true,
                    attachmentName: "Wire_Instructions.pdf"
                }
            },
            difficulty: 6,
            correctAnswer: "phishing",
            explanation: "This is a classic CEO Fraud (BEC) attack. The sender domain 'fincorp-secure.com' is a look-alike domain, not the real 'fincorp.com'. Newer domains are often used in these attacks. The urgency ('immediately') and confidentiality ('do not discuss') are designed to bypass your verification procedures."
        };

        // Check if exists
        const existing = await Lab.findOne({ title: labData.title });
        if (existing) {
            console.log('Updating existing lab...');
            Object.assign(existing, labData);
            await existing.save();
        } else {
            console.log('Creating new lab...');
            await Lab.create(labData);
        }

        console.log('Lab seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding lab:', error);
        process.exit(1);
    }
};

seedLab();
