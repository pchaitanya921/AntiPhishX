import React from 'react';
import { motion } from 'framer-motion';
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
    Filter
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import ThreatInsightPanel from '../components/dashboard/ThreatInsightPanel';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';

// Realistic sample analytics for learner dashboard demo
const SAMPLE_ANALYTICS = {
    overallProgress: 73,
    quizPassRate: 84,
    quizAttempts: 12,
    labAttempts: 9,
    labPassRate: 78,
    quizHistory: [55, 60, 70, 65, 80, 75, 84, 90, 78, 82, 88, 84],
    recentActivity: [
        { _id: 'a1', action: 'LAB_COMPLETED', resource: 'Spear Phishing Simulation', severity: 'info', timestamp: new Date(Date.now() - 60000).toISOString() },
        { _id: 'a2', action: 'QUIZ_PASSED', resource: 'Phishing Detection Assessment', severity: 'info', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { _id: 'a3', action: 'ACHIEVEMENT_UNLOCKED', resource: 'Cyber Guardian Badge', severity: 'info', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { _id: 'a4', action: 'COURSE_ENROLLED', resource: 'Advanced Malware Analysis', severity: 'info', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'a5', action: 'CERTIFICATE_EARNED', resource: 'Email Phishing Fundamentals', severity: 'info', timestamp: new Date(Date.now() - 172800000).toISOString() },
    ]
};

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics] = React.useState(SAMPLE_ANALYTICS);
    const [loading] = React.useState(false);
    const [filter, setFilter] = React.useState('all');
    const [showThreatPanel, setShowThreatPanel] = React.useState(false);
    const [selectedLog, setSelectedLog] = React.useState(null);

    React.useEffect(() => {
        // Redirect based on role
        if (user?.role === 'admin') { navigate('/admin'); return; }
        if (user?.role === 'instructor') { navigate('/instructor'); return; }
    }, [user, navigate]);


    // ===== REAL THREAT SCORE CALCULATION =====
    const calculateThreatScore = () => {
        if (!analytics) return { level: 'LOW', label: 'Strong Security Awareness', color: 'green' };

        let score = 100; // Start at perfect (100 = LOW threat)

        // Factor 1: Quiz Performance (40% weight)
        const quizPassRate = analytics.quizPassRate || 0;
        if (quizPassRate < 50) score -= 40;
        else if (quizPassRate < 70) score -= 20;

        // Factor 2: Lab Performance (30% weight)
        const labPassRate = analytics.labPassRate || 0;
        if (labPassRate < 50) score -= 30;
        else if (labPassRate < 70) score -= 15;

        // Factor 3: Activity Level (20% weight)
        const hasActivity = (analytics.quizAttempts || 0) > 0 || (analytics.labAttempts || 0) > 0;
        if (!hasActivity) score -= 20; // No engagement = risk

        // Factor 4: Overall Progress (10% weight)
        const progress = analytics.overallProgress || 0;
        if (progress < 30) score -= 10;

        // Determine threat level
        if (score >= 70) return { level: 'LOW', label: 'Strong Security Awareness', color: 'green' };
        if (score >= 40) return { level: 'MEDIUM', label: 'Needs Improvement', color: 'yellow' };
        return { level: 'HIGH', label: 'At Risk', color: 'red' };
    };

    const threatScore = calculateThreatScore();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin mb-4" />
                <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Security Node...</p>
            </div>
        );
    }

    const activityLogs = analytics?.recentActivity?.map(log => ({
        id: log._id,
        action: log.action.replace(/_/g, ' '),
        target: log.resource,
        xp: log.severity === 'critical' ? 'Alert' : '+50 pt',
        type: log.severity === 'info' ? 'success' : 'info'
    })) || [];

    const filteredLogs = activityLogs.filter(log => {
        if (filter === 'all') return true;
        if (filter === 'low') return log.type === 'success'; // showing safe/info logs
        return true;
    });

    return (
        <div className="space-y-10">
            {/* Top Stats / Status Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic text-white">
                        Welcome, <span className="text-white">{user?.firstName} {user?.lastName || 'Johnson'}</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-6">
                        Securely access your AntiPhishX account
                    </p>

                    <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 size={14} /> Encrypted Session
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 size={14} /> MFA Protected
                        </div>
                        <div className="flex items-center gap-2 text-cyber-purple">
                            <Zap size={14} /> Rate Limiting Active
                        </div>
                    </div>
                </div>

                {/* Threat Score Indicator */}
                <div onClick={() => setShowThreatPanel(true)} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-cyber-glow hover:bg-white/5 transition-all group cursor-pointer">
                    <Shield size={20} className={`text-${threatScore.color}-400`} />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Threat Score</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-black text-${threatScore.color}-400`}>{threatScore.level}</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Sub-Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic flex items-center gap-3 text-white">
                    Dashboard
                </h2>
                <div className="flex items-center gap-3 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg ${filter === 'all'
                            ? 'bg-cyber-purple/20 text-white border border-cyber-purple/30'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('low')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors rounded-lg ${filter === 'low'
                            ? 'bg-cyber-purple/20 text-white border border-cyber-purple/30'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        Low
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Phishing Training Widget */}
                <Card className="lg:col-span-5 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap size={100} className="text-cyber-purple" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-full flex justify-center items-center mb-8">
                            <h3 className="text-xl font-black italic">Phishing <span className="text-cyber-cyan">Training</span></h3>
                        </div>

                        {/* SVG Gauge */}
                        <div className="relative w-56 h-32 flex flex-col items-center justify-end">
                            {/* Background Track */}
                            <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
                                <path
                                    d="M 10 50 A 40 40 0 0 1 90 50"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                                {/* Progress Arc */}
                                <motion.path
                                    d="M 10 50 A 40 40 0 0 1 90 50"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: (analytics?.overallProgress || 0) / 100 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#22d3ee" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="text-center z-10 mb-2 transform -translate-y-4">
                                <span className="text-5xl font-black italic">{Math.round(analytics?.overallProgress || 0)}<span className="text-2xl opacity-40">%</span></span>
                            </div>
                        </div>

                        <div className="w-full mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analytics?.overallProgress || 0}%` }}
                                    className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quiz Performance Widget */}
                <Card className="lg:col-span-7 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic">Quiz Performance</h3>
                        <div className="flex gap-2">
                            <Badge variant="success">{Math.round(analytics?.quizPassRate || 0)}% Pass Rate</Badge>
                            <Badge variant="info">{analytics?.quizAttempts || 0} Attempts</Badge>
                        </div>
                    </div>

                    <div className="h-48 w-full relative mb-8 flex items-end gap-1 px-2 border-b border-white/5 pb-2">
                        {(analytics?.quizAttempts || 0) > 0 ? (
                            // Real Graph for Users with Data
                            (analytics?.quizHistory || []).map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex-1 bg-cyber-purple/20 border-t-2 border-cyber-purple rounded-t-sm relative group"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // Empty State
                            <div className="h-full w-full flex flex-col items-center justify-center text-white/20">
                                <TrendingUp size={48} className="mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No Quiz Data Recorded</p>
                                <p className="text-[10px] mt-1">Complete a simulation to see insights</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time Metrics Applied</span>
                        </div>
                        <Link to="/certificates" className="text-[10px] font-black uppercase tracking-widest text-cyber-purple hover:text-white transition-colors flex items-center gap-2">
                            View Certificates <ChevronRight size={14} />
                        </Link>
                    </div>
                </Card>

                {/* Recent Activity List */}
                <Card className="lg:col-span-12 p-10">
                    <h3 className="text-2xl font-black italic mb-8">Recent Activity</h3>
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-2.5 rounded-xl ${log.type === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-cyber-purple/10 text-cyber-purple'
                                        }`}>
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight text-white">{log.action} <span className="text-white/40 font-bold">{log.target}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`text-sm font-black italic ${log.type === 'success' ? 'text-green-400' : 'text-cyber-purple'}`}>{log.xp}</span>
                                    <button className="text-white/20 group-hover:text-white transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
                        >
                            View More Details
                        </button>
                    </div>
                </Card>
            </div>
            {/* Threat Insight Panel Overlay */}
            <ThreatInsightPanel
                isOpen={showThreatPanel}
                onClose={() => setShowThreatPanel(false)}
                analytics={analytics}
            />

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedLog(null)}
                    />
                    <div className="relative w-full max-w-md bg-[#0b0f1a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black italic text-white">Activity <span className="text-cyber-purple">Details</span></h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Action</span>
                                <span className="text-base font-bold text-white">{selectedLog.action}</span>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Resource / Target</span>
                                <span className="text-base font-mono text-cyber-cyan">{selectedLog.target || 'N/A'}</span>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Impact</span>
                                    <span className="text-sm font-bold text-green-400">{selectedLog.xp}</span>
                                </div>
                                <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Status</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-bold text-white">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
