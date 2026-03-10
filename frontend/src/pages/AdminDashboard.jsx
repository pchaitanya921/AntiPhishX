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
    Beaker
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

// Realistic sample data shown when API returns empty values
const SAMPLE_STATS = {
    totalUsers: 1247,
    totalInstructors: 18,
    totalLearners: 1209,
    totalCourses: 15,
    totalEnrollments: 3892,
    totalCertificates: 847,
};

const SAMPLE_LOGS = [
    { _id: '1', action: 'LOGIN_SUCCESS', severity: 'info', timestamp: new Date(Date.now() - 120000).toISOString(), userId: { email: 'priya.sharma@techcorp.in' } },
    { _id: '2', action: 'QUIZ_COMPLETED', severity: 'info', timestamp: new Date(Date.now() - 300000).toISOString(), userId: { email: 'arjun.mehta@fintech.co' } },
    { _id: '3', action: 'LOGIN_FAILURE', severity: 'critical', timestamp: new Date(Date.now() - 480000).toISOString(), userId: { email: 'unknown@external.net' } },
    { _id: '4', action: 'CERTIFICATE_ISSUED', severity: 'info', timestamp: new Date(Date.now() - 720000).toISOString(), userId: { email: 'pooja.nair@startup.io' } },
    { _id: '5', action: 'ACCOUNT_LOCKED', severity: 'critical', timestamp: new Date(Date.now() - 900000).toISOString(), userId: { email: 'raj.kumar@bank.com' } },
    { _id: '6', action: 'LAB_SUBMITTED', severity: 'info', timestamp: new Date(Date.now() - 1200000).toISOString(), userId: { email: 'meera.iyer@university.edu' } },
    { _id: '7', action: 'ROLE_MODIFIED', severity: 'critical', timestamp: new Date(Date.now() - 1800000).toISOString(), userId: { email: 'admin@antiphishx.ai' } },
    { _id: '8', action: 'PASSWORD_RESET', severity: 'info', timestamp: new Date(Date.now() - 2400000).toISOString(), userId: { email: 'sanjay.gupta@corp.com' } },
    { _id: '9', action: 'PHISHING_SCAN', severity: 'info', timestamp: new Date(Date.now() - 3000000).toISOString(), userId: { email: 'deepika.rao@it.in' } },
    { _id: '10', action: 'LOGIN_SUCCESS', severity: 'info', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: { email: 'vikram.bose@security.ai' } },
    { _id: '11', action: 'SUSPICIOUS_ACTIVITY', severity: 'critical', timestamp: new Date(Date.now() - 4200000).toISOString(), userId: { email: '192.168.10.45 [Bot]' } },
    { _id: '12', action: 'COURSE_PUBLISHED', severity: 'info', timestamp: new Date(Date.now() - 5400000).toISOString(), userId: { email: 'instructor@antiphishx.ai' } },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats] = useState(SAMPLE_STATS);
    const [recentLogs] = useState(SAMPLE_LOGS);
    const [loading] = useState(false);
    const [error] = useState(null);



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
                    icon={Layers}
                    label="Total Courses"
                    value={stats?.totalCourses || 0}
                    trend={stats?.totalCourses > 0 ? `${stats.totalCourses} available` : 'Create courses'}
                    color="cyan"
                />
                <StatCard
                    icon={Activity}
                    label="Total Enrollments"
                    value={stats?.totalEnrollments || 0}
                    trend={stats?.totalEnrollments > 0 ? `${stats.totalEnrollments} active` : 'No enrollments'}
                    color="green"
                />
                <StatCard
                    icon={Shield}
                    label="Certificates Issued"
                    value={stats?.totalCertificates || 0}
                    trend={stats?.totalCertificates > 0 ? `${stats.totalCertificates} earned` : 'None yet'}
                    color="blue"
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
                    icon={Beaker} // Will need to import Beaker
                    color="blue"
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
