import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
    getSessions: () => api.get('/auth/sessions'),
    deleteSession: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),
};

// Course API
export const courseAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getById: (id) => api.get(`/courses/${id}`),
    enroll: (id) => api.post(`/courses/${id}/enroll`),
    getMyCourses: () => api.get('/courses/my-courses'),
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
};

// Certificate API
export const certificateAPI = {
    generate: (courseId) => api.post('/certificates/generate', { courseId }),
    getMyCertificates: () => api.get('/certificates/my-certificates'),
    getById: (id) => api.get(`/certificates/${id}`),
    verify: (id, code) => api.get(`/certificates/verify/${id}`, { params: { code } }),
    downloadPDF: (id) => api.get(`/certificates/${id}/pdf`),
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
};

// Analytics API
export const analyticsAPI = {
    getUserAnalytics: () => api.get('/analytics/user'),
    getPlatformStats: () => api.get('/analytics/platform'),
};

// Note API
export const noteAPI = {
    getNotes: (courseId, videoTitle) => api.get(`/notes/${courseId}`, { params: { videoTitle } }),
    createNote: (data) => api.post('/notes', data),
    deleteNote: (id) => api.delete(`/notes/${id}`),
};

export default api;
