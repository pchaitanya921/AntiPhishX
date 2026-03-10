/**
 * Topic Filter Middleware
 * Restricts Cyber Chat mode to cybersecurity topics only
 */

const ALLOWED_TOPICS = [
    // Phishing & Email Security
    'phishing', 'spear-phishing', 'whaling', 'bec', 'business email compromise',
    'email security', 'spf', 'dkim', 'dmarc', 'email authentication',

    // Malware
    'malware', 'ransomware', 'trojan', 'virus', 'worm', 'rootkit',
    'spyware', 'adware', 'keylogger', 'backdoor', 'botnet',

    // SOC & Defense
    'soc', 'security operations center', 'blue team', 'defensive security',
    'incident response', 'dfir', 'forensics', 'threat hunting',
    'siem', 'log analysis', 'monitoring', 'detection',

    // Network Security
    'network security', 'firewall', 'ids', 'ips', 'intrusion detection',
    'intrusion prevention', 'vpn', 'proxy', 'dns security',

    // Frameworks & Standards
    'mitre', 'attack', 'mitre att&ck', 'kill chain', 'cyber kill chain',
    'nist', 'iso 27001', 'cis controls',

    // General Security
    'vulnerability', 'cve', 'exploit', 'patch management',
    'hardening', 'endpoint protection', 'antivirus', 'edr',
    'threat intelligence', 'ioc', 'indicators of compromise',
    'security awareness', 'training', 'cybersecurity',
    'information security', 'infosec'
];

const BLOCKED_KEYWORDS = [
    // Entertainment
    'movie', 'film', 'game', 'gaming', 'sports', 'football',
    'basketball', 'music', 'concert', 'tv show', 'netflix',

    // General Topics
    'recipe', 'cooking', 'food', 'restaurant', 'travel',
    'vacation', 'weather', 'car', 'clothing', 'fashion',

    // Academic (non-security)
    'math homework', 'chemistry', 'biology', 'physics',
    'literature', 'history', 'geography'
];

/**
 * Check if message is cybersecurity-related
 */
const isCyberSecurityTopic = (message) => {
    const lowerMessage = message.toLowerCase();

    // Check if contains blocked keywords
    const hasBlockedTopic = BLOCKED_KEYWORDS.some(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
    );

    if (hasBlockedTopic) {
        return false;
    }

    // Check if contains allowed cybersecurity topics
    const hasCyberTopic = ALLOWED_TOPICS.some(topic =>
        lowerMessage.includes(topic.toLowerCase())
    );

    // Very short messages (like "hi", "hello") are allowed
    if (message.trim().split(' ').length <= 2) {
        return true;
    }

    return hasCyberTopic;
};

/**
 * Topic Filter Middleware
 * Restricts topics in Cyber Chat mode
 */
const topicFilter = (req, res, next) => {
    const { mode, messages } = req.body;

    // Only apply to cyber mode
    if (mode !== 'cyber') {
        return next();
    }

    // Check the last user message
    if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage.role === 'user' && !isCyberSecurityTopic(lastMessage.content)) {
            return res.status(400).json({
                error: 'TOPIC_RESTRICTION',
                message: 'This assistant is restricted to cybersecurity defense topics only. Please ask questions related to phishing, malware, SOC operations, incident response, or other defensive security topics.',
                type: 'topic_violation'
            });
        }
    }

    next();
};

module.exports = {
    topicFilter,
    isCyberSecurityTopic,
    ALLOWED_TOPICS,
    BLOCKED_KEYWORDS
};
