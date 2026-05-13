import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Users,
    Layers,
    Activity,
    Terminal,
    Settings,
    AlertCircle,
    CheckCircle,
    Server,
    Cpu,
    Database,
    ChevronRight,
    Search,
    Bot,
    BarChart3,
    Beaker,
    FileQuestion,
    Plus,
    Activity as BrainIcon
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';


export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalLabs: 0,
        totalQuizzes: 0,
        totalEnrollments: 0,
        totalCertificates: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [recentLabs, setRecentLabs] = useState([]);
    const [recentQuizzes, setRecentQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await adminAPI.getDashboard();
                const { stats: apiStats, recentActivity } = res.data.data || {};

                if (apiStats) {
                    setStats({
                        totalUsers: apiStats.totalUsers ?? 0,
                        totalCourses: apiStats.totalCourses ?? 0,
                        totalLabs: apiStats.totalLabs ?? 0,
                        totalQuizzes: apiStats.totalQuizzes ?? 0,
                        totalEnrollments: apiStats.totalEnrollments ?? 0,
                        totalCertificates: apiStats.totalCertificates ?? 0,
                    });
                }

                if (res.data.data.recentLabs) setRecentLabs(res.data.data.recentLabs);
                if (res.data.data.recentQuizzes) setRecentQuizzes(res.data.data.recentQuizzes);

                if (recentActivity && recentActivity.length > 0) {
                    setRecentLogs(recentActivity);
                }
            } catch (err) {
                console.error('Admin dashboard synchronization failed:', err);
                setError('Neural synchronization failed — real-time data disconnected');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);


    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Accessing Command Core...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Live data warning banner */}
            {error && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-black uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
                    {error}
                </div>
            )}
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Command <span className="cyber-gradient-text">Core</span>: {user?.firstName}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        System-wide override & security logs active
                    </p>
                </div>

                <div className="flex gap-4">
                    <Badge variant="cyan" className="h-10 px-4">Cluster Operational</Badge>
                    <Badge variant="primary" className="h-10 px-4">Node v1.0.4</Badge>
                </div>
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={error ? 'ERR' : (stats?.totalUsers || 0)}
                    trend={error ? error : (stats?.totalUsers > 0 ? `${stats.totalUsers} registered` : 'No users')}
                    color={error ? "red" : "purple"}
                />
                <StatCard
                    icon={BrainIcon}
                    label="HRI Resilience"
                    value={loading ? '--' : "84%"}
                    trend="System-wide Avg"
                    color="green"
                />
                <StatCard
                    icon={Beaker}
                    label="Active Simulations"
                    value={stats?.totalLabs || 300}
                    trend="Nodes Deployed"
                    color="cyan"
                />
                <StatCard
                    icon={Shield}
                    label="Risk Exposure"
                    value="Low"
                    trend="Threat Posture"
                    color="blue"
                />
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4 items-center p-6 rounded-[2rem] bg-cyber-purple/5 border border-white/5 ">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mr-4">Quick Creation</div>
                <Button
                    onClick={() => navigate('/admin/labs/new')}
                    className="h-12 px-6 gap-2 bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-black uppercase tracking-widest text-[10px]"
                >
                    <Plus size={16} /> New Simulation Lab
                </Button>
                <Button
                    onClick={() => navigate('/admin/quizzes/new')}
                    className="h-12 px-6 gap-2 bg-cyber-purple text-white hover:bg-cyber-purple/90 font-black uppercase tracking-widest text-[10px]"
                >
                    <Plus size={16} /> New Assessment Quiz
                </Button>
            </div>

            {/* Content Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    icon={Beaker}
                    label="Total Labs"
                    value={stats?.totalLabs || 0}
                    trend={stats?.totalLabs > 0 ? `${stats.totalLabs} simulation scenarios` : 'Create your first lab'}
                    color="cyan"
                />
                <StatCard
                    icon={FileQuestion}
                    label="Total Quizzes"
                    value={stats?.totalQuizzes || 0}
                    trend={stats?.totalQuizzes > 0 ? `${stats.totalQuizzes} active assessments` : 'Create your first quiz'}
                    color="purple"
                />
            </div>

            {/* Quick Core Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ToolCard
                    title="Deep Analytics"
                    desc="Neural patterns & learner metrics"
                    path="/admin/analytics"
                    icon={BarChart3}
                    color="cyan"
                />
                <ToolCard
                    title="Forensic Logs"
                    desc="Real-time audit & trace stream"
                    path="/admin/security/logs"
                    icon={Terminal}
                    color="purple"
                />
                <ToolCard
                    title="AI Overrider"
                    desc="Control Aegis personality matrix"
                    path="/admin/ai"
                    icon={Bot}
                    color="green"
                />
                <ToolCard
                    title="Lab Management"
                    desc="Create & Deploy Simulation Scenarios"
                    path="/admin/labs"
                    icon={Beaker}
                    color="blue"
                />
                <ToolCard
                    title="Quiz Management"
                    desc="Create & Manage Dynamic Quizzes"
                    path="/admin/quizzes"
                    icon={FileQuestion}
                    color="purple"
                />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* System Health Widget */}
                <Card className="lg:col-span-4 p-8">
                    <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                        <Server size={20} className="text-cyber-cyan" />
                        System Health
                    </h3>
                    <div className="space-y-6">
                        <HealthBar label="CPU Usage" value={24} color="cyber-purple" />
                        <HealthBar label="Memory Node" value={42} color="cyber-cyan" />
                        <HealthBar label="Network Load" value={18} color="green-400" />
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                            <span>Last Sync</span>
                            <span>Just Now</span>
                        </div>
                    </div>
                </Card>

                {/* Audit Logs Widget */}
                <Card className="lg:col-span-8 p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic flex items-center gap-3">
                            <Terminal size={20} className="text-cyber-purple" />
                            Security Audit Logs
                        </h3>
                        <Button variant="outline" size="sm" className="h-8 text-[10px]">Export Logs</Button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentLogs.map((log) => (
                            <div key={log._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all font-mono text-[11px]">
                                <div className="flex items-center gap-4">
                                    <span className={`w-2 h-2 rounded-full ${log.severity === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-400'}`} />
                                    <span className="text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className="text-white font-bold">{log.action}</span>
                                    <span className="text-white/60">by {log.userId?.email || 'System'}</span>
                                </div>
                                <Badge variant={log.severity === 'critical' ? 'danger' : 'info'}>{log.severity}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Content Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Labs */}
                <Card className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black italic flex items-center gap-3">
                            <Beaker size={20} className="text-cyber-cyan" />
                            Recent Labs
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/labs')} className="text-[10px] uppercase font-bold text-cyber-cyan">View All →</Button>
                    </div>

                    <div className="space-y-4">
                        {recentLabs.length === 0 ? (
                            <div className="text-center py-10 text-white/20 border border-dashed border-white/5 rounded-2xl text-[10px] uppercase font-black uppercase tracking-widest">No Labs Created Yet</div>
                        ) : (
                            recentLabs.map(lab => (
                                <div key={lab._id} className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer" onClick={() => navigate(`/admin/labs/${lab._id}/edit`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 group-hover:scale-110 transition-transform">
                                            <Beaker size={16} />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-white mb-0.5">{lab.title}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/30">{lab.topic} · {lab.level}</div>
                                        </div>
                                    </div>
                                    <Badge variant={lab.status === 'published' ? 'success' : 'warning'} className="text-[8px] h-5">{lab.status}</Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Recent Quizzes */}
                <Card className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black italic flex items-center gap-3">
                            <FileQuestion size={20} className="text-cyber-purple" />
                            Recent Quizzes
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/quizzes')} className="text-[10px] uppercase font-bold text-cyber-purple">View All →</Button>
                    </div>

                    <div className="space-y-4">
                        {recentQuizzes.length === 0 ? (
                            <div className="text-center py-10 text-white/20 border border-dashed border-white/5 rounded-2xl text-[10px] uppercase font-black uppercase tracking-widest">No Quizzes Created Yet</div>
                        ) : (
                            recentQuizzes.map(quiz => (
                                <div key={quiz._id} className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer" onClick={() => navigate(`/admin/quizzes/${quiz._id}/edit`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-lg bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20 group-hover:scale-110 transition-transform">
                                            <FileQuestion size={16} />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-white mb-0.5">{quiz.title}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/30">{quiz.category} · {quiz.difficulty}</div>
                                        </div>
                                    </div>
                                    <Badge variant={quiz.status === 'published' ? 'success' : 'warning'} className="text-[8px] h-5">{quiz.status}</Badge>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, trend, color }) {
    const colors = {
        purple: 'text-cyber-purple bg-cyber-purple/10',
        cyan: 'text-cyber-cyan bg-cyber-cyan/10',
        green: 'text-green-400 bg-green-400/10',
        blue: 'text-blue-400 bg-blue-400/10'
    };

    return (
        <Card className="p-6 relative group overflow-hidden">
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform ${colors[color]}`}>
                <Icon size={100} />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon size={24} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</div>
            </div>
            <div className="flex items-end justify-between">
                <div className="text-4xl font-black italic">{value}</div>
                <div className="text-[10px] font-black text-green-400 italic mb-1">{trend}</div>
            </div>
        </Card>
    );
}

function HealthBar({ label, value, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full bg-${color}`}
                />
            </div>
        </div>
    );
}

function ToolCard({ title, desc, path, icon: Icon, color }) {
    const navigate = useNavigate();
    const colors = {
        cyan: 'text-cyber-cyan border-cyber-cyan/20 bg-cyber-cyan/5 hover:border-cyber-cyan/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
        purple: 'text-cyber-purple border-cyber-purple/20 bg-cyber-purple/5 hover:border-cyber-purple/40 shadow-[0_0_15px_rgba(124,58,237,0.1)]',
        green: 'text-green-400 border-green-400/20 bg-green-400/5 hover:border-green-400/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
    };

    return (
        <Card
            onClick={() => navigate(path)}
            className={`p-6 cursor-pointer transition-all duration-500 border group ${colors[color]}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black italic uppercase tracking-tight text-white">{title}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{desc}</p>
                </div>
                <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
            </div>
        </Card>
    );
}

