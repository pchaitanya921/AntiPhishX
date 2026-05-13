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
    Monitor,
    Fingerprint,
    Bot,
    Presentation,
    Shield,
    ShieldAlert,
    Library,
    ScanLine,
    Wand2,
    Database,
    X,
    Building2,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

    const roleMenuItems = React.useMemo(() => {
        if (!user) return [];
        const isAdminRole = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user.role);
        
        if (isAdminRole) {
            return [
                { name: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
                { name: 'Enterprise Dashboard', icon: Activity, path: '/admin/enterprise-dashboard' },
                { name: 'Enterprise Hub', icon: Building2, path: '/admin/enterprise' },
                { name: 'Subscription Hub', icon: Scroll, path: '/admin/subscriptions' },
                { name: 'User Management', icon: UserCog, path: '/admin/users' },
                { name: 'Course Management', icon: BookOpen, path: '/admin/courses' },
                { name: 'Lab Management', icon: FlaskConical, path: '/admin/labs' },
                { name: 'Quiz Management', icon: FileQuestion, path: '/admin/quizzes' },
                { name: 'Campaign Manager', icon: Presentation, path: '/admin/campaigns' },
                { name: 'Briefing Requests', icon: Calendar, path: '/admin/briefings' },
                { name: 'Risk Intelligence', icon: ShieldAlert, path: '/admin/intelligence' },
                { name: 'Security Logs', icon: History, path: '/admin/security/logs' },
                { name: 'AI Command', icon: Bot, path: '/admin/ai' },
                { name: 'Scenario Forge', icon: Wand2, path: '/scenario-generator' },
            ];
        }
        if (user.role === 'instructor') {
            return [
                { name: 'Instructor Dashboard', icon: LayoutDashboard, path: '/instructor/dashboard' },
                { name: 'Curriculum Builder', icon: BookOpen, path: '/instructor/courses' },
                { name: 'Lab Reviews', icon: FlaskConical, path: '/admin/labs' },
                { name: 'AI Assistant', icon: Bot, path: '/ai-copilot' },
            ];
        }
        return [
            { name: 'Personal Dashboard', icon: LayoutDashboard, path: '/dashboard' },
            { name: 'My Learning', icon: GraduationCap, path: '/my-courses' },
            { name: 'Course Catalog', icon: BookOpen, path: '/courses' },
            { name: 'Simulation Labs', icon: FlaskConical, path: '/labs' },
            { name: 'Phishing Scanner', icon: ScanLine, path: '/phishing-scanner' },
            { name: 'Knowledge Center', icon: FileQuestion, path: '/quizzes' },
            { name: 'Elite Leaderboard', icon: Trophy, path: '/leaderboard' },
            { name: 'Intelligence Data', icon: Database, path: '/datasets' },
            { name: 'Device Management', icon: Monitor, path: '/dashboard/devices' },
            { name: 'AI Copilot', icon: Bot, path: '/ai-copilot' },
        ];
    }, [user]);

    // ── MOBILE / TABLET DRAWER COMPONENTS ──────────────────────────────────
    const NavItems = ({ onClick }) => (
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar overflow-x-hidden">
            {roleMenuItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClick}
                    className={({ isActive }) => `
                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative border text-sm font-black italic uppercase tracking-tight
                        ${isActive
                            ? isLight
                                ? 'bg-emerald-500/10 text-slate-900 border-emerald-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isLight
                                ? 'text-slate-500 hover:text-slate-900 hover:bg-emerald-50/80 border-transparent'
                                : 'text-white/20 hover:text-white hover:bg-white/[0.04] border-transparent'
                        }
                    `}
                >
                    {({ isActive }) => (
                        <>
                            <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
                            <span>{item.name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );

    const DrawerFooter = () => (
        <div className={`mt-auto pt-4 border-t ${isLight ? 'border-emerald-100' : 'border-white/5'} p-6`}>
            <div className={`p-5 rounded-[2rem] relative overflow-hidden ${isLight ? 'bg-emerald-50 border border-emerald-100' : 'bg-[#111111] border border-white/5'}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Node Status</span>
                </div>
                <p className={`text-[10px] font-bold uppercase ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                    US-EAST HUB · <span className={isLight ? 'text-slate-800' : 'text-emerald-400'}>AUTHORIZED</span>
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
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[55] bg-black/90 lg:hidden"
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 z-[56] w-72 flex flex-col pt-6 pb-6 pl-3 pr-3 lg:hidden"
                        >
                            <div className={`flex-1 flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl
                                ${isLight ? 'bg-white border border-emerald-200/60' : 'bg-[#111111] border border-white/10'}`}>
                                <div className="flex items-center justify-between px-6 pt-8 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <Shield size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Authenticated As</div>
                                            <div className="text-xs font-black italic uppercase text-emerald-400">
                                                {user?.role === 'superAdmin' ? 'Platform Owner' : 
                                                 user?.role === 'internalTester' ? 'Internal Tester' :
                                                 user?.role === 'enterpriseAdmin' ? 'Enterprise Admin' :
                                                 user?.role === 'instructor' ? 'Lead Instructor' : 
                                                 user?.role === 'admin' ? 'Command Core' : 'Security Learner'}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setOpen(false)} className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-emerald-50 text-slate-400' : 'hover:bg-white/10 text-white/40'}`}>
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
                className={`hidden lg:block h-screen fixed left-0 top-0 z-40 transition-all duration-500 ease-in-out ${isHovered ? 'w-80' : 'w-28'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="w-full h-full pt-6 pb-6 pl-5 pr-5">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`w-full h-full flex flex-col shadow-2xl relative overflow-hidden transition-all duration-700 rounded-[3rem]
                            ${isLight ? 'bg-white border border-emerald-200/60' : 'bg-[#0F0F11] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]'}`}
                    >
                        <div className={`absolute top-0 left-0 w-full h-48 bg-emerald-500/5 -z-10 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                        <div className={`mt-24 px-7 mb-10 transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                            <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 whitespace-nowrap ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Authenticated As</div>
                            <div className="text-sm font-black italic uppercase tracking-tight text-emerald-400 whitespace-nowrap drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                {user?.role === 'superAdmin' ? 'Platform Owner' : 
                                 user?.role === 'internalTester' ? 'Internal Tester' :
                                 user?.role === 'enterpriseAdmin' ? 'Enterprise Admin' :
                                 user?.role === 'instructor' ? 'Lead Instructor' : 
                                 user?.role === 'admin' ? 'Command Core' : 'Security Learner'}
                            </div>
                        </div>

                        <div className={`mt-28 mb-12 flex justify-center transition-all duration-700 ${!isHovered ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <Shield className="animate-pulse" size={24} />
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2 overflow-y-auto px-3 custom-scrollbar overflow-x-hidden">
                            {roleMenuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center ${isHovered ? 'justify-between px-6' : 'justify-center px-0'} py-4 rounded-[1.5rem] transition-all duration-500 group relative border
                                        ${isActive
                                            ? isLight
                                                ? 'bg-emerald-500/10 text-slate-900 border-emerald-500/30'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                            : isLight
                                                ? 'text-slate-500 hover:text-slate-900 hover:bg-emerald-50/80 border-transparent'
                                                : 'text-white/20 hover:text-white hover:bg-white/[0.04] border-transparent'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className={`flex items-center gap-5 relative z-10 ${!isHovered && 'justify-center w-full'}`}>
                                                <item.icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-110 shrink-0 ${isActive ? 'text-emerald-400' : 'text-white/20 group-hover:text-emerald-400'}`} />
                                                <span className={`font-black tracking-tight text-[11px] uppercase italic transition-all duration-500 whitespace-nowrap ${isHovered ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 hidden'}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            {isHovered && (
                                                <ChevronRight className="w-3 h-3 transition-all duration-500 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 shrink-0" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        <div className={`mt-auto pt-8 transition-all duration-700 ${isLight ? 'border-t border-emerald-100' : 'border-t border-white/5'} ${isHovered ? 'opacity-100 p-6' : 'opacity-0 p-0 overflow-hidden h-0'}`}>
                            <div className={`p-6 rounded-[2rem] relative overflow-hidden group ${isLight ? 'bg-emerald-50 border border-emerald-100' : 'bg-[#111111] border border-white/10 shadow-2xl'}`}>
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                                    <Shield size={60} className="text-emerald-400" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 whitespace-nowrap">Node Integrity</span>
                                    </div>
                                    <p className={`text-[11px] leading-relaxed font-bold uppercase whitespace-nowrap ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                                        US-EAST HUB <br />
                                        <span className={isLight ? 'text-slate-800' : 'text-emerald-400/90'}>AUTHORIZED</span>
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

