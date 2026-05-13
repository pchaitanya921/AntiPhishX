export const PLANS = {
    CORE: 'core_node',
    NEURAL: 'neural_advanced',
    LATTICE: 'enterprise_lattice'
};

export const LEVEL_TO_PLAN = {
    'beginner': PLANS.CORE,
    'intermediate': PLANS.NEURAL,
    'advanced': PLANS.NEURAL,
    'expert': PLANS.LATTICE
};

export const TOPIC_TO_PLAN = {
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

export const PLAN_CONFIG = {
    [PLANS.CORE]: {
        id: PLANS.CORE,
        name: 'CORE NODE',
        color: 'emerald',
        tier: 1,
        description: 'Foundational security awareness for high-velocity teams.',
        price: '₹399/user/month'
    },
    [PLANS.NEURAL]: {
        id: PLANS.NEURAL,
        name: 'NEURAL ADVANCED',
        color: 'cyan',
        tier: 2,
        description: 'AI-driven behavioral intelligence and adaptive defense.',
        price: '₹999/user/month'
    },
    [PLANS.LATTICE]: {
        id: PLANS.LATTICE,
        name: 'ENTERPRISE LATTICE',
        color: 'purple',
        tier: 3,
        description: 'Complete spectrum enterprise cybersecurity orchestration.',
        price: 'Custom Pricing'
    }
};

/**
 * Checks if the current user's plan meets the requirement
 */
export const hasPlanAccess = (userPlan, requiredPlanId) => {
    if (!userPlan) return false;
    const currentTier = PLAN_CONFIG[userPlan]?.tier || 0;
    const requiredTier = PLAN_CONFIG[requiredPlanId]?.tier || 0;
    return currentTier >= requiredTier;
};

/**
 * Comprehensive check for resource access (Level + Topic + Status)
 * Matches backend logic for unified entitlement.
 */
export const canAccessResource = (user, level, topic) => {
    if (!user) return false;

    // Internal Roles Bypass
    const internalRoles = ['superAdmin', 'enterpriseAdmin', 'internalTester'];
    if (internalRoles.includes(user.role)) return true;

    // 1. Subscription Status Check
    const effectivePlan = (user.subscriptionStatus === 'expired') ? PLANS.CORE : (user.currentPlan || PLANS.CORE);

    // 2. Check Level Requirement
    const requiredLevelPlan = LEVEL_TO_PLAN[level] || PLANS.CORE;
    if (!hasPlanAccess(effectivePlan, requiredLevelPlan)) return false;

    // 3. Check Topic Requirement
    const requiredTopicPlan = TOPIC_TO_PLAN[topic] || PLANS.CORE;
    if (!hasPlanAccess(effectivePlan, requiredTopicPlan)) return false;

    return true;
};
