const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Rule-Based Fallback Detection Engine ────────────────────────────────────

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click', '.link', '.online', '.site', '.pw', '.cc'];
const URGENCY_KEYWORDS = ['urgent', 'immediate', 'expires', 'act now', 'limited time', 'verify now', 'confirm now', 'suspended', 'locked', 'update now', 'action required', 'account will be', 'click here immediately', 'respond immediately'];
const CREDENTIAL_KEYWORDS = ['login', 'signin', 'password', 'credential', 'account', 'verify', 'confirm', 'authenticate', 'security update', 'update payment', 'credit card', 'ssn', 'social security'];
const SPOOFED_BRANDS = ['paypa1', 'paypai', 'paypa-l', 'amaz0n', 'micros0ft', 'g00gle', 'g0ogle', 'googl3', 'arnazon', 'amazon-', 'apple-id', 'apple-account', 'secure-apple', 'netflix-', 'netfl1x', 'bankof', 'wellsfarg0', 'wellsfargo-'];
const SUSPICIOUS_PATTERNS = ['secure-verify', 'account-verify', 'update-account', 'login-secure', 'signin-confirm', 'verify-account', 'confirm-identity', 'security-check', 'account-suspended', 'payment-required'];

function ruleBasedAnalysis(type, content) {
    const lower = content.toLowerCase();
    const indicators = [];
    let score = 0;

    if (type === 'url') {
        // Check suspicious TLDs
        for (const tld of SUSPICIOUS_TLDS) {
            if (lower.includes(tld)) {
                indicators.push({ type: 'suspicious_link', description: `Uses suspicious TLD "${tld}" — commonly associated with free/phishing domains`, severity: 'HIGH' });
                score += 20;
                break;
            }
        }

        // Check for IP address as domain
        if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
            indicators.push({ type: 'suspicious_link', description: 'URL uses a raw IP address instead of a domain name — a strong phishing indicator', severity: 'HIGH' });
            score += 30;
        }

        // Check for brand spoofing
        for (const brand of SPOOFED_BRANDS) {
            if (lower.includes(brand)) {
                indicators.push({ type: 'typosquatting', description: `Domain appears to impersonate a known brand using typosquatting: "${brand}"`, severity: 'HIGH' });
                score += 25;
                break;
            }
        }

        // Check suspicious URL patterns
        for (const pattern of SUSPICIOUS_PATTERNS) {
            if (lower.includes(pattern)) {
                indicators.push({ type: 'lookalike_domain', description: `URL contains suspicious pattern "${pattern}" designed to appear legitimate`, severity: 'MEDIUM' });
                score += 15;
                break;
            }
        }

        // Credential-related path
        for (const kw of CREDENTIAL_KEYWORDS) {
            if (lower.includes(kw)) {
                indicators.push({ type: 'credential_request', description: `URL path contains "${kw}" — may be a credential harvesting page`, severity: 'MEDIUM' });
                score += 10;
                break;
            }
        }

        // Urgency query params
        for (const kw of URGENCY_KEYWORDS) {
            if (lower.includes(kw)) {
                indicators.push({ type: 'urgency_language', description: `URL contains urgency trigger "${kw}" to pressure users into acting`, severity: 'MEDIUM' });
                score += 10;
                break;
            }
        }

        // Excessive subdomains
        try {
            const url = new URL(content.startsWith('http') ? content : 'http://' + content);
            const parts = url.hostname.split('.');
            if (parts.length > 4) {
                indicators.push({ type: 'redirect_chain', description: `URL has ${parts.length - 2} subdomain levels — excessive subdomains are used to obscure the real domain`, severity: 'MEDIUM' });
                score += 15;
            }
        } catch (_) {}

    } else {
        // Email / SMS analysis
        for (const kw of URGENCY_KEYWORDS) {
            if (lower.includes(kw)) {
                indicators.push({ type: 'urgency_language', description: `Message contains urgency language: "${kw}" — a classic social engineering tactic`, severity: 'HIGH' });
                score += 20;
                break;
            }
        }

        for (const kw of CREDENTIAL_KEYWORDS) {
            if (lower.includes(kw)) {
                indicators.push({ type: 'credential_request', description: `Message requests sensitive information: "${kw}"`, severity: 'HIGH' });
                score += 20;
                break;
            }
        }

        // Suspicious links embedded
        for (const tld of SUSPICIOUS_TLDS) {
            if (lower.includes(tld)) {
                indicators.push({ type: 'suspicious_link', description: `Contains a link with suspicious TLD "${tld}"`, severity: 'HIGH' });
                score += 20;
                break;
            }
        }

        for (const brand of SPOOFED_BRANDS) {
            if (lower.includes(brand)) {
                indicators.push({ type: 'domain_spoofing', description: `Mentions a spoofed brand name "${brand}"`, severity: 'HIGH' });
                score += 25;
                break;
            }
        }

        // Generic threats
        if (/\bclick\s+here\b/i.test(content)) {
            indicators.push({ type: 'suspicious_link', description: '"Click here" call-to-action without displaying the actual URL — a red flag', severity: 'MEDIUM' });
            score += 10;
        }

        if (/prize|won|winner|lottery|reward|gift card|coupon|free iphone/i.test(lower)) {
            indicators.push({ type: 'urgency_language', description: 'Message offers prizes or rewards — a common lure tactic', severity: 'MEDIUM' });
            score += 15;
        }
    }

    // Cap score at 98
    score = Math.min(score, 98);

    let verdict, confidence;
    if (score >= 70) {
        verdict = 'PHISHING';
        confidence = score >= 85 ? 'HIGH' : 'MEDIUM';
    } else if (score >= 30) {
        verdict = 'SUSPICIOUS';
        confidence = 'MEDIUM';
    } else {
        verdict = 'SAFE';
        confidence = indicators.length === 0 ? 'HIGH' : 'MEDIUM';
    }

    const explanation = verdict === 'SAFE'
        ? 'No significant phishing indicators were detected in this content. It appears to be legitimate based on rule-based analysis.'
        : verdict === 'SUSPICIOUS'
            ? `This ${type} has ${indicators.length} suspicious indicator(s) that warrant caution, but may not be definitively malicious.`
            : `This ${type} exhibits ${indicators.length} high-confidence phishing indicator(s). Do not interact with this content.`;

    const recommendations = verdict === 'SAFE'
        ? ['Continue to remain vigilant for unexpected communication', 'Verify the sender independently if in doubt']
        : verdict === 'SUSPICIOUS'
            ? ['Do not click links or download attachments without verification', 'Contact the alleged sender via official channels to confirm', 'Report to your IT/security team if received in a work context']
            : ['Do not click any links or provide any information', 'Report as phishing to your email provider', 'Delete this message immediately', 'If you already interacted, change your passwords and contact your bank'];

    return { score, verdict, confidence, indicators, explanation, recommendations };
}

// ─── Main Analyze Handler ─────────────────────────────────────────────────────

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

        let analysis;
        let usedFallback = false;

        try {
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

            try {
                const cleaned = rawResponse.replace(/```json|```/g, '').trim();
                analysis = JSON.parse(cleaned);
            } catch (parseError) {
                analysis = {
                    score: 50,
                    verdict: 'SUSPICIOUS',
                    confidence: 'LOW',
                    indicators: [],
                    explanation: rawResponse,
                    recommendations: ['Review content manually', 'Do not click any links']
                };
            }
        } catch (aiError) {
            // AI failed — use rule-based fallback silently
            console.warn('Groq AI unavailable, using rule-based fallback:', aiError?.status || aiError?.message);
            analysis = ruleBasedAnalysis(type, content);
            usedFallback = true;
        }

        res.json({
            success: true,
            data: {
                type,
                content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                analysis,
                analyzedAt: new Date().toISOString(),
                engine: usedFallback ? 'rule-based' : 'groq-ai'
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
