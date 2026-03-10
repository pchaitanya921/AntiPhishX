import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Get all notifications
export const getNotifications = async () => {
    const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
    const response = await axios.get(`${API_URL}/notifications/unread`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
    const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const response = await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// Create notification (for testing/admin)
export const createNotification = async (notificationData) => {
    const response = await axios.post(
        `${API_URL}/notifications`,
        notificationData,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response.data;
};
