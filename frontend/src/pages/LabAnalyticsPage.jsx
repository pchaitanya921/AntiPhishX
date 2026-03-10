import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Clock, CheckCircle, AlertTriangle, Users, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import api from '../services/api';

export default function LabAnalyticsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [id]);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get(`/labs/${id}/analytics`);
            setAnalytics(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="w-12 h-12 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const data = [
        { name: 'Passed', value: analytics?.passedAttempts || 0, color: '#4ade80' },
        { name: 'Failed', value: analytics?.failedAttempts || 0, color: '#f87171' },
    ];

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(`/labs/${id}`)}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-2"
                    >
                        <ArrowLeft size={14} /> Back to Lab
                    </button>
                    <h1 className="text-3xl font-black italic tracking-tight text-white">Lab Analytics</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
                        Telemetry Node: {id}
                    </p>
                </div>
                <div className="px-4 py-2 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg">
                    <span className="text-cyber-purple font-mono text-xs font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse" />
                        LIVE DATA
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Total Attempts"
                    value={analytics?.totalAttempts}
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                    borderColor="border-blue-500/20"
                />
                <MetricCard
                    icon={CheckCircle}
                    label="Pass Rate"
                    value={`${analytics?.passRate}%`}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                    borderColor="border-green-500/20"
                />
                <MetricCard
                    icon={Clock}
                    label="Avg. Time"
                    value={formatTime(analytics?.avgTime || 0)}
                    color="text-yellow-400"
                    bgColor="bg-yellow-500/10"
                    borderColor="border-yellow-500/20"
                />
                <MetricCard
                    icon={HelpCircle}
                    label="Avg. Hints Used"
                    value={analytics?.avgHints}
                    color="text-purple-400"
                    bgColor="bg-purple-500/10"
                    borderColor="border-purple-500/20"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pass/Fail Distribution */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0d1117]/80">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/70 mb-6 flex items-center gap-2">
                        <BarChart3 size={16} /> Outcome Distribution
                    </h3>

                    <div className="h-[300px] w-full flex items-center justify-center">
                        {analytics?.totalAttempts > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-white/30 text-sm font-mono flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/10" />
                                NO DATA AVAILABLE
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Insight (Placeholder for now) */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0d1117]/80 flex flex-col">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/70 mb-6 flex items-center gap-2">
                        <AlertTriangle size={16} /> Key Insights
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <p className="text-white/50 max-w-sm text-sm leading-relaxed">
                            Start gathering more data to unlock advanced AI-driven insights on learner behavior and potential bottlenecks in this lab scenario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color, bgColor, borderColor }) {
    return (
        <div className={`p-5 rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black uppercase tracking-widest opacity-70 ${color}`}>{label}</span>
                <Icon size={18} className={color} />
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        </div>
    );
}
