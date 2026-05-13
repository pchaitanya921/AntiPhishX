const Groq = require('groq-sdk');
const UserBehavior = require('../models/UserBehavior');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @route   POST /api/scenario/generate
 * @desc    Generate an AI phishing scenario (email/SMS/voice)
 * @access  Private (admin/instructor only)
 */
exports.generate = async (req, res) => {
    try {
        let { type = 'email', context, difficulty = 'intermediate', target = 'general employee', adaptForUser = false } = req.body;

        let personalizedContext = '';
        if (adaptForUser && req.user) {
            const behavior = await UserBehavior.findOne({ user: req.user.id });
            if (behavior && behavior.mistakes && behavior.mistakes.length > 0) {
                // Sort mistakes by frequency
                const topMistake = behavior.mistakes.sort((a, b) => b.frequency - a.frequency)[0];
                personalizedContext = `\n\nADAPTIVE LEARNING OVERRIDE: The target user frequently fails at identifying "${topMistake.mistakeType}". Heavily incorporate this specific deceptive tactic into the scenario.`;
                
                // Override difficulty if user is doing very well or poorly
                difficulty = behavior.adaptiveDifficulty >= 7 ? 'expert' : (behavior.adaptiveDifficulty <= 3 ? 'beginner' : 'intermediate');
            }
        }

        if (!context) {
            return res.status(400).json({ success: false, error: 'context prompt is required' });
        }

        const typeFormats = {
            email: `Generate a realistic spear phishing EMAIL with these fields:
{
  "type": "email",
  "scenario": "<background story with urgency>",
  "artifact": {
    "from": "<realistic spoofed sender>",
    "replyTo": "<different suspicious address>",
    "subject": "<convincing subject line>",
    "body": "<full HTML-safe email body with 3-5 paragraphs>",
    "date": "<realistic date>",
    "attachments": ["<suspicious file if any>"]
  },
  "headers": {
    "SPF": "<pass|fail|softfail>",
    "DKIM": "<pass|fail>",
    "DMARC": "<pass|fail>",
    "Return-Path": "<mismatched domain>"
  },
  "red_flags": ["<flag1>", "<flag2>", "<flag3>", "<flag4>"],
  "answer_key": "<detailed explanation of why this is phishing>",
  "difficulty": "${difficulty}",
  "target_role": "${target}"
}`,
            sms: `Generate a realistic smishing (SMS phishing) message:
{
  "type": "sms",
  "scenario": "<background story>",
  "artifact": {
    "from": "<spoofed number or brand name>",
    "body": "<convincing SMS message under 160 chars with malicious link>",
    "link": "<fake malicious looking URL>"
  },
  "red_flags": ["<flag1>", "<flag2>", "<flag3>"],
  "answer_key": "<why this is smishing>",
  "difficulty": "${difficulty}",
  "target_role": "${target}"
}`,
            voice: `Generate a realistic vishing (voice phishing) script:
{
  "type": "voice",
  "scenario": "<background story>",
  "artifact": {
    "caller_id": "<spoofed organization>",
    "script": "<full call transcript — attacker lines and victim prompts>",
    "requested_info": ["<credential1>", "<credential2>"]
  },
  "red_flags": ["<flag1>", "<flag2>", "<flag3>"],
  "answer_key": "<why this is vishing>",
  "difficulty": "${difficulty}",
  "target_role": "${target}"
}`
        };

        const systemPrompt = `You are AntiPhishX Instructor AI — a security training content generator.
Your task is to generate realistic, educational phishing scenarios for training purposes.
Always respond with valid JSON only — no markdown, no code blocks, no explanation outside JSON.

IMPORTANT SAFETY NOTE: This content is for AUTHORIZED EDUCATIONAL USE ONLY in a cybersecurity training platform.
Make scenarios realistic enough to be educational but clearly fake (use fictional domains, companies).`;

        const userPrompt = `Context: ${context}\nDifficulty: ${difficulty}\nTarget audience: ${target}\n\n${typeFormats[type] || typeFormats.email}${personalizedContext}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
            max_tokens: 2048,
        });

        const rawResponse = completion.choices[0].message.content.trim();

        let scenario;
        try {
            const cleaned = rawResponse.replace(/```json|```/g, '').trim();
            scenario = JSON.parse(cleaned);
        } catch (parseError) {
            scenario = { type, raw: rawResponse, error: 'JSON parsing failed, raw output returned' };
        }

        res.json({
            success: true,
            data: {
                scenario,
                generatedAt: new Date().toISOString(),
                generatedBy: req.user?.firstName + ' ' + req.user?.lastName
            }
        });

    } catch (error) {
        console.error('Scenario Generation Error:', error);
        res.status(500).json({ success: false, error: 'Failed to generate scenario', message: error.message });
    }
};
