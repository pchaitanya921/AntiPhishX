const ROLES = {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    LEARNER: 'learner'
};

const PERMISSIONS = {
    // Global
    VIEW_ALL_USERS: 'view_all_users',
    MANAGE_ALL_USERS: 'manage_all_users',
    VIEW_GLOBAL_ANALYTICS: 'view_global_analytics',
    
    // AI Tools
    USE_AI_COPILOT: 'use_ai_copilot',
    GENERATE_AI_SCENARIO: 'generate_ai_scenario',
    SAVE_AI_SCENARIO: 'save_ai_scenario',
    USE_PHISHING_SCANNER: 'use_phishing_scanner',
    
    // Labs & Quizzes
    ATTEMPT_LAB: 'attempt_lab',
    CREATE_LAB: 'create_lab',
    REVIEW_LABS: 'review_labs', // for their students
    CREATE_QUIZ: 'create_quiz',
    ATTEMPT_QUIZ: 'attempt_quiz',

    // Courses
    VIEW_COURSES: 'view_courses',
    CREATE_COURSE: 'create_course',
    
    // Analytics & Logs
    VIEW_COURSE_ANALYTICS: 'view_course_analytics', // instructor
    VIEW_PERSONAL_ANALYTICS: 'view_personal_analytics', // learner
    VIEW_SECURITY_LOGS: 'view_security_logs', // admin
    VIEW_PERSONAL_LOGS: 'view_personal_logs', // learner
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin gets everything
    [ROLES.INSTRUCTOR]: [
        PERMISSIONS.USE_AI_COPILOT,
        PERMISSIONS.GENERATE_AI_SCENARIO,
        PERMISSIONS.SAVE_AI_SCENARIO,
        PERMISSIONS.USE_PHISHING_SCANNER,
        PERMISSIONS.ATTEMPT_LAB,
        PERMISSIONS.CREATE_LAB,
        PERMISSIONS.REVIEW_LABS,
        PERMISSIONS.CREATE_QUIZ,
        PERMISSIONS.ATTEMPT_QUIZ,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.CREATE_COURSE,
        PERMISSIONS.VIEW_COURSE_ANALYTICS,
        PERMISSIONS.VIEW_PERSONAL_ANALYTICS,
        PERMISSIONS.VIEW_PERSONAL_LOGS,
    ],
    [ROLES.LEARNER]: [
        PERMISSIONS.USE_AI_COPILOT,
        PERMISSIONS.GENERATE_AI_SCENARIO, // limited use
        PERMISSIONS.USE_PHISHING_SCANNER,
        PERMISSIONS.ATTEMPT_LAB,
        PERMISSIONS.ATTEMPT_QUIZ,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.VIEW_PERSONAL_ANALYTICS,
        PERMISSIONS.VIEW_PERSONAL_LOGS,
    ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role User's role
 * @param {string} permission Permission to check
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
};

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission
};
