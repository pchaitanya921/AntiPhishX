import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    FlaskConical,
    FileQuestion,
    Trophy,
    Award,
    Scroll,
    Medal,
    History,
    Settings,
    ChevronRight,
    Search,
    UserCog,
    Activity,
    Bot,
    Presentation,
    Shield,
    ShieldAlert,
    Library,
    ScanLine,
    Wand2,
    Database,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Labs', icon: FlaskConical, path: '/labs' },
    { name: 'Phishing Scanner', icon: ScanLine, path: '/phishing-scanner' },
    { name: 'Quizzes', icon: FileQuestion, path: '/quizzes' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Achievements', icon: Award, path: '/achievements' },
    { name: 'Certificates', icon: Scroll, path: '/certificates' },
    { name: 'Badges', icon: Medal, path: '/badges' },
    { name: 'Security Logs', icon: History, path: '/logs' },
    { name: 'Datasets', icon: Database, path: '/datasets' },
];

// Shared context so Navbar can open/close the drawer
export const SidebarContext = React.createContext({ open: false, setOpen: () => { } });

export function SidebarProvider({ children }) {
    const [open, setOpen] = React.useState(false);
    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export default function Sidebar() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const { open, setOpen } = React.useContext(SidebarContext);

    // Desktop hover expand
    const [isHovered, setIsHovered] = React.useState(false);

    const roleMenuItems = [
        ...(user?.role === 'admin'
            ? [{ name: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin' }]
            : [{ name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }]
        ),
        ...(user?.role !== 'admin' && user?.role !== 'instructor'
            ? [{ name: 'My Courses', icon: GraduationCap, path: '/my-courses' }]
            : []),
        ...menuItems.filter(item => {
            if (item.path === '/dashboard') return false;
            if (user?.role === 'admin' && (item.path === '/courses' || item.path === '/logs')) return false;
            return true;
        }),
        ...(user?.role === 'instructor' || user?.role === 'admin'
            ? [{ name: 'Instructor Hub', icon: Presentation, path: '/instructor' }]
            : []),
        ...(user?.role === 'admin'
            ? [
                { name: 'Users', icon: UserCog, path: '/admin/users' },
                { name: 'Training Topics', icon: Library, path: '/admin/courses' },
                { name: 'Analytics', icon: Activity, path: '/admin/analytics' },
                { name: 'Security Logs', icon: ShieldAlert, path: '/admin/security/logs' },
                { name: 'AI Control', icon: Bot, path: '/admin/ai' },
                { name: 'Scenario Generator', icon: Wand2, path: '/scenario-generator' },
            ]
            : user?.role === 'instructor'
                ? [{ name: 'Scenario Generator', icon: Wand2, path: '/scenario-generator' }]
                : [])
    ];

    // ── MOBILE / TABLET DRAWER ─────────────────────────────────────────────
    const NavItems = ({ onClick }) => (
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 custom-scrollbar overflow-x-hidden">
            {roleMenuItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClick}
                    className={({ isActive }) => `
                        flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative border text-sm font-black italic uppercase tracking-tight
                        ${isActive
                            ? isLight
                                ? 'bg-cyber-purple/10 text-slate-900 border-cyber-purple/30'
                                : 'bg-cyber-purple/10 text-white border-white/10'
                            : isLight
                                ? 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/80 border-transparent'
                                : 'text-white/40 hover:text-white hover:bg-white/[0.04] border-transparent'
                        }
                    `}
                >
                    <item.icon className="w-5 h-5 shrink-0 group-hover:text-cyber-purple transition-colors" />
                    <span>{item.name}</span>
                </NavLink>
            ))}
        </nav>
    );

    const DrawerFooter = () => (
        <div className={`mt-auto pt-4 border-t ${isLight ? 'border-purple-100' : 'border-white/5'} p-4`}>
            <div className={`p-4 rounded-2xl relative overflow-hidden ${isLight ? 'bg-purple-50 border border-purple-100' : 'bg-cyber-purple/5 border border-white/5'}`}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyber-cyan">Node Status</span>
                </div>
                <p className={`text-[10px] font-bold uppercase ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                    US-EAST HUB · <span className={isLight ? 'text-slate-800' : 'text-white'}>AUTHORIZED</span>
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* ── MOBILE / TABLET DRAWER (< lg) ── */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`fixed left-0 top-0 bottom-0 z-[56] w-72 flex flex-col pt-6 pb-6 pl-3 pr-3 lg:hidden`}
                        >
                            <div className={`flex-1 flex flex-col rounded-[2rem] overflow-hidden backdrop-blur-[40px] shadow-2xl
                                ${isLight ? 'bg-white/90 border border-purple-200/60' : 'bg-[#0a0c14]/95 border border-white/10'}`}>
                                {/* Close + Header */}
                                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                                    <div>
                                        <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Authenticated As</div>
                                        <div className="text-xs font-black italic uppercase text-cyber-purple">
                                            {user?.role === 'instructor' ? 'Lead Instructor' : user?.role === 'admin' ? 'Command Core' : 'Security Learner'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-purple-50 text-slate-400' : 'hover:bg-white/10 text-white/40'}`}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <NavItems onClick={() => setOpen(false)} />
                                <DrawerFooter />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── DESKTOP HOVER SIDEBAR (≥ lg) ── */}
            <aside
                className={`hidden lg:block h-screen fixed left-0 top-0 z-40 transition-all duration-500 ease-in-out ${isHovered ? 'w-72' : 'w-24'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="w-full h-full pt-6 pb-6 pl-4 pr-4">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`w-full h-full flex flex-col shadow-2xl relative overflow-hidden transition-all duration-500 rounded-[2rem] backdrop-blur-[40px]
                            ${isLight ? 'bg-white/80 border border-purple-200/60' : 'bg-white/[0.01] border border-white/5'}`}
                    >
                        {/* Glow */}
                        <div className={`absolute top-0 left-0 w-full h-32 bg-cyber-purple/5 blur-3xl -z-10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                        {/* Header expanded */}
                        <div className={`mt-20 px-5 mb-6 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                            <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 whitespace-nowrap ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Authenticated As</div>
                            <div className="text-sm font-black italic uppercase tracking-tight text-cyber-purple whitespace-nowrap">
                                {user?.role === 'instructor' ? 'Lead Instructor' : user?.role === 'admin' ? 'Command Core' : 'Security Learner'}
                            </div>
                        </div>

                        {/* Collapsed icon */}
                        <div className={`mt-24 mb-8 flex justify-center transition-all duration-500 ${!isHovered ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                            <Shield className="text-cyber-purple animate-pulse" size={24} />
                        </div>

                        {/* Nav — desktop: icon-only collapsed, full when hovered */}
                        <nav className="flex-1 space-y-2 overflow-y-auto px-2 custom-scrollbar overflow-x-hidden">
                            {roleMenuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center ${isHovered ? 'justify-between px-5' : 'justify-center px-0'} py-4 rounded-2xl transition-all duration-500 group relative border
                                        ${isActive
                                            ? isLight
                                                ? 'bg-cyber-purple/10 text-slate-900 border-cyber-purple/30'
                                                : 'bg-cyber-purple/10 text-white border-white/10'
                                            : isLight
                                                ? 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/80 border-transparent'
                                                : 'text-white/30 hover:text-white hover:bg-white/[0.03] border-transparent'
                                        }
                                    `}
                                >
                                    <div className={`flex items-center gap-4 relative z-10 ${!isHovered && 'justify-center w-full'}`}>
                                        <item.icon className="w-5 h-5 transition-all duration-500 group-hover:text-cyber-purple group-hover:scale-110 shrink-0" />
                                        <span className={`font-black tracking-tight text-[11px] uppercase italic transition-all duration-500 whitespace-nowrap ${isHovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0 hidden'}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {isHovered && (
                                        <ChevronRight className="w-3 h-3 transition-all duration-500 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 shrink-0" />
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Desktop footer */}
                        <div className={`mt-auto pt-6 transition-all duration-500 ${isLight ? 'border-t border-purple-100' : 'border-t border-white/5'} ${isHovered ? 'opacity-100 p-6' : 'opacity-0 p-0 overflow-hidden h-0'}`}>
                            <div className={`p-5 rounded-2xl relative overflow-hidden group ${isLight ? 'bg-purple-50 border border-purple-100' : 'bg-cyber-purple/5 border border-white/5'}`}>
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                                    <Shield size={40} className="text-cyber-purple" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyber-cyan whitespace-nowrap">Node Status</span>
                                    </div>
                                    <p className={`text-[10px] leading-relaxed font-bold uppercase whitespace-nowrap ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                                        US-EAST HUB <br />
                                        <span className={isLight ? 'text-slate-800' : 'text-white'}>AUTHORIZED</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </aside>
        </>
    );
}
