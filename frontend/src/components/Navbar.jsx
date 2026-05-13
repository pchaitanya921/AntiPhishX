import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    Menu,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';
import { notificationAPI } from '../services/api';
import AICopilotPanel from './ai/AICopilotPanel';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const location = useLocation();
    const { setOpen: setSidebarOpen } = useContext(SidebarContext);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const profileMenuRef = useRef(null);
    const notificationRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [showAICopilot, setShowAICopilot] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await notificationAPI.getAll();
            if (response.data.success) {
                setNotifications(response.data.data || []);
            }
        } catch (error) {
            console.error('Notification Fetch Error:', error);
        }
    };

    // Fetch notifications
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Mark all as read error:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await notificationAPI.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error('Delete notification error:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (isAuthPage) return null;

    const scrollToSection = (e, sectionId) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/90 border-b border-white/5' : 'bg-transparent'}`}>
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                
                {/* Left: Brand */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all duration-500">
                            <Shield className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <span className="text-xl font-black italic tracking-tighter uppercase">
                            AntiPhish<span className="text-emerald-400">X</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    {!isAuthenticated && (
                        <div className="hidden lg:flex items-center gap-6">
                            <NavLink to="/#features" onClick={(e) => scrollToSection(e, 'features')}>Features</NavLink>
                            <NavLink to="/#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</NavLink>
                            <NavLink to="/#enterprise" onClick={(e) => scrollToSection(e, 'enterprise')}>Enterprise</NavLink>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            {/* AI Copilot Shortcut */}
                            <div className="relative group">
                                <button
                                    onClick={() => setShowAICopilot(true)}
                                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]`}
                                >
                                    <div className="absolute inset-0 bg-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
                                    <Cpu size={18} className="text-white/40 group-hover:text-emerald-400 transition-colors relative z-10" />
                                    
                                    {/* Subtle Animated Aura */}
                                    <span className="absolute inset-0 rounded-xl border border-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100" />
                                </button>
                                
                                {/* Tooltip */}
                                <div className="absolute top-full right-0 mt-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[9px] font-black uppercase tracking-widest text-emerald-400 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[120] translate-y-2 group-hover:translate-y-0 shadow-2xl">
                                    AI Copilot
                                </div>
                            </div>

                            {/* Notification Bell */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative ${
                                        showNotifications ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    } border`}
                                >
                                    <Bell size={18} className={`${notifications.some(n => !n.isRead) ? 'text-emerald-400' : 'text-white/40'}`} />
                                    {notifications.some(n => !n.isRead) && (
                                        <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    )}
                                </button>
                                
                                <AnimatePresence>
                                    {showNotifications && (
                                        <NotificationCenter 
                                            notifications={notifications}
                                            onMarkAsRead={handleMarkAsRead}
                                            onMarkAllAsRead={handleMarkAllAsRead}
                                            onDelete={handleDeleteNotification}
                                            onClose={() => setShowNotifications(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User Profile */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest text-white/40 hidden sm:block">
                                        {user?.firstName}
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 border border-cyber-purple/20 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=7C3AED&color=fff&bold=true`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <ChevronDown size={14} className={`text-white/20 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-64 rounded-[2rem] bg-[#0c0c0e] border border-white/10 shadow-2xl overflow-hidden p-2 z-[110]"
                                        >
                                            <div className="p-6 border-b border-white/5">
                                                <p className="text-sm font-black italic tracking-tighter uppercase">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{user?.role} NODE</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <MenuButton 
                                                    onClick={() => {
                                                        const isAdminPrivileged = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role);
                                                        navigate(isAdminPrivileged ? '/admin/dashboard' : user?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard');
                                                    }} 
                                                    icon={Cpu} 
                                                    label="Command Center" 
                                                />
                                                <MenuButton onClick={() => navigate('/profile')} icon={User} label="Identity Profile" />
                                                <MenuButton onClick={() => navigate('/settings')} icon={Settings} label="Node Settings" />
                                                <div className="h-px bg-white/5 my-2 mx-4" />
                                                <MenuButton onClick={handleLogout} icon={LogOut} label="Terminate Session" variant="danger" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Access Node
                            </Link>
                            <Link to="/register" className="px-6 py-2.5 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                                Initialize <ArrowRight className="inline-block ml-1" size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Copilot Panel */}
            <AICopilotPanel 
                isOpen={showAICopilot} 
                onClose={() => setShowAICopilot(false)} 
            />
        </nav>
    );
};

function NavLink({ to, children, onClick }) {
    return (
        <Link 
            to={to} 
            onClick={onClick}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-emerald-400 transition-all duration-300"
        >
            {children}
        </Link>
    );
}

function MenuButton({ onClick, icon: Icon, label, variant = 'default' }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${variant === 'danger' ? 'text-red-400 hover:bg-red-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}

export default Navbar;

