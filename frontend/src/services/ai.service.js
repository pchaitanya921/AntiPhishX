import api from './api';

/**
 * AI Service
 * Frontend API calls for multi-mode AI system
 */

const aiService = {
    /**
     * Send chat message to AI
     */
    async chat(sessionId, message, mode, context = {}) {
        try {
            const response = await api.post('/ai/chat', {
                sessionId,
                message,
                mode,
                context
            });
            return response.data;
        } catch (error) {
            // Handle anti-cheat or topic violations
            if (error.response?.data?.error) {
                throw {
                    type: error.response.data.error,
                    message: error.response.data.message
                };
            }
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    /**
     * Get all chat sessions
     */
    async getSessions(mode = null) {
        try {
            const params = mode ? { mode } : {};
            const response = await api.get('/ai/sessions', { params });
            return response.data.data;
        } catch (error) {
            throw new Error('Failed to load chat sessions');
        }
    },

    /**
     * Get specific session with messages
     */
    async getSession(sessionId) {
        try {
            const response = await api.get(`/ai/sessions/${sessionId}`);
            return response.data.data;
        } catch (error) {
            throw new Error('Failed to load chat session');
        }
    },

    /**
     * Update session (rename)
     */
    async updateSession(sessionId, title) {
        try {
            const response = await api.put(`/ai/sessions/${sessionId}`, { title });
            return response.data.data;
        } catch (error) {
            throw new Error('Failed to update session');
        }
    },

    /**
     * Delete session
     */
    async deleteSession(sessionId) {
        try {
            await api.delete(`/ai/sessions/${sessionId}`);
        } catch (error) {
            throw new Error('Failed to delete session');
        }
    },

    /**
     * Get user's cyber profile
     */
    async getCyberProfile() {
        try {
            const response = await api.get('/ai/profile');
            return response.data.data;
        } catch (error) {
            throw new Error('Failed to load profile');
        }
    },

    /**
     * Update cyber profile
     */
    async updateCyberProfile(skillLevel, careerGoal) {
        try {
            const response = await api.put('/ai/profile', { skillLevel, careerGoal });
            return response.data.data;
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    },

    /**
     * Record risk violation
     */
    async recordViolation(labId, violationType) {
        try {
            const response = await api.post('/ai/risk/violation', { labId, violationType });
            return response.data.data;
        } catch (error) {
            console.error('Failed to record violation:', error);
        }
    },

    /**
     * Get behavioral telemetry (cognitive map)
     */
    async getBehavior() {
        try {
            const response = await api.get('/auth/behavior');
            return response.data.data;
        } catch (error) {
            console.error('Failed to load behavior:', error);
            return null;
        }
    }
};

export default aiService;
