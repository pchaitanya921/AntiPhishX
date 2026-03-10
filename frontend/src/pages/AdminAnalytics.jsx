import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    Shield,
    Users,
    Layers,
    Activity,
    TrendingUp,
    PieChart as PieChartIcon,
    BarChart3,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Card, Badge, Spinner } from '../components/ui';
import { adminAPI } from '../services/api';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const SAMPLE_DATA = {
    platformStats: {
        activeUsers: 1047,
        totalUsers: 1247,
        totalCourses: 15,
        totalEnrollments: 3892,
        averageEnrollmentsPerCourse: 259,
        totalCertificates: 847,
    },
    usersByRole: [
        { _id: 'learner', count: 1209 },
        { _id: 'instructor', count: 18 },
        { _id: 'admin', count: 3 },
        { _id: 'guest', count: 17 },
    ],
    topicsByCategory: [
        { _id: 'email', count: 5 },
        { _id: 'vishing', count: 3 },
        { _id: 'smishing', count: 2 },
        { _id: 'malware', count: 3 },
        { _id: 'advanced', count: 2 },
    ],
};

export default function AdminAnalytics() {
    const [data] = useState(SAMPLE_DATA);
    const [loading] = useState(false);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner size="lg" className="text-cyber-cyan mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Processing Telemetry...</p>
            </div>
        );
    }

    const { platformStats, usersByRole, topicsByCategory } = data || {};

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Platform <span className="cyber-gradient-text">Analytics</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Real-time system telemetry & learner metrics
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Active Learners"
                    value={platformStats?.activeUsers || 0}
                    subValue={`${platformStats?.totalUsers || 0} total registered`}
                    color="purple"
                />
                <StatCard
                    icon={Layers}
                    label="Training Topics"
                    value={platformStats?.totalCourses || 0}
                    subValue="Across 5 categories"
                    color="cyan"
                />
                <StatCard
                    icon={Activity}
                    label="Enrollments"
                    value={platformStats?.totalEnrollments || 0}
                    subValue={`${Math.round(platformStats?.averageEnrollmentsPerCourse || 0)} per topic avg`}
                    color="green"
                />
                <StatCard
                    icon={Shield}
                    label="Certificates"
                    value={platformStats?.totalCertificates || 0}
                    subValue="Verified issued"
                    color="blue"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Topics by Category */}
                <Card className="p-8">
                    <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                        <BarChart3 size={20} className="text-cyber-cyan" />
                        Topics by Category
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topicsByCategory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#ffffff40"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val.toUpperCase()}
                                />
                                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Users by Role */}
                <Card className="p-8">
                    <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                        <PieChartIcon size={20} className="text-cyber-purple" />
                        User Distribution
                    </h3>
                    <div className="h-[300px] w-full flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={usersByRole}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {usersByRole?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 12, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}
                                    formatter={(value, name) => [`${value} Users`, name.toUpperCase()]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-4 pl-8 border-l border-white/5">
                            {usersByRole?.map((role, idx) => (
                                <div key={role._id} className="flex items-center gap-3">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{role._id}</span>
                                    <span className="text-sm font-black text-white ml-auto italic">{role.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color }) {
    const colors = {
        purple: 'text-cyber-purple bg-cyber-purple/10',
        cyan: 'text-cyber-cyan bg-cyber-cyan/10',
        green: 'text-green-400 bg-green-400/10',
        blue: 'text-blue-400 bg-blue-400/10'
    };

    return (
        <Card className="p-6 relative group overflow-hidden border-white/5 hover:border-white/10 transition-all duration-300">
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 ${colors[color]}`}>
                <Icon size={120} />
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                    <Icon size={20} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</div>
            </div>

            <div className="relative z-10">
                <div className="text-4xl font-black italic tracking-tighter mb-1">{value}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                    {subValue}
                </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={14} className={colors[color].split(' ')[0]} />
            </div>
        </Card>
    );
}
