import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem('accessToken');
            const socketInstance = io('http://127.0.0.1:5000', {
                auth: { token },
                transports: ['polling'], // Force polling to bypass WS upgrade issues
                timeout: 20000,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 99,
                autoConnect: true
            });

            socketInstance.on('connect', () => {
                console.log('[Socket] Connected to real-time engine');
                setConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('[Socket] Disconnected from engine');
                setConnected(false);
            });

            socketInstance.on('connect_error', (err) => {
                console.error('[Socket] Connection Error:', err.message);
                setConnected(false);
            });

            // Global Notification Listener
            socketInstance.on('NEW_NOTIFICATION', (notification) => {
                console.log('[Socket] New real-time notification:', notification);
                
                // Show a toast for the notification
                toast(notification.message, {
                    icon: notification.icon || '🔔',
                    duration: 5000,
                    style: {
                        background: '#111',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '1rem',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }
                });

                // Emit a custom event for other components to listen to
                window.dispatchEvent(new CustomEvent('notification_received', { detail: notification }));
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
        }
    }, [isAuthenticated, user]);

    const value = {
        socket,
        connected,
        emit: (event, data) => socket?.emit(event, data),
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
