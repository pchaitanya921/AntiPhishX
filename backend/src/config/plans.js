const PLANS = {
    CORE: 'core_node',
    NEURAL: 'neural_advanced',
    LATTICE: 'enterprise_lattice'
};

const PLAN_HIERARCHY = {
    [PLANS.CORE]: 1,
    [PLANS.NEURAL]: 2,
    [PLANS.LATTICE]: 3
};

/**
 * Mapping of content levels to minimum required plans
 */
const LEVEL_TO_PLAN = {
    'beginner': PLANS.CORE,
    'intermediate': PLANS.NEURAL,
    'advanced': PLANS.NEURAL,
    'expert': PLANS.LATTICE,
    // Variations used in different models
    'Beginner': PLANS.CORE,
    'Intermediate': PLANS.NEURAL,
    'Expert': PLANS.LATTICE
};

/**
 * Mapping of technical topics to minimum required plans
 */
const TOPIC_TO_PLAN = {
    'executive_intelligence': PLANS.NEURAL,
    'tactical_defense': PLANS.NEURAL,
    'cognitive_security': PLANS.CORE,
    'advanced_ai_adaptive': PLANS.NEURAL,
    'neural_attacks': PLANS.NEURAL,
    'social_engineering': PLANS.NEURAL,
    'advanced_threats': PLANS.NEURAL,
    'malware_detection': PLANS.NEURAL,
    'phishing': PLANS.CORE,
    'vishing': PLANS.CORE,
    'smishing': PLANS.CORE,
    'qr_code': PLANS.CORE
};

const PLAN_CONFIG = {
    [PLANS.CORE]: {
        name: 'CORE NODE',
        tagline: 'Essential Cyber Resilience',
        pricing: {
            monthly: { price: '₹399', amount: 39900, label: '/user/month' },
            annual: { price: '₹3999', amount: 399900, label: '/user/year', savings: 'Save ₹789 yearly' }
        },
        deviceLimit: 2,
        features: [
            'Beginner Training Modules',
            'Basic Phishing Simulations',
            'Standard HRI Scorecard',
            'Email Support',
            'Maximum 2 Devices'
        ]
    },
    [PLANS.NEURAL]: {
        name: 'NEURAL ADVANCED',
        tagline: 'AI-Adaptive Defense',
        pricing: {
            monthly: { price: '₹999', amount: 99900, label: '/user/month' },
            annual: { price: '₹9999', amount: 999900, label: '/user/year', savings: 'Save ₹1,989 yearly' }
        },
        deviceLimit: 5,
        features: [
            'All CORE Features',
            'AI-Adaptive Simulations',
            'Advanced Risk Modeling',
            'Custom Lab Environments',
            'Maximum 5 Devices'
        ]
    },
    [PLANS.LATTICE]: {
        name: 'ENTERPRISE LATTICE',
        tagline: 'Full Spectrum Intelligence',
        pricing: {
            monthly: { price: '₹5999', amount: 599900, label: '/user/month' },
            annual: { price: '₹59999', amount: 5999900, label: '/user/year', savings: 'Save ₹11,989 yearly' }
        },
        deviceLimit: 9999, // Unlimited
        features: [
            'All NEURAL Features',
            'Executive Risk Intelligence',
            'Multi-tenant Governance',
            'SCIM/SSO Provisioning',
            'Custom AI Model Training',
            'Dedicated Success Architect'
        ]
    }
};

/**
 * Check if a plan meets or exceeds the required tier
 * @param {string} currentPlan The user's current plan
 * @param {string} requiredPlan The required plan level
 * @returns {boolean}
 */
const hasPlanAccess = (currentPlan, requiredPlan) => {
    if (!currentPlan) return false;
    const currentLevel = PLAN_HIERARCHY[currentPlan] || 0;
    const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
    return currentLevel >= requiredLevel;
};

/**
 * Check if a user has access to a specific content level
 * @param {string} userPlan 
 * @param {string} contentLevel 
 * @returns {boolean}
 */
const canAccessLevel = (userPlan, contentLevel) => {
    const requiredPlan = LEVEL_TO_PLAN[contentLevel] || PLANS.CORE;
    return hasPlanAccess(userPlan, requiredPlan);
};

/**
 * Comprehensive check for resource access (Level + Topic + Status)
 * @param {Object} user The user object from req.user
 * @param {string} level The required difficulty level
 * @param {string} topic The technical topic
 */
const canAccessResource = (user, level, topic) => {
    if (!user) return false;

    // Internal Roles Bypass
    const internalRoles = ['superAdmin', 'enterpriseAdmin', 'internalTester'];
    if (internalRoles.includes(user.role)) return true;

    // 1. Subscription Status Check
    // If expired, they only get CORE access
    const effectivePlan = (user.subscriptionStatus === 'expired') ? PLANS.CORE : (user.currentPlan || PLANS.CORE);

    // 2. Check Level Requirement
    const requiredLevelPlan = LEVEL_TO_PLAN[level] || PLANS.CORE;
    if (!hasPlanAccess(effectivePlan, requiredLevelPlan)) return false;

    // 3. Check Topic Requirement
    const requiredTopicPlan = TOPIC_TO_PLAN[topic] || PLANS.CORE;
    if (!hasPlanAccess(effectivePlan, requiredTopicPlan)) return false;

    return true;
};

module.exports = {
    PLANS,
    PLAN_HIERARCHY,
    PLAN_CONFIG,
    hasPlanAccess,
    canAccessLevel,
    canAccessResource,
    LEVEL_TO_PLAN,
    TOPIC_TO_PLAN
};
