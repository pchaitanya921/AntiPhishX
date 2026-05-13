const Groq = require('groq-sdk');
const crypto = require('crypto');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple in-memory cache to prevent spamming Groq with identical requests
// Maps sha256(content) -> { timestamp, data }
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache
const MAX_CACHE_SIZE = 1000;

function getFromCache(content) {
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const cached = cache.get(hash);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data;
    }
    return null;
}

function setInCache(content, data) {
    if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    cache.set(hash, { timestamp: Date.now(), data });
}

/**
 * @route   POST /api/detect/live
 * @desc    Analyze user input in real-time for phishing indicators
 * @access  Private
 */
exports.liveDetect = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.json({
                success: true,
                data: {
                    score: 0,
                    verdict: 'SAFE',
                    confidence: 'HIGH',
                    indicators: []
                }
            });
        }

        // Limit content length for live detection to prevent huge token usage
        const cleanContent = content.trim().substring(0, 1000);

        // Check cache
        const cachedAnalysis = getFromCache(cleanContent);
        if (cachedAnalysis) {
            return res.json({ success: true, data: cachedAnalysis });
        }

        const systemPrompt = `You are a real-time phishing detection engine. 
Analyze the user's input text (which may be an email, SMS, or URL).
Identify if it contains phishing indicators (urgency, spoofed domains, suspicious requests).

Return ONLY a valid JSON object matching this schema:
{
  "score": <0-100 integer, 0=safe, 100=phishing>,
  "verdict": "<SAFE|SUSPICIOUS|PHISHING>",
  "confidence": "<LOW|MEDIUM|HIGH>",
  "indicators": [
    { "match": "<exact word or phrase from text>", "type": "<urgency|credential_request|suspicious_link|impersonation>", "description": "<why it's suspicious>" }
  ]
}

Respond strictly with JSON. Do not include markdown formatting or extra text.`;

        const userPrompt = `Analyze this text:\n\n${cleanContent}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 500,
        });

        const rawResponse = completion.choices[0].message.content.trim();

        let analysis;
        try {
            const cleaned = rawResponse.replace(/```json|```/g, '').trim();
            analysis = JSON.parse(cleaned);
            
            // Validate schema loosely
            if (typeof analysis.score !== 'number') analysis.score = 50;
            if (!Array.isArray(analysis.indicators)) analysis.indicators = [];
            
        } catch (parseError) {
            console.error('Groq JSON Parse Error in live detect:', parseError, 'Raw:', rawResponse);
            analysis = {
                score: 30,
                verdict: 'SUSPICIOUS',
                confidence: 'LOW',
                indicators: []
            };
        }

        // Cache the result
        setInCache(cleanContent, analysis);

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Live Detection Error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze live content' });
    }
};
