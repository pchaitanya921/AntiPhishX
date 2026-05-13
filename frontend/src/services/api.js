import axios from 'axios';
import toast from 'react-hot-toast';
import { load } from '@fingerprintjs/fingerprintjs';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let deviceId = null;
const getDeviceId = async () => {
    try {
        if (deviceId) return deviceId;
        const fp = await load();
        const result = await fp.get();
        deviceId = result.visitorId;
        return deviceId;
    } catch (err) {
        console.error('Device Fingerprint Error:', err);
        return null;
    }
};

// Request interceptor to add auth token and device ID
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            const dId = await getDeviceId();
            if (dId) {
                config.headers['x-device-id'] = dId;
            }
        } catch (e) {
            console.warn('Could not attach device identity');
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Supabase handles token refresh automatically through its session mechanism
                // We just need to trigger a session refresh if it's nearing expiry
                const { data, error: refreshError } = await axios.post(`${API_BASE_URL}/auth/refresh`);

                if (refreshError || !data.success) {
                    throw new Error('Sync handshake failed');
                }

                // Supabase client should have updated the token in its own state
                // We just need to get the latest token from local storage or session
                const token = localStorage.getItem('accessToken');
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Auth Refresh Failed - Redirecting to login", err);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        if (error.response?.status === 403 && error.response?.data?.code === 'DEVICE_LIMIT_EXCEEDED') {
            toast.error(error.response.data.message);
            window.location.href = '/dashboard/devices';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    getMe: () => api.get('/auth/me'),
    getBehavior: () => api.get('/auth/behavior'),
    getDevices: () => api.get('/auth/devices'),
    removeDevice: (deviceId) => api.delete(`/auth/devices/${deviceId}`),
};

// Payment API
export const paymentAPI = {
    createOrder: (planId, billingCycle = 'monthly') => api.post('/payments/order', { planId, billingCycle }),
    verifyPayment: (data) => api.post('/payments/verify', data),
};

// Subscription API
export const subscriptionAPI = {
    getAll: () => api.get('/subscriptions'),
    updatePlan: (userId, data) => api.put(`/subscriptions/${userId}`, data),
    getAnalytics: () => api.get('/subscriptions/analytics'),
};

// Course API
export const courseAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getById: (id) => api.get(`/courses/${id}`),
    enroll: (id) => api.post(`/courses/${id}/enroll`),
    getMyCourses: () => api.get('/courses/my-courses'),
};

// Enterprise Request API
export const enterpriseRequestAPI = {
    create: (data) => api.post('/enterprise/request', data),
    getAll: () => api.get('/enterprise/requests'),
    updateStatus: (id, status, extraData = {}) => api.put(`/enterprise/requests/${id}`, { status, ...extraData }),
    convertToPilot: (id) => api.post(`/enterprise/requests/${id}/convert-to-pilot`)
};

// Quiz API
export const quizAPI = {
    getById: (id) => api.get(`/quizzes/${id}`),
    take: (id) => api.get(`/quizzes/${id}/take`),
    submit: (id, data) => api.post(`/quizzes/${id}/submit`, data),
    getAttempts: (id) => api.get(`/quizzes/${id}/attempts`),
};

// Lab API
export const labAPI = {
    getAll: (params) => api.get('/labs', { params }),
    getById: (id) => api.get(`/labs/${id}`),
    start: (id) => api.post(`/labs/${id}/start`),
    trackAction: (id, data) => api.post(`/labs/simulations/${id}/track`, data),
    submit: (id, data) => api.post(`/labs/simulations/${id}/submit`, data),
    getAttempts: (id) => api.get(`/labs/${id}/attempts`),
    startSession: (id) => api.post(`/labs/${id}/session`).then(res => res.data),
    submitStage: (id, data) => api.post(`/labs/${id}/session/submit`, data).then(res => res.data),
    getAdaptiveNext: () => api.get('/labs/adaptive/next'),
    getNeuralRoadmap: () => api.get('/labs/adaptive/roadmap')
};

// Certificates API
export const certificatesAPI = {
    getMyCertificates: () => api.get('/certificates'),
    getCertificate: (id) => api.get(`/certificates/${id}`),
    download: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
    verify: (certId) => api.get(`/certificates/verify/${certId}`),
    check: (data) => api.post('/certificates/check', data),
    getEligibility: (data) => api.post('/certificates/eligibility', data)
};

// Instructor API
export const instructorAPI = {
    getDashboard: () => api.get('/instructor/dashboard'),
    getMyCourses: () => api.get('/instructor/my-courses'),
    createCourse: (data) => api.post('/instructor/courses/wizard', data),
    buildQuiz: (data) => api.post('/instructor/quizzes/builder', data),
    getCourseAnalytics: (id) => api.get(`/instructor/courses/${id}/analytics`),
    getCourseLearners: (id) => api.get(`/instructor/courses/${id}/learners`),
    getPendingLabs: () => api.get('/instructor/labs/pending'),
    reviewLab: (id, data) => api.post(`/instructor/labs/${id}/review`, data),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    bulkUserOperation: (data) => api.post('/admin/users/bulk', data),
    getAllCourses: (params) => api.get('/admin/courses', { params }),
    createCourse: (data) => api.post('/admin/courses', data),
    updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
    getSecurityLogs: (params) => api.get('/admin/security/logs', { params }),
    getPlatformAnalytics: () => api.get('/admin/analytics'),
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.put('/admin/settings', data),
    generateTranscript: (id, level, videoIdx) => api.post(`/admin/courses/${id}/generate-transcripts`, { level, videoIdx }),
    uploadVideo: (data, onUploadProgress) => api.post('/admin/upload-video', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
    }),
    // Gamification — admin platform-wide views
    getAllUserAchievements: () => api.get('/admin/achievements'),
    getAllUserBadges: () => api.get('/admin/badges'),
    getAllCertificates: () => api.get('/admin/certificates'),
};

// Analytics API
export const analyticsAPI = {
    getUserAnalytics: () => api.get('/analytics/user'),
    getHRI: () => api.get('/analytics/hri'),
    getPlatformStats: () => api.get('/analytics/platform'),
};

// Enterprise API
export const enterpriseAPI = {
    getAnalytics: () => api.get('/analytics/organization'),
    getExecutiveSummary: () => api.get('/analytics/executive-summary'),
    getHeatmap: () => api.get('/analytics/heatmap'),
    getDepartmentDrilldown: (department) => api.get(`/analytics/heatmap/department/${encodeURIComponent(department)}`),
    exportReport: () => api.get('/analytics/export-report')
};

// Admin Insight API
export const adminInsightAPI = {
    logInteraction: (data) => api.post('/admin-insights/log', data),
    getMetrics: () => api.get('/admin-insights/metrics')
};

// Note API
export const noteAPI = {
    getNotes: (courseId, videoTitle) => api.get(`/notes/${courseId}`, { params: { videoTitle } }),
    createNote: (data) => api.post('/notes', data),
    deleteNote: (id) => api.delete(`/notes/${id}`),
};

// Phishing API
export const phishingAPI = {
    analyze: (data) => api.post('/phishing/analyze', data),
    liveDetect: (content) => api.post('/phishing/live', { content }).then(res => res.data),
    getDatasets: () => api.get('/phishing/datasets').then(res => res.data)
};

// Achievement API
export const achievementAPI = {
    getAll: () => api.get('/achievements'),
    getMine: () => api.get('/achievements/my-achievements'),
    // Used by AchievementsPage, BadgesPage, CertificatesPage
    getMyAchievements: () => api.get('/achievements/my-achievements'),
    getMyBadges: () => api.get('/achievements/my-badges'),
    getMyCertificates: () => api.get('/achievements/my-certificates'),
};

// AI API
export const aiAPI = {
    chat: (data) => api.post('/ai/chat', data),
    getSessions: (params) => api.get('/ai/sessions', { params }),
    getSession: (id) => api.get(`/ai/sessions/${id}`),
    updateSession: (id, data) => api.put(`/ai/sessions/${id}`, data),
    deleteSession: (id) => api.delete(`/ai/sessions/${id}`),
    getProfile: () => api.get('/ai/profile'),
    updateProfile: (data) => api.put('/ai/profile', data),
    recordViolation: (data) => api.post('/ai/risk/violation', data),
    generateAdaptiveChallenge: (data) => api.post('/ai/adaptive/generate', data)
};

// Scenario API
export const scenarioAPI = {
    generate: (data) => api.post('/scenario/generate', data).then(res => res.data)
};

// Campaign API
export const campaignAPI = {
    getCampaigns: () => api.get('/campaigns'),
    createCampaign: (data) => api.post('/campaigns', data),
    launchCampaign: (id) => api.post(`/campaigns/${id}/launch`)
};

// Briefing API
export const briefingAPI = {
    create: (data) => api.post('/briefings', data),
    getAll: () => api.get('/briefings'),
    updateStatus: (id, status) => api.put(`/briefings/${id}`, { status })
};

// Notification API
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`)
};

export default api;
