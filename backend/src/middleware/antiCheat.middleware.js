/**
 * Anti-Cheat Middleware
 * Prevents users from requesting direct answers in Lab Assistant mode
 */

const BANNED_PHRASES = [
    'give answer',
    'give me the answer',
    'what is the answer',
    'tell me the answer',
    'correct option',
    'which option is correct',
    'is this phishing',
    'is it phishing',
    'just tell me',
    'tell me the solution',
    'what should i choose',
    'which one should i pick',
    'give me the solution',
    'show me the answer'
];

const GUIDED_RESPONSES = [
    "Let's analyze this together. What indicators do you observe in the email?",
    "Instead of providing the answer, let me guide you. What makes you think this might be phishing?",
    "My role is to help you develop analysis skills. Let's start by examining the sender domain - what do you notice?",
    "Rather than giving you the answer, let's break down the indicators. What security headers should we check?",
    "I can't confirm answers directly, but I can guide your analysis. What red flags have you identified so far?"
];

/**
 * Check if message contains banned phrases
 */
const containsBannedPhrase = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    return BANNED_PHRASES.some(phrase => lowerMessage.includes(phrase));
};

/**
 * Get random guided response
 */
const getGuidedResponse = () => {
    return GUIDED_RESPONSES[Math.floor(Math.random() * GUIDED_RESPONSES.length)];
};

/**
 * Anti-Cheat Filter Middleware
 * Blocks direct answer requests before reaching LLM
 */
const antiCheatFilter = (req, res, next) => {
    const { mode, messages } = req.body;

    // Only apply to lab mode
    if (mode !== 'lab') {
        return next();
    }

    // Check the last user message
    if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage.role === 'user' && containsBannedPhrase(lastMessage.content)) {
            return res.status(400).json({
                error: 'ANTI_CHEAT_VIOLATION',
                message: getGuidedResponse(),
                type: 'guided_response'
            });
        }
    }

    next();
};

module.exports = {
    antiCheatFilter,
    containsBannedPhrase,
    getGuidedResponse
};
