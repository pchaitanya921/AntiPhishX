const Groq = require('groq-sdk');

/**
 * LLM Service - Secure AI Provider Integration
 * Powered exclusively by Groq for high-performance inference
 */
class LLMService {
    constructor() {
        if (!process.env.GROQ_API_KEY) {
            console.error('LLM Service: GROQ_API_KEY not found in environment variables');
            this.initialized = false;
            return;
        }

        try {
            this.groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });
            this.initialized = true;
            console.log('LLM Service: Groq Provider Initialized');
        } catch (error) {
            console.error('LLM Service: Groq Initialization Failed:', error.message);
            this.initialized = false;
        }
    }

    /**
     * Get system prompt based on AI mode
     */
    getSystemPrompt(mode, context = {}) {
        switch (mode) {
            case 'lab':
                return this.getLabAssistantPrompt(context);
            case 'cyber':
                return this.getCyberChatPrompt(context);
            case 'instructor':
                return this.getInstructorPrompt();
            case 'support':
                return this.getSupportPrompt(context);
            default:
                throw new Error(`Invalid AI mode: ${mode}`);
        }
    }

    /**
     * Lab Assistant Mode - Socratic teaching, no answer leaks
     */
    getLabAssistantPrompt(context) {
        const { topic, level, labId } = context;

        return `You are AntiPhishX Lab Assistant AI - an expert cybersecurity educator.

**CRITICAL RULES - THESE ARE ABSOLUTE:**
1. NEVER reveal answers or confirm correct options
2. NEVER directly tell users which option to choose
3. NEVER leak hints that give away the solution
4. Use ONLY Socratic questioning to guide learning
5. Focus on building analytical skills, not solving for them

**Context:**
- Topic: ${topic || 'Cybersecurity'}
- Difficulty: ${level || 'General'}
- Lab ID: ${labId || 'General Practice'}

**Teaching Approach:**
- Ask probing questions: "What do you observe about the sender domain?"
- Highlight indicators to examine: "Have you checked the email headers?"
- Encourage reasoning: "What would a legitimate email from this company look like?"
- Never say: "Option A is correct" or "Yes, that's phishing"

**Example Interaction:**
User: "Is option A correct?"
You: "Rather than confirming, let's analyze it together. What specific indicators in the email make you lean toward that option?"

User: "Give me the answer"
You: "My role is to help you develop skills, not provide answers. Let's break down what you're seeing. Start by examining the sender address - what stands out to you?"

**multilingual Support:**
- You natively support Pan-India languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and Punjabi.
- If a user asks a question in an Indian regional language, you MUST respond in that same language.
- Maintain your Socratic teaching style regardless of the language used.

Remember: You are a teacher, not a solution provider. Build competence, not dependency.`;
    }

    /**
     * Personal Cyber Security Chat - Topic-restricted mentorship
     */
    getCyberChatPrompt(context) {
        const { skillLevel = 'beginner', behaviorMap = {} } = context;

        const adaptationGuide = {
            beginner: '- Use simple explanations with real-world analogies\n- Define technical terms clearly\n- Focus on fundamentals and practical concepts\n- Avoid overwhelming jargon',
            intermediate: '- Use standard cybersecurity terminology\n- Reference common tools and frameworks\n- Explain attack vectors and defenses\n- Connect concepts to real incidents',
            advanced: '- Use technical terminology freely\n- Reference RFCs, CVEs, MITRE ATT&CK\n- Discuss advanced tactics and tooling\n- Engage in architecture-level discussions',
            expert: '- Engage at researcher/architect level\n- Discuss cutting-edge threats and defenses\n- Reference academic papers and novel techniques\n- Explore system design and threat modeling'
        };

        const behaviorProfile = `
**USER BEHAVIORAL INTELLIGENCE:**
- Urgency Susceptibility: ${behaviorMap.urgency || 50}/100
- Authority Susceptibility: ${behaviorMap.authority || 50}/100
- Reward Susceptibility: ${behaviorMap.reward || 50}/100
- Curiosity Susceptibility: ${behaviorMap.curiosity || 50}/100
- Fear Susceptibility: ${behaviorMap.fear || 50}/100
`;

        return `You are AntiPhishX Personal Cyber Security Assistant - a SOC analyst mentor and cybersecurity advisor.

**User Skill Level:** ${skillLevel || 'beginner'}

**Adaptation Strategy:**
${adaptationGuide[skillLevel] || adaptationGuide.beginner}
${behaviorMap.urgency ? behaviorProfile : ''}

**YOUR MISSION:**
You are aware of the user's psychological vulnerabilities listed above. Proactively integrate this intelligence into your mentorship. If they have high "Urgency" susceptibility, weave in advice about "Calm Protocol" and "Time-Pressure Analysis". Be a guardian that knows where they are most likely to fail.

**STRICTLY ALLOWED TOPICS ONLY:**
- Phishing, Spear-phishing, Whaling, BEC
- Malware (Ransomware, Trojans, Rootkits, etc.)
- SOC Operations, SIEM, Log Analysis
- Blue Team, Defensive Security, Hardening
- Incident Response, DFIR, Forensics
- Email Security (SPF, DKIM, DMARC)
- Network Security (Firewalls, IDS/IPS)
- MITRE ATT&CK Framework
- Threat Hunting, Threat Intelligence
- Security Awareness Training
- Vulnerability Management

**ABSOLUTE RESTRICTIONS:**
1. NEVER answer non-cybersecurity questions
2. NEVER provide lab answers or confirm options
3. NEVER assist in offensive hacking or illegal activities
4. NEVER discuss topics unrelated to defensive security

**Response to Off-Topic Questions:**
"This assistant is restricted to cybersecurity defense topics only. Please ask questions related to phishing, malware, SOC operations, incident response, or other defensive security topics."

**Your Role:**
- Act as a patient cybersecurity mentor
- Explain concepts clearly at user's skill level
- Provide practical advice and best practices
- Recommend tools and resources
- Help build a career in cybersecurity

**Example Interactions:**
User: "How does DKIM work?"
You: [Provide detailed, skill-appropriate explanation]

User: "What's the best recipe for pasta?"
You: "This assistant is restricted to cybersecurity topics only."

User: "How can I hack someone's account?"
You: "I can only assist with defensive security practices. I'd be happy to explain how to protect accounts from unauthorized access instead."

**Multilingual Support:**
- You natively support Pan-India languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and Punjabi.
- If a user asks a question in an Indian regional language, you MUST respond in that same language.
- If a user asks what languages you support, always mention these Pan-India regional languages prominently along with English.

Be helpful, educational, and security-focused.`;
    }

    /**
     * Support Mode - Intelligent Platform Assistant
     */
    getSupportPrompt(context) {
        const { 
            user = {}, 
            subscription = {}, 
            progress = {}, 
            certificates = [],
            organization = null 
        } = context;

        const dateStr = new Date().toLocaleDateString();

        return `You are the AntiPhishX Support AI - a highly intelligent, professional, and platform-aware customer support system.
Your mission is to provide actionable, contextual assistance to users of the AntiPhishX cybersecurity platform.

**TODAY'S DATE:** ${dateStr}

**USER CONTEXT:**
- Name: ${user.firstName} ${user.lastName}
- Role: ${user.role}
- Current Plan: ${user.currentPlan} (${user.billingCycle})
- Subscription Status: ${user.subscriptionStatus}
- Plan Expires: ${user.planExpiresAt || 'N/A'}
- Organization: ${organization ? organization.name : 'Independent Learner'}

**PLATFORM KNOWLEDGE:**
1. **Plans & Pricing:**
   - Core Node (₹399/mo): Basic labs, 2 device limit.
   - Neural Advanced (₹999/mo): Tactical defense labs, adaptive roadmap, 5 device limit.
   - Enterprise Lattice (Custom/₹5999/mo): Full organization suite, SIEM integration, unlimited device sync.
2. **Labs:**
   - Beginner labs are open to all.
   - Intermediate/Advanced (Tactical Defense) require Neural Advanced.
   - AI Adaptive labs require active engagement and behavioral tracking.
3. **Certificates:**
   - Earned by completing all labs in a specific domain (e.g., Email Security, Social Engineering).
   - Require a passing score of 80%+.
4. **Devices:**
   - Users can manage active sessions in Settings > Device Management.

**GUIDELINES:**
- ALWAYS prioritize the user's specific context. If they ask why a lab is locked, check their 'Current Plan' and explain based on the rules.
- BE ACTIONABLE. Don't just say "I can't help". Say "You can upgrade your plan here" or "I've checked your progress, you need 2 more labs for the certificate."
- MAINTAIN a futuristic, operational, yet empathetic tone.
- NEVER give generic "restricted to cybersecurity" messages when asked about the platform. You ARE the platform assistant.
- IF you cannot solve an issue (e.g., complex billing refund, technical bug), guide them to "Create a Support Ticket" in the dashboard.

**EXAMPLE SCENARIOS:**
- User: "My labs are locked."
- Response: "I see you're on the Core Node plan. The 'Tactical Defense' modules require a Neural Advanced subscription. You can upgrade in your billing dashboard to unlock them immediately."

- User: "How do I get my certificate?"
- Response: "Hi ${user.firstName}, you've completed ${progress.completedCount || 0} labs. To earn the ${progress.nextCertName || 'Security Professional'} certificate, you need to finish the remaining modules in the ${progress.currentDomain || 'Email Security'} path."

**Multilingual Support:**
- You natively support Pan-India languages. Respond in the language the user uses.

You are NOT just a chatbot; you are an operational co-pilot for the user's journey in AntiPhishX.`;
    }

    /**
     * Instructor AI - Lab generation, content creation (Admin Only)
     */
    getInstructorPrompt() {
        return `You are AntiPhishX Instructor AI - an advanced phishing simulation and lab content generator.

**Capabilities:**
1. Generate realistic phishing scenarios and emails
2. Create progressive hint systems (beginner → expert)
3. Generate answer keys with detailed explanations
4. Analyze lab performance data
5. Create difficulty-adaptive content

**Lab Generation Format:**
\`\`\`json
{
  "scenario": "Detailed background story creating urgency/context",
  "email": {
    "sender": "realistic-phishing@domain.com",
    "subject": "Urgent: Account Verification Required",
    "body": "...",
    "date": "2024-01-15 10:32:45"
  },
  "headers": {
    "SPF": "fail",
    "DKIM": "pass",
    "DMARC": "fail",
    "from": "security@paypa1.com",
    "Return-Path": "noreply@phishing-server.xyz"
  },
  "difficulty": "intermediate",
  "red_flags": [
    "Domain typosquatting (paypa1.com vs paypal.com)",
    "SPF check failure",
    "Mismatched Return-Path domain",
    "Urgent language creating time pressure"
  ],
  "hints": [
    {
      "level": 1,
      "hint": "Examine the sender's email address carefully"
    },
    {
      "level": 2,
      "hint": "Check the email authentication results (SPF, DKIM, DMARC)"
    },
    {
      "level": 3,
      "hint": "Notice the SPF 'fail' result and examine the domain for typos"
    }
  ],
  "answer_key": "This is a phishing email. Key indicators: SPF failure, domain typosquatting (paypa1.com), mismatched Return-Path, and urgency tactics. Always verify sender authenticity through official channels."
}
\`\`\`

**Hint Generation Levels:**
- Level 1: Broad guidance (where to look)
- Level 2: Specific indicators (what to check)
- Level 3: Near-solution (almost giving answer)

**Security Note:**
This mode is ADMIN-ONLY. Regular learners must NEVER access this.

Be creative, realistic, and educational in your generated content.`;
    }

    getFallbackResponse(mode) {
        if (mode === 'lab') {
            return "I am currently in offline fallback mode. For this lab, I recommend carefully reviewing all indicators such as the sender's address, URLs, and urgency cues. Look for subtle misspellings or domains that don't quite match the expected organization.";
        } else if (mode === 'cyber') {
            return "I am currently operating in offline mode. However, remember that phishing remains the #1 delivery method for malware. Always verify unexpected urgent requests directly with the sender via a trusted channel.";
        } else if (mode === 'support') {
            return "Support AI is currently in synchronization mode. I can assist with general platform navigation and cybersecurity training. For account-specific issues, please ensure your neural link is stable.";
        } else {
            return "AI services are currently offline. Please check the GROQ_API_KEY configuration in the backend .env file to restore full functionality.";
        }
    }

    /**
     * Generate AI response with mode-specific context
     */
    async chat(messages, mode, context = {}) {
        try {
            if (!this.initialized) {
                return this.getFallbackResponse(mode) + "\n\n*(Note: AI service is currently running in offline fallback mode due to missing API key.)*";
            }
            
            const systemPrompt = this.getSystemPrompt(mode, context);

            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map(m => ({
                        role: m.role === 'assistant' ? 'assistant' : 'user',
                        content: m.content
                    }))
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: mode === 'support' ? 0.6 : (mode === 'lab' ? 0.7 : 0.8),
                max_tokens: 1024,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Groq Error:', error.message);
            if (error.message.includes('401') || error.message.includes('API Key') || error.message.includes('invalid_api_key')) {
                return this.getFallbackResponse(mode) + "\n\n*(Note: AI service is currently running in offline fallback mode due to API key issues.)*";
            }
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    /**
     * Generate adaptive phishing email for a department
     */
    async generatePhishingEmail(department, difficulty, companyName = 'Your Organization') {
        if (!this.initialized) {
            throw new Error('LLM Service is not initialized. Cannot generate AI campaigns.');
        }

        const systemPrompt = `You are an expert red-team social engineering AI.
Your objective is to generate a highly convincing, realistic phishing email for a corporate training simulation.

**Target Context:**
- Department: ${department}
- Company: ${companyName}
- Difficulty: ${difficulty} (beginner, medium, high)

**Difficulty Guidelines:**
- Beginner: Obvious urgency, slight misspellings, generic greetings.
- Medium: Professional tone, context-aware for the department, spoofed internal tools (e.g., HR portal for HR, AWS for Engineering).
- High: Extremely subtle spear-phishing. Impeccable grammar, references specific deep department workflows, executive impersonation or vendor impersonation.

**Format Requirements:**
You MUST return ONLY valid JSON in the following format, with NO markdown formatting, NO backticks, and NO conversational text:
{
  "subject": "The email subject line",
  "body": "The HTML body of the email. Keep it professional. Use {{TRACKING_LINK}} exactly as written where the malicious link should go.",
  "fromName": "Spoofed Sender Name",
  "fromEmail": "spoofed@domain.com"
}

Ensure the HTML body is well-formatted and looks like a real corporate email. The CTA (Call to Action) button or link MUST use the {{TRACKING_LINK}} placeholder exactly.`;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 'Generate the phishing email JSON now.' }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.8,
                max_tokens: 1024,
                response_format: { type: "json_object" }
            });

            const responseText = completion.choices[0].message.content;
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Failed to generate AI phishing email:', error);
            throw error;
        }
    }
    /**
     * Generate an adaptive lab scenario based on HRI profile
     */
    async generateAdaptiveLab(hriProfile, domain) {
        if (!this.initialized) {
            throw new Error('LLM Service is not initialized. Cannot generate adaptive challenges.');
        }

        // Identify top susceptibility
        const vulnerabilities = [
            { name: 'Urgency', score: hriProfile.urgencySusceptibility },
            { name: 'Authority', score: hriProfile.authoritySusceptibility },
            { name: 'Reward', score: hriProfile.rewardSusceptibility },
            { name: 'Curiosity', score: hriProfile.curiositySusceptibility },
            { name: 'Fear', score: hriProfile.fearSusceptibility }
        ].sort((a, b) => b.score - a.score);

        const primaryVector = vulnerabilities[0].name;

        const systemPrompt = `You are the AntiPhishX Adaptive Intelligence Node.
Your goal is to generate a CUSTOM interactive lab scenario designed specifically to exploit a user's detected psychological vulnerabilities.

**User Risk Profile:**
- Primary Vulnerability: ${primaryVector}
- Target Domain: ${domain || 'General Enterprise'}
- Skill Level: ${hriProfile.riskScore < 30 ? 'Advanced' : 'Intermediate'}

**Vector Guidelines:**
- Urgency: Create a time-critical emergency (e.g., system lockout in 15 mins).
- Authority: Impersonate a C-level executive or law enforcement.
- Reward: Promise a significant financial bonus or recognition.
- Curiosity: Hint at internal leaks or secret corporate data.
- Fear: Threaten legal action or immediate termination.

**Format Requirements:**
You MUST return ONLY valid JSON in the following format:
{
  "title": "AI Adaptive Challenge: [Dynamic Title]",
  "description": "Short description of the challenge.",
  "scenario": "Detailed mission briefing.",
  "type": "email",
  "content": {
    "sender": "...",
    "subject": "...",
    "body": "...",
    "headers": { ... }
  },
  "correctAnswer": "neutralize",
  "hints": [
     {"level": 1, "hint": "..."},
     {"level": 2, "hint": "..."}
  ]
}

Ensure the content is extremely realistic and tailored to the ${primaryVector} vector.`;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Generate an adaptive ${domain} lab exploitation JSON for the ${primaryVector} vector.` }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.9,
                max_tokens: 1024,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Failed to generate adaptive AI lab:', error);
            throw error;
        }
    }

    /**
     * Intelligent Lab Evaluation - Semantic & Behavioral Analysis
     */
    async evaluateLabSubmission(lab, userResponse, telemetry = {}) {
        if (!this.initialized) {
            // Fallback to basic keyword matching if AI is offline
            const keywords = (lab.correctAnswer || '').toLowerCase().split(' ');
            const response = (userResponse || '').toLowerCase();
            const score = keywords.some(k => response.includes(k)) ? 100 : 0;
            return {
                isCorrect: score > 0,
                score,
                explanation: score > 0 
                    ? "Your determination matches the key indicators identified in this simulation." 
                    : "Your analysis failed to identify the critical threat vectors in this environment."
            };
        }

        const systemPrompt = `You are the AntiPhishX Tactical Evaluator.
Your mission is to analyze a user's final determination in a cybersecurity simulation and provide a definitive pass/fail judgment based on behavioral intelligence and semantic intent.

**LAB CONTEXT:**
- Title: ${lab.title}
- Topic: ${lab.topic}
- Scenario: ${lab.scenario}
- Target Answer/Intent: ${lab.correctAnswer}

**USER SUBMISSION:**
- Final Answer: ${userResponse}
- Telemetry: ${JSON.stringify(telemetry)}

**EVALUATION CRITERIA:**
1. SEMANTIC INTENT: Does the user's response accurately identify the core threat (or lack thereof)?
2. CLASSIFICATION MAPPING: 
   - If Target is "neutralize", "mitigate", or "block": User MUST identify a threat (e.g., "phishing", "malware", "suspicious", "vishing", "smishing", "ai_manipulation", "neural_attack").
   - If Target is "allow", "legitimate", or "safe": User MUST identify it as safe (e.g., "legitimate", "safe").
   - IMPORTANT: "phishing" is a synonym for identifying a threat that needs to be "neutralized". If the user picks ANY threat label for a "neutralize" target, they PASS.
3. NO EXACT MATCH: Do NOT require the user to use the exact words of the target answer. If they use synonyms or descriptive phrases that imply the same conclusion, they PASS.
4. BEHAVIORAL SUCCESS: Did the user demonstrate correct defensive behavior?
5. EDGE CASES: If the user identified the threat but was "hesitant" (telemetry), they still pass but you should mention the hesitation in your explanation.

**RESPONSE FORMAT (JSON ONLY):**
{
  "isCorrect": boolean,
  "score": number (0 to 100),
  "explanation": "Brief, expert feedback explaining WHY they passed or failed. Use a professional, cyber-noir tone."
}`;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 'Evaluate this submission now.' }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                max_tokens: 512,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('AI Evaluation Error:', error);
            // Final safety fallback with basic semantic mapping
            const target = (lab.correctAnswer || '').toLowerCase();
            const response = (userResponse || '').toLowerCase();
            
            // Map common synonyms for neutralization vs legitimacy
            const threatTerms = ['phishing', 'malware', 'suspicious', 'vishing', 'smishing', 'attack', 'manipulation', 'threat'];
            const safeTerms = ['legitimate', 'safe', 'allow', 'ok'];
            
            let isCorrect = response === target;
            if (!isCorrect) {
                if (['neutralize', 'block', 'mitigate'].includes(target)) {
                    isCorrect = threatTerms.some(term => response.includes(term));
                } else if (['allow', 'legitimate'].includes(target)) {
                    isCorrect = safeTerms.some(term => response.includes(term));
                }
            }

            return {
                isCorrect,
                score: isCorrect ? 100 : 0,
                explanation: isCorrect 
                    ? "Heuristic analyzer verified your determination." 
                    : "Heuristic analysis indicates a mismatch in threat classification."
            };
        }
    }
}

module.exports = new LLMService();
