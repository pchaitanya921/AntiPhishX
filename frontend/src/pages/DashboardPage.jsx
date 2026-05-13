import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    CheckCircle2,
    AlertTriangle,
    Clock,
    TrendingUp,
    Activity,
    Lock,
    Zap,
    ChevronRight,
    Award,
    Filter,
    BarChart3,
    Terminal,
    BrainCircuit,
    Fingerprint,
    Cpu
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import ThreatInsightPanel from '../components/dashboard/ThreatInsightPanel';
import HumanRiskIntelligence from '../components/dashboard/HumanRiskIntelligence';
import NeuralRoadmap from '../components/dashboard/NeuralRoadmap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PermissionWrapper from '../components/auth/PermissionWrapper';
import { authAPI, analyticsAPI, aiAPI, labAPI } from '../services/api';


export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = React.useState(null);
    const [hri, setHri] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('all');
    const [showThreatPanel, setShowThreatPanel] = React.useState(false);
    const [selectedLog, setSelectedLog] = React.useState(null);
    const [behavior, setBehavior] = React.useState(null);
    const [roadmap, setRoadmap] = React.useState(null);
    const [generatingAI, setGeneratingAI] = React.useState(false);
    const [launchingSmart, setLaunchingSmart] = React.useState(false);

    React.useEffect(() => {
        const isAdminPrivileged = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role);
        if (isAdminPrivileged) { navigate('/admin/dashboard'); return; }
        if (user?.role === 'instructor') { navigate('/instructor/dashboard'); return; }
        
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [analyticsRes, behaviorRes, hriRes, roadmapRes] = await Promise.all([
                    analyticsAPI.getUserAnalytics(),
                    authAPI.getBehavior(),
                    analyticsAPI.getHRI(),
                    labAPI.getNeuralRoadmap()
                ]);
                
                if (analyticsRes.data.success) {
                    setAnalytics(analyticsRes.data.data);
                }
                
                if (behaviorRes.data.success) {
                    setBehavior(behaviorRes.data.data);
                }

                if (hriRes.data.success) {
                    setHri(hriRes.data.data);
                }

                if (roadmapRes.data.success) {
                    setRoadmap(roadmapRes.data.data);
                }
            } catch (err) {
                console.error('Failed to synchronize dashboard telemetry:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user, navigate]);

    const handleSmartStart = async () => {
        try {
            setLaunchingSmart(true);
            const res = await labAPI.getAdaptiveNext();
            if (res.data.success) {
                const lab = res.data.data;
                navigate(`/labs/${lab._id}`);
            }
        } catch (err) {
            console.error('Smart Start Orchestration Failed:', err);
        } finally {
            setLaunchingSmart(false);
        }
    };

    const handleLaunchAIChallenge = async () => {
        try {
            setGeneratingAI(true);
            const res = await aiAPI.generateAdaptiveChallenge({ domain: 'Executive Intelligence' });
            if (res.data.success) {
                // Navigate to lab player with the AI lab data in state
                navigate('/labs/ai-session', { state: { lab: res.data.data, isAI: true } });
            }
        } catch (err) {
            console.error('AI Lab Synthesis Failed:', err);
        } finally {
            setGeneratingAI(false);
        }
    };

    const calculateThreatScore = () => {
        if (!analytics) return { level: 'LOW', label: 'Strong Security Awareness', color: 'emerald' };
        let score = 100;
        const quizPassRate = analytics.quizPassRate || 0;
        if (quizPassRate < 50) score -= 40;
        else if (quizPassRate < 70) score -= 20;
        const labPassRate = analytics.labPassRate || 0;
        if (labPassRate < 50) score -= 30;
        else if (labPassRate < 70) score -= 15;
        const hasActivity = (analytics.quizAttempts || 0) > 0 || (analytics.labAttempts || 0) > 0;
        if (!hasActivity) score -= 20;
        const progress = analytics.overallProgress || 0;
        if (progress < 30) score -= 10;
        if (score >= 70) return { level: 'LOW', label: 'Strong Security Awareness', color: 'emerald' };
        if (score >= 40) return { level: 'MEDIUM', label: 'Needs Improvement', color: 'yellow' };
        return { level: 'HIGH', label: 'At Risk', color: 'red' };
    };

    const threatScore = calculateThreatScore();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
                <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Security Node...</p>
            </div>
        );
    }

    const activityLogs = analytics?.recentActivity?.map(log => ({
        id: log._id,
        action: String(log.action || log.topic || 'System Activity').replace(/_/g, ' '),
        target: log.resource || `${log.level || 'Unknown'} Level`,
        xp: log.severity === 'critical' ? 'Alert' : (log.score ? `+${log.score} PT` : '+50 PT'),
        type: log.severity === 'info' || log.completed ? 'success' : 'info'
    })) || [];

    const filteredLogs = activityLogs.filter(log => {
        if (filter === 'all') return true;
        if (filter === 'low') return log.type === 'success';
        return true;
    });

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Welcome Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500 text-[9px] font-black tracking-[0.2em] uppercase px-4 py-1">
                            Node Online // {new Date().toLocaleDateString()}
                        </Badge>
                        {user?.currentPlan === 'enterprise_lattice' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                                    ENTERPRISE LATTICE — {user?.billingCycle?.toUpperCase() || 'MONTHLY'} PLAN
                                </span>
                            </motion.div>
                        )}
                        {(user?.currentPlan === 'core_node' || user?.currentPlan === 'neural_advanced') && user?.billingCycle !== 'none' && (
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                    {user?.currentPlan?.replace('_', ' ')} — {user?.billingCycle?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{user?.firstName}</span>
                    </h1>
                    <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Secure Session Active · node_{user?._id?.slice(-6) || 'auth'}
                    </p>

                    <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] pt-4">
                        {['superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role) ? (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/30 animate-pulse">
                                <Zap size={14} className="fill-emerald-400" /> Enterprise Access Active
                            </div>
                        ) : (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                                user?.currentPlan === 'enterprise_lattice' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' :
                                user?.currentPlan === 'neural_advanced' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' :
                                'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            }`}>
                                <Shield size={14} /> Operational Tier: {(user?.currentPlan || 'core_node').replace('_', ' ').toUpperCase()}
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-emerald-400/60 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                            <CheckCircle2 size={14} /> Encrypted Session
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400/60 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                            <CheckCircle2 size={14} /> MFA Protected
                        </div>
                    </div>
                </div>

                {/* Threat Score Indicator */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowThreatPanel(true)} 
                    className="flex items-center gap-6 bg-[#111111] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`p-4 rounded-2xl bg-${threatScore.color}-500/10 text-${threatScore.color}-400`}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block mb-1">Threat Profile</span>
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black text-${threatScore.color}-400 italic`}>{threatScore.level}</span>
                            <ChevronRight size={18} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Stats Summary Row */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard icon={TrendingUp} label="Total Progress" value={`${Math.round(analytics?.overallProgress || 0)}%`} color="emerald" />
                    <StatCard icon={CheckCircle2} label="Quiz Pass Rate" value={`${Math.round(analytics?.quizPassRate || 0)}%`} color="lime" />
                    <StatCard icon={Zap} label="Labs Completed" value={analytics?.labAttempts || 0} color="emerald" />
                    <StatCard icon={Award} label="Achievements" value={analytics?.achievementsCount || "14"} color="lime" />
                </div>

                {/* Phishing Training Widget */}
                <Card className="lg:col-span-5 p-10 relative overflow-hidden group rounded-[3rem] bg-[#111111]/40 border-white/5">
                    <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <BarChart3 size={200} className="text-emerald-500" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tight">Intelligence <span className="text-emerald-400">Node</span></h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>

                        {/* Gauge */}
                        <div className="relative w-64 h-36 flex flex-col items-center justify-end">
                            <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
                                <path
                                    d="M 10 50 A 40 40 0 0 1 90 50"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.03)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M 10 50 A 40 40 0 0 1 90 50"
                                    fill="none"
                                    stroke="url(#emerald-gradient)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: (analytics?.overallProgress || 0) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="#A3E635" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="text-center z-10 mb-2 transform -translate-y-4">
                                <span className="text-6xl font-black italic tracking-tighter text-white">{Math.round(analytics?.overallProgress || 0)}<span className="text-2xl opacity-20 ml-1">%</span></span>
                            </div>
                        </div>

                        <div className="w-full mt-12 p-1 rounded-full bg-white/[0.02] border border-white/5">
                            <div className="h-2 w-full bg-transparent rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analytics?.overallProgress || 0}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quiz Performance Widget */}
                <Card className="lg:col-span-7 p-10 rounded-[3rem] bg-[#111111]/40 border-white/5">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black italic uppercase tracking-tight">Performance Analytics</h3>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Neural Score History</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                {Math.round(analytics?.quizPassRate || 0)}% PASS
                            </div>
                        </div>
                    </div>

                    <div className="h-48 w-full relative mb-10 flex items-end gap-1.5 px-2 border-b border-white/5 pb-4">
                        {analytics?.quizHistory?.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${h}%`, opacity: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.8 }}
                                className="flex-1 bg-emerald-500/10 border-t-2 border-emerald-500/40 rounded-t-lg relative group hover:bg-emerald-500/30 transition-colors"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0A0A0A] border border-white/10 text-white text-[10px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">Live Metrics Synchronized</span>
                        </div>
                        <Link to="/quizzes" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-colors flex items-center gap-3 group">
                            Full Analysis <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </Card>

                {/* Human Risk Intelligence Layer */}
                <div className="lg:col-span-12 pt-8">
                    <div className="flex items-center gap-4 mb-10">
                        <Fingerprint size={24} className="text-emerald-400" />
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">Human Risk <span className="text-emerald-400">Intelligence</span></h2>
                        <Badge variant="emerald" className="animate-pulse">Premium Analysis</Badge>
                    </div>
                    <HumanRiskIntelligence hri={hri} />
                </div>

                {/* Neural Training Roadmap & Smart Start */}
                <div className="lg:col-span-12">
                    <NeuralRoadmap 
                        roadmapData={roadmap} 
                        onSmartStart={handleSmartStart} 
                    />
                </div>

                {/* Recent Activity List */}
                <Card className="lg:col-span-12 p-12 rounded-[4rem] bg-[#111111]/40 border-white/5">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Recent activity</h3>
                        <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                            {['all', 'low'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl ${filter === f
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-white/20 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-5">
                        {filteredLogs.map((log) => (
                            <motion.div
                                whileHover={{ x: 5 }}
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                className="flex items-center justify-between p-7 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${log.type === 'success' ? 'bg-emerald-500/5 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight text-white uppercase italic">{log.action}</p>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">{log.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className={`text-xs font-black italic tracking-widest ${log.type === 'success' ? 'text-emerald-400' : 'text-white/40'}`}>{log.xp}</span>
                                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-[0.3em] mt-1">Authorized Node</span>
                                    </div>
                                    <ChevronRight size={20} className="text-white/10 group-hover:text-emerald-400 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            <ThreatInsightPanel
                isOpen={showThreatPanel}
                onClose={() => setShowThreatPanel(false)}
                analytics={analytics}
            />

            {/* Log Detail Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90"
                            onClick={() => setSelectedLog(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#111111] border border-white/10 rounded-[4rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <Terminal size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Activity <span className="text-emerald-400">Log</span></h3>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <DetailItem label="Action Descriptor" value={selectedLog.action} />
                                <DetailItem label="Resource Identifier" value={selectedLog.target || 'N/A'} isMono />
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <DetailItem label="Node Impact" value={selectedLog.xp} isEmerald />
                                    <DetailItem label="Integrity Status" value="VERIFIED" isEmerald />
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <Button
                                    onClick={() => setSelectedLog(null)}
                                    className="w-full h-16 rounded-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all"
                                >
                                    Close Intelligence Report
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
        lime: "text-lime-400 bg-lime-500/5 border-lime-500/10"
    };
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-7 rounded-[2.5rem] bg-[#111111]/40 border border-white/5  flex flex-col gap-6 group hover:border-emerald-500/30 transition-all`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1 group-hover:text-white/40 transition-colors">{label}</p>
                <p className="text-3xl font-black italic tracking-tighter text-white">{value}</p>
            </div>
        </motion.div>
    );
}

function DetailItem({ label, value, isMono, isEmerald }) {
    return (
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block mb-2">{label}</span>
            <span className={`text-base font-black uppercase italic tracking-tight ${isMono ? 'font-mono text-emerald-400' : isEmerald ? 'text-emerald-400' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}

function X({ size }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    );
}

