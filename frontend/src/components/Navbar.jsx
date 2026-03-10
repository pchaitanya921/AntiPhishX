import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';
import { useTheme } from '../context/ThemeContext';
import { SidebarContext } from './Sidebar';
import {
    Shield,
    MessageSquare,
    LogOut,
    Bell,
    Link as LinkIcon,
    Globe,
    Cpu,
    User,
    Settings,
    ChevronDown,
    Sparkles,
    Sun,
    Moon,
    Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const { setOpen: setSidebarOpen } = useContext(SidebarContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const profileMenuRef = useRef(null);
    const notificationRef = useRef(null);

    // Fetch notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isAuthenticated) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const formatted = (data.data || []).map(n => ({
                        id: n._id,
                        title: n.title,
                        message: n.message,
                        time: getTimeAgo(new Date(n.createdAt)),
                        unread: !n.read,
                        link: n.link,
                        icon: n.icon
                    }));
                    setNotifications(formatted);
                }
            } catch (error) {
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Helper function to format time ago
    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    // Mark notification as read
    const handleNotificationClick = async (notif) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notif.id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
            if (notif.link) navigate(notif.link);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="fixed top-3 sm:top-6 left-0 right-0 z-[60] px-3 sm:px-6 lg:px-8">
            <div className="max-w-[1700px] mx-auto flex items-center justify-between p-2 pl-3 sm:pl-6 pr-3 sm:pr-4 rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-2xl">

                {/* Logo & hamburger row */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Hamburger — mobile/tablet only */}
                    {isAuthenticated && (
                        <button
                            onClick={() => setSidebarOpen(o => !o)}
                            className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                    )}

                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="p-2 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30 shadow-cyber-glow"
                        >
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-purple" />
                        </motion.div>
                        <span className="text-lg sm:text-xl font-black text-white italic tracking-tighter uppercase">
                            AntiPhish<span className="cyber-gradient-text">X</span>
                        </span>
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-1.5 sm:gap-3 mr-1 sm:mr-2">
                                {/* AI Copilot Link — hidden on mobile */}
                                <Link
                                    to="/ai-copilot"
                                    className="hidden sm:flex p-2.5 rounded-xl text-white/40 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all group relative"
                                    title="AI Copilot"
                                >
                                    <Sparkles size={18} className="group-hover:animate-pulse" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-cyan rounded-full shadow-cyber-glow animate-pulse" />
                                </Link>

                                {/* Dark / Light Mode Toggle */}
                                <motion.button
                                    onClick={toggleTheme}
                                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    className={`relative flex items-center w-14 h-7 rounded-full border transition-colors duration-300 overflow-hidden
                                        ${isDark
                                            ? 'bg-[#1a0b2e] border-cyber-purple/40'
                                            : 'bg-amber-100 border-amber-400/60'
                                        }`}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    {/* Track icons */}
                                    <span className="absolute left-1 text-[10px]">🌙</span>
                                    <span className="absolute right-1 text-[10px]">☀️</span>

                                    {/* Thumb */}
                                    <motion.div
                                        layout
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className={`absolute w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10
                                            ${isDark
                                                ? 'left-1 bg-cyber-purple text-white'
                                                : 'left-[calc(100%-1.5rem)] bg-amber-400 text-amber-900'
                                            }`}
                                    >
                                        {isDark
                                            ? <Moon size={11} className="text-white" />
                                            : <Sun size={11} className="text-amber-900" />
                                        }
                                    </motion.div>
                                </motion.button>

                                {/* Notification Bell */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all relative"
                                    >
                                        <Bell size={18} />
                                        <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-cyber-purple rounded-full shadow-cyber-glow" />
                                    </button>

                                    {/* Notification Panel */}
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-4 w-96 backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-white/10">
                                                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Notifications</h3>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {loading ? (
                                                        <div className="p-8 text-center">
                                                            <p className="text-white/40 text-sm">Loading...</p>
                                                        </div>
                                                    ) : notifications.length === 0 ? (
                                                        <div className="p-8 text-center">
                                                            <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                                            <p className="text-white/40 text-sm">No notifications</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => handleNotificationClick(notif)}
                                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer ${notif.unread ? 'bg-cyber-purple/5' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {notif.unread && (
                                                                        <div className="w-2 h-2 rounded-full bg-cyber-purple mt-2 flex-shrink-0" />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <p className="text-white font-semibold text-sm">{notif.title}</p>
                                                                        <p className="text-white/60 text-xs mt-1">{notif.message}</p>
                                                                        <p className="text-white/40 text-xs mt-2">{notif.time}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <div className="p-3 border-t border-white/10 flex items-center justify-between">
                                                    <span className="text-white/30 text-xs">
                                                        {notifications.filter(n => n.unread).length} unread
                                                    </span>
                                                    <button
                                                        onClick={handleMarkAllRead}
                                                        className="text-cyber-purple text-xs font-bold hover:text-cyber-purple/80 transition-colors"
                                                    >
                                                        Mark All Read
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="hidden sm:block h-8 w-px bg-white/5 mx-1" />

                            {/* Points Display — learners only, hidden on mobile */}
                            {(!user?.role || user?.role === 'learner') && (
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 border border-cyber-purple/30">
                                    <Sparkles size={16} className="text-cyber-purple" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Points</span>
                                        <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-cyan">
                                            {user?.points || 0}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="h-8 w-px bg-white/5 mx-1" />
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-4 pl-2 hover:bg-white/5 rounded-xl pr-2 py-1 transition-all"
                                >
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[11px] font-black text-white tracking-tight uppercase">
                                            {user?.firstName} {user?.lastName || 'Johnson'}
                                        </span>
                                        <span className="text-[9px] text-cyber-purple uppercase tracking-[0.2em] font-black">Agent Node-01</span>
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="w-11 h-11 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center relative group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-cyber-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=7C3AED&color=fff&bold=true&size=128`}
                                            alt={`${user?.firstName} ${user?.lastName}`}
                                            className="w-full h-full object-cover rounded-xl relative z-10"
                                        />
                                    </motion.div>

                                    <ChevronDown
                                        size={16}
                                        className={`text-white/40 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 backdrop-blur-3xl bg-gradient-to-br from-white/20 to-white/10 rounded-2xl border-2 border-white/30 shadow-2xl overflow-hidden z-50"
                                        >
                                            {/* User Info Header */}
                                            <div className="p-4 border-b border-white/20 bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=7C3AED&color=fff&bold=true`}
                                                        className="w-12 h-12 rounded-xl"
                                                        alt="Profile"
                                                    />
                                                    <div>
                                                        <p className="text-white font-bold text-sm">
                                                            {user?.firstName} {user?.lastName}
                                                        </p>
                                                        <p className="text-white/60 text-xs">{user?.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-2 bg-black/20">
                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        navigate('/profile');
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
                                                >
                                                    <User size={18} className="text-cyber-purple" />
                                                    View Profile
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        navigate('/settings');
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-medium"
                                                >
                                                    <Settings size={18} className="text-cyan-400" />
                                                    Settings
                                                </button>

                                                <div className="h-px bg-white/10 my-2" />

                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" size="md" className="uppercase tracking-[0.2em] text-[10px]">Access Portal</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="md" className="uppercase tracking-[0.1em] text-[10px] h-11 px-8">Initialize Node</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
