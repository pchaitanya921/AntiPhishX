import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await authAPI.getMe();
                    if (response.data && response.data.success) {
                        setUser(response.data.data);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        if (response.data && response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('accessToken', response.data.token);
            return response.data.user;
        }
        throw new Error(response.data?.message || 'Login failed');
    };

    const register = async ({ email, password, firstName, lastName, role }) => {
        const response = await authAPI.register({
            firstName,
            lastName,
            email,
            password,
            role: role || 'learner'
        });
        if (response.data && response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('accessToken', response.data.token);
            return response.data.user;
        }
        throw new Error(response.data?.message || 'Registration failed');
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        localStorage.removeItem('accessToken');
    };

    const updateProfile = async (updatedData) => {
        // Update user data
        setUser({ ...user, ...updatedData });
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isInstructor: user?.role === 'instructor' || user?.role === 'admin',
        isLearner: user?.role === 'learner' || !user?.role,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
