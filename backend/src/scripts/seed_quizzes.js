const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const seedQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');

        // Find an admin user to attach as creator
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('No admin user found. Please create an admin first.');
            process.exit(1);
        }

        // Clear existing quizzes
        await Quiz.deleteMany();
        console.log('Cleared existing quizzes...');

        const quizzes = [
            {
                title: 'Phishing Fundamentals',
                category: 'Phishing',
                difficulty: 'Beginner',
                xp: 150,
                timeLimitSeconds: 600,
                status: 'published',
                createdBy: adminUser._id,
                questions: [
                    {
                        question: 'What is the primary goal of a phishing attack?',
                        options: [
                            'To infect the computer with a virus',
                            'To steal sensitive information like credentials or financial data',
                            'To encrypt files for ransom',
                            'To overload a server with traffic'
                        ],
                        correct: 1,
                        explanation: 'Phishing primarily aims to trick users into revealing sensitive information, such as login credentials or credit card numbers, by masquerading as a trustworthy entity.'
                    },
                    {
                        question: 'Which of the following is a common indicator of a phishing email?',
                        options: [
                            'Personalized greeting using your full name',
                            'A sense of urgency threatening account suspension',
                            'Digitally signed emails',
                            'Accurate grammar and spelling'
                        ],
                        correct: 1,
                        explanation: 'Phishing emails often create a false sense of urgency (e.g., threatening account suspension or claiming a breach) to rush the victim into acting without thinking.'
                    },
                    {
                        question: 'What should you do if you receive an unexpected email from your bank asking you to click a link to verify your account?',
                        options: [
                            'Click the link and provide the requested information',
                            'Reply to the email asking if it is legitimate',
                            'Forward the email to your friends to warn them',
                            'Do not click the link, and contact your bank directly using a known phone number or website'
                        ],
                        correct: 3,
                        explanation: 'Always verify unexpected requests by contacting the organization directly through official channels, rather than clicking links or replying to the suspicious email.'
                    }
                ]
            },
            {
                title: 'Advanced Social Engineering',
                category: 'Social Engineering',
                difficulty: 'Expert',
                xp: 300,
                timeLimitSeconds: 900,
                status: 'published',
                createdBy: adminUser._id,
                questions: [
                    {
                        question: 'In social engineering, what is "pretexting"?',
                        options: [
                            'Sending a malicious link via SMS',
                            'Creating an invented scenario to engage a victim and increase the chance they will divulge information',
                            'Following an authorized person into a restricted area',
                            'Sifting through trash to find sensitive documents'
                        ],
                        correct: 1,
                        explanation: 'Pretexting involves the attacker creating a fabricated scenario (the pretext) to build trust and trick the victim into disclosing sensitive information or performing an action.'
                    },
                    {
                        question: 'Which social engineering technique relies on the human desire to be helpful or return a favor?',
                        options: [
                            'Intimidation',
                            'Quid pro quo',
                            'Tailgating',
                            'Baiting'
                        ],
                        correct: 1,
                        explanation: 'Quid pro quo (something for something) involves the attacker offering a benefit or service (like fake IT support) in exchange for information or access.'
                    },
                    {
                        question: 'What is "Spear Phishing"?',
                        options: [
                            'A broad, untargeted phishing campaign sent to millions of users',
                            'Phishing targeting high-level executives (also known as Whaling)',
                            'A highly targeted phishing attack aimed at a specific individual or organization',
                            'Phishing conducted over voice calls'
                        ],
                        correct: 2,
                        explanation: 'Spear phishing is highly targeted, using specific information about the victim (often gathered from social media or previous breaches) to make the attack more convincing.'
                    }
                ]
            },
            {
                title: 'Mobile Threats: Smishing & Vishing',
                category: 'Smishing',
                difficulty: 'Intermediate',
                xp: 200,
                timeLimitSeconds: 600,
                status: 'published',
                createdBy: adminUser._id,
                questions: [
                    {
                        question: 'What does "Smishing" stand for?',
                        options: [
                            'Smart Phishing',
                            'SMS Phishing',
                            'Social Media Phishing',
                            'Simulated Phishing'
                        ],
                        correct: 1,
                        explanation: 'Smishing is phishing conducted via Short Message Service (SMS) text messages.'
                    },
                    {
                        question: 'An attacker calls you claiming to be from the IRS and demands immediate payment to avoid arrest. This is an example of:',
                        options: [
                            'Phishing',
                            'Smishing',
                            'Vishing',
                            'Spear Phishing'
                        ],
                        correct: 2,
                        explanation: 'Vishing (Voice Phishing) uses phone calls or voice messages to deceive victims into providing information or money.'
                    },
                    {
                        question: 'Which of the following is the BEST defense against a suspicious phone call asking for personal information?',
                        options: [
                            'Ask the caller to prove their identity',
                            'Provide incorrect information to trick them',
                            'Hang up and independently verify the request by calling the organization\'s official number',
                            'Stay on the line to gather information about the attacker'
                        ],
                        correct: 2,
                        explanation: 'The safest approach is to hang up and verify the caller\'s claims by contacting the organization using a verified phone number from their official website or documentation.'
                    }
                ]
            }
        ];

        await Quiz.insertMany(quizzes);
        console.log(`Successfully seeded ${quizzes.length} quizzes!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedQuizzes();
