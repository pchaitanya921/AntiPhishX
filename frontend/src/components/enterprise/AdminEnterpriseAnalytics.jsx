import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
    TrendingUp, Users, Target, Activity, 
    ArrowUpRight, ArrowDownRight, Briefcase, 
    Zap, ShieldCheck, Clock
} from 'lucide-react';
import { Card, Badge } from '../ui';

const COLORS = ['#10b981', '#06b6d4', '#7c3aed', '#f59e0b', '#ef4444'];

export default function AdminEnterpriseAnalytics({ requests }) {
    const stats = useMemo(() => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const scheduled = requests.filter(r => r.status === 'scheduled').length;
        const completed = requests.filter(r => r.status === 'completed').length;
        
        // Distribution by status
        const statusData = [
            { name: 'Pending', value: pending },
            { name: 'Scheduled', value: scheduled },
            { name: 'Completed', value: completed },
            { name: 'Contacted', value: requests.filter(r => r.status === 'contacted').length },
        ].filter(d => d.value > 0);

        // Distribution by type
        const typeData = [
            { name: 'Pilot', value: requests.filter(r => r.type === 'pilot').length },
            { name: 'Demo', value: requests.filter(r => r.type === 'demo').length },
            { name: 'Architecture', value: requests.filter(r => r.type === 'architecture').length },
        ].filter(d => d.value > 0);

        // Timeline (Last 7 days mock or grouped from requests)
        const timelineData = requests.reduce((acc, req) => {
            const date = new Date(req.createdAt).toLocaleDateString();
            const existing = acc.find(a => a.date === date);
            if (existing) existing.count += 1;
            else acc.push({ date, count: 1 });
            return acc;
        }, []).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);

        return { total, pending, scheduled, completed, statusData, typeData, timelineData };
    }, [requests]);

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Inquiries" 
                    value={stats.total} 
                    icon={Briefcase} 
                    color="emerald"
                    trend="+12% from last week"
                />
                <StatCard 
                    label="Active Pilots" 
                    value={stats.scheduled} 
                    icon={Zap} 
                    color="cyan"
                    trend="5 Pipeline Sessions"
                />
                <StatCard 
                    label="Success Rate" 
                    value={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`} 
                    icon={Target} 
                    color="purple"
                    trend="Inquiry to Closure"
                />
                <StatCard 
                    label="Pending Review" 
                    value={stats.pending} 
                    icon={Clock} 
                    color="amber"
                    trend="Action Required"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Inquiry Timeline */}
                <Card className="lg:col-span-2 p-10 bg-white/[0.02] border-white/5 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3 text-white">
                                <Activity size={24} className="text-emerald-400" />
                                Growth <span className="text-emerald-400">Trajectory</span>
                            </h3>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Inbound Enterprise Lead Velocity</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.timelineData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Lead Distribution */}
                <Card className="p-10 bg-white/[0.02] border-white/5 rounded-[3rem]">
                    <div className="space-y-1 mb-10 text-center">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                            Status <span className="text-emerald-400">Mix</span>
                        </h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Pipeline Health</p>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.statusData}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {stats.statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <div className="text-3xl font-black italic text-white">{stats.total}</div>
                            <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Total</div>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {stats.statusData.map((s, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, trend }) {
    const colors = {
        emerald: 'text-emerald-400 bg-emerald-400/5 border-emerald-500/20',
        cyan: 'text-cyan-400 bg-cyan-400/5 border-cyan-500/20',
        purple: 'text-purple-400 bg-purple-400/5 border-purple-500/20',
        amber: 'text-amber-400 bg-amber-400/5 border-amber-500/20'
    };

    return (
        <Card className={`p-8 border bg-white/[0.02] rounded-[2.5rem] relative overflow-hidden group hover:bg-white/[0.04] transition-all ${colors[color]}`}>
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${colors[color]} border-none`}>
                        <Icon size={24} />
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">
                        {trend}
                    </div>
                </div>
                <div>
                    <div className="text-4xl font-black italic tracking-tighter text-white mb-1">{value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</div>
                </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Icon size={120} />
            </div>
        </Card>
    );
}

