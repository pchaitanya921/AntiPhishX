const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @route   POST /api/phishing/analyze
 * @desc    Analyze URL / email / SMS content for phishing indicators
 * @access  Private
 */
exports.analyze = async (req, res) => {
    try {
        const { type, content } = req.body;

        if (!type || !content) {
            return res.status(400).json({ success: false, error: 'type and content are required' });
        }

        if (!['url', 'email', 'sms'].includes(type)) {
            return res.status(400).json({ success: false, error: 'type must be url, email, or sms' });
        }

        const systemPrompt = `You are an expert phishing detection AI used in a cybersecurity training platform.
Analyze the provided ${type} content and return a structured JSON risk assessment.

IMPORTANT: Always respond with valid JSON only — no markdown, no code blocks.

JSON format:
{
  "score": <0-100 integer, where 0=completely safe, 100=confirmed phishing>,
  "verdict": "<SAFE|SUSPICIOUS|PHISHING>",
  "confidence": "<LOW|MEDIUM|HIGH>",
  "indicators": [
    { "type": "<type>", "description": "<description>", "severity": "<LOW|MEDIUM|HIGH>" }
  ],
  "explanation": "<2-3 sentence plain English summary>",
  "recommendations": ["<action1>", "<action2>"]
}

Scoring guide:
- 0-30: SAFE — no phishing indicators detected
- 31-69: SUSPICIOUS — some red flags present, could be legitimate
- 70-100: PHISHING — strong phishing indicators, do not interact

Common indicator types: "domain_spoofing", "urgency_language", "credential_request", "suspicious_link", "lookalike_domain", "typosquatting", "authentication_failure", "unusual_sender", "malicious_attachment", "redirect_chain"`;

        const userPrompt = `Analyze this ${type.toUpperCase()} for phishing:\n\n${content}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            max_tokens: 1024,
        });

        const rawResponse = completion.choices[0].message.content.trim();

        let analysis;
        try {
            // Strip any accidental markdown fences
            const cleaned = rawResponse.replace(/```json|```/g, '').trim();
            analysis = JSON.parse(cleaned);
        } catch (parseError) {
            // Fallback if JSON parsing fails
            analysis = {
                score: 50,
                verdict: 'SUSPICIOUS',
                confidence: 'LOW',
                indicators: [],
                explanation: rawResponse,
                recommendations: ['Review content manually', 'Do not click any links']
            };
        }

        res.json({
            success: true,
            data: {
                type,
                content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                analysis,
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Phishing Analysis Error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze content', message: error.message });
    }
};

/**
 * @route   GET /api/phishing/datasets
 * @desc    Get reference dataset information for research
 * @access  Private
 */
exports.getDatasets = async (req, res) => {
    const datasets = [
        {
            name: 'PhishTank',
            description: 'Community-curated database of verified phishing URLs, maintained by OpenDNS',
            url: 'https://phishtank.org',
            size: '100,000+ verified phishing URLs',
            features: ['URL', 'Target', 'Verified', 'Online'],
            usedFor: 'URL-based phishing detection training and real-time threat lookup',
            citation: 'PhishTank. (2024). PhishTank Developer Information. OpenDNS.'
        },
        {
            name: 'Kaggle Phishing Websites Dataset',
            description: '11,000+ URLs with 30 extracted features used widely in ML research',
            url: 'https://www.kaggle.com/datasets/eswarchandt/phishing-website-detector',
            size: '11,055 URLs, 30 features',
            features: ['Having_IP_Address', 'URL_Length', 'Shortining_Service', 'Having_Sub_Domain', 'SSLfinal_State', 'Domain_registeration_length'],
            usedFor: 'Feature-based phishing classification using ML models (RF, SVM, XGBoost)',
            citation: 'Chandra, T. (2021). Phishing Website Dataset. Kaggle.'
        },
        {
            name: 'Enron Email Dataset',
            description: 'Large corpus of real emails from Enron Corporation, widely used for spam/phishing detection',
            url: 'https://www.cs.cmu.edu/~./enron/',
            size: '500,000+ emails from 150 users',
            features: ['Email headers', 'Body text', 'Attachments', 'Metadata'],
            usedFor: 'Email-based social engineering detection and LLM fine-tuning',
            citation: 'Klimt, B., & Yang, Y. (2004). The Enron Corpus. ECML.'
        },
        {
            name: 'OpenPhish Feed',
            description: 'Real-time phishing intelligence feed with active phishing sites',
            url: 'https://openphish.com',
            size: 'Live feed — thousands of active phishing URLs daily',
            features: ['URL', 'Target brand', 'Date discovered'],
            usedFor: 'Real-time threat intelligence integration',
            citation: 'OpenPhish. (2024). Phishing Intelligence. OpenPhish Team.'
        }
    ];

    res.json({ success: true, data: datasets });
};
