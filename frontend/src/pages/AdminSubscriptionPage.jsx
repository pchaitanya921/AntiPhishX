import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Scroll, Users, Search, Filter, 
    ChevronRight, CheckCircle2, Clock, 
    AlertTriangle, XCircle, CreditCard,
    Zap, Shield, Globe, Award,
    ArrowUpRight, BarChart3, TrendingUp,
    Activity, Target, Download, ExternalLink
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';
import { Card, Button, Badge, Input, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { PLANS, PLAN_CONFIG } from '../config/plans';

const COLORS = ['#10b981', '#7c3aed', '#06b6d4', '#f59e0b', '#ef4444'];

export default function AdminSubscriptionPage() {
    const { user: currentUser } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [view, setView] = useState('nodes'); // 'nodes' or 'intelligence'

    useEffect(() => {
        fetchSubscriptions();
        fetchAnalytics();
        fetchRecentTransactions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setSubscriptions(data.data);
        } catch (err) {
            console.error('Failed to fetch subscriptions', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/payments/analytics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setAnalytics(data.data);
        } catch (err) {
            console.error('Analytics fetch failed', err);
        }
    };

    const fetchRecentTransactions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/payments/recent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setRecentTransactions(data.data);
        } catch (err) {
            console.error('Transactions fetch failed', err);
        }
    };

    const handleUpdatePlan = async (userId, updateData) => {
        try {
            setIsUpdating(true);
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            const data = await res.json();
            if (data.success) {
                setSubscriptions(prev => prev.map(s => s._id === userId ? { ...s, ...data.data } : s));
                if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, ...data.data });
                fetchAnalytics();
            }
        } catch (err) {
            console.error('Update failed', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredSubs = subscriptions.filter(sub => {
        const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             `${sub.firstName} ${sub.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = planFilter === 'all' || sub.currentPlan === planFilter;
        return matchesSearch && matchesPlan;
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
                        <CreditCard size={12} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Commercial Governance</span>
                    </div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic text-white uppercase">
                        SaaS <span className="text-purple-400">Intelligence</span>
                    </h1>
                </div>
                <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <button 
                        onClick={() => setView('nodes')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'nodes' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Node Matrix
                    </button>
                    <button 
                        onClick={() => setView('intelligence')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'intelligence' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Payment Analytics
                    </button>
                </div>
            </div>

            {view === 'intelligence' ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Revenue Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnalyticCard 
                            label="Total Revenue" 
                            value={`₹${analytics?.totalRevenue?.toLocaleString() || 0}`} 
                            icon={TrendingUp} 
                            color="emerald" 
                            trend="Accumulated Value"
                        />
                        <AnalyticCard 
                            label="Monthly Recurring" 
                            value={`₹${analytics?.mrr?.toLocaleString() || 0}`} 
                            icon={Zap} 
                            color="purple" 
                            trend="MRR Velocity"
                        />
                        <AnalyticCard 
                            label="Active Nodes" 
                            value={analytics?.activeSubscriptions || 0} 
                            icon={Users} 
                            color="cyan" 
                            trend="Enterprise Scale"
                        />
                        <AnalyticCard 
                            label="Success Rate" 
                            value={`${analytics?.successRate || 0}%`} 
                            icon={Target} 
                            color="emerald" 
                            trend="Payment Fidelity"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Revenue Timeline */}
                        <Card className="lg:col-span-2 p-10 bg-white/[0.02] border-white/5 rounded-[3rem]">
                            <div className="space-y-1 mb-10">
                                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">
                                    Revenue <span className="text-purple-400">Timeline</span>
                                </h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Last 30 Days Growth</p>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics?.timeline}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="_id" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                            itemStyle={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Plan Mix */}
                        <Card className="p-10 bg-white/[0.02] border-white/5 rounded-[3rem]">
                            <div className="space-y-1 mb-10 text-center">
                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                                    Tier <span className="text-purple-400">Mix</span>
                                </h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Subscription Distribution</p>
                            </div>
                            <div className="h-[250px] w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics?.planDist}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {analytics?.planDist?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 space-y-4">
                                {analytics?.planDist?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{p.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-white">{p.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Recent Transactions Table */}
                    <Card className="p-10 bg-white/[0.02] border-white/5 rounded-[3rem]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">
                                Transaction <span className="text-purple-400">Log</span>
                            </h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                Export CSV <Download size={14} className="ml-2" />
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 pb-4">
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Identity</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Tier</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Amount</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Method</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/20">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {recentTransactions.map((tx, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4">
                                                <div className="font-bold text-white text-sm">{tx.user?.firstName} {tx.user?.lastName}</div>
                                                <div className="text-[10px] text-white/20 font-medium">{tx.user?.email}</div>
                                            </td>
                                            <td className="py-4">
                                                <Badge variant={PLAN_CONFIG[tx.planId]?.color} className="text-[8px]">{tx.planId.replace('_', ' ').toUpperCase()}</Badge>
                                            </td>
                                            <td className="py-4 font-mono text-xs text-white">₹{tx.amount}</td>
                                            <td className="py-4">
                                                <div className={`text-[8px] font-black uppercase tracking-widest ${tx.status === 'paid' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">{tx.paymentMethod}</td>
                                            <td className="py-4 text-[10px] font-medium text-white/20">{new Date(tx.paidAt || tx.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col xl:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by Node Identity (Name or Email)..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white/80 focus:border-purple-500/30 transition-all outline-none"
                                />
                            </div>
                            <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                {['all', ...Object.values(PLANS)].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPlanFilter(p)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            planFilter === p 
                                                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                                                : 'text-white/20 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {p === 'all' ? 'ALL TIERS' : p.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subscription List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <Spinner size="lg" variant="purple" />
                                </div>
                            ) : filteredSubs.length === 0 ? (
                                <div className="py-20 text-center border border-dashed border-white/5 rounded-[3rem]">
                                    <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">No matching nodes detected</p>
                                </div>
                            ) : (
                                filteredSubs.map(sub => (
                                    <motion.div 
                                        layoutId={sub._id}
                                        key={sub._id}
                                        onClick={() => setSelectedUser(sub)}
                                        className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                                            selectedUser?._id === sub._id 
                                                ? 'bg-purple-500/[0.03] border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.1)]' 
                                                : 'bg-[#111111]/40 border-white/5 hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-purple-400 transition-colors`}>
                                                    <PlanIcon plan={sub.currentPlan} size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black italic uppercase text-white transition-colors tracking-tight">
                                                        {sub.firstName} {sub.lastName}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">
                                                        {sub.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <Badge variant={PLAN_CONFIG[sub.currentPlan]?.color || 'default'} className="text-[8px]">
                                                    {PLAN_CONFIG[sub.currentPlan]?.name || 'UNKNOWN NODE'}
                                                </Badge>
                                                <StatusBadge status={sub.subscriptionStatus} />
                                                <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            {selectedUser ? (
                                <motion.div
                                    key={selectedUser._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="sticky top-10 space-y-6"
                                >
                                    <Card className="p-10 border-white/10 rounded-[3rem] space-y-10 bg-purple-500/[0.02]">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                                                <PlanIcon plan={selectedUser.currentPlan} size={24} />
                                            </div>
                                            <button 
                                                onClick={() => setSelectedUser(null)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 transition-all"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">
                                                {selectedUser.firstName} {selectedUser.lastName}
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400/60">
                                                Node Subscription Intelligence
                                            </p>
                                        </div>

                                        <div className="space-y-6 border-y border-white/5 py-8">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Tier</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {Object.values(PLANS).map(pId => (
                                                        <button
                                                            key={pId}
                                                            onClick={() => handleUpdatePlan(selectedUser._id, { plan: pId })}
                                                            disabled={isUpdating}
                                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                                selectedUser.currentPlan === pId 
                                                                    ? `bg-${PLAN_CONFIG[pId].color}-500/10 border-${PLAN_CONFIG[pId].color}-500/40 text-white`
                                                                    : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <PlanIcon plan={pId} size={16} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{PLAN_CONFIG[pId].name}</span>
                                                            </div>
                                                            {selectedUser.currentPlan === pId && <CheckCircle2 size={14} className={`text-${PLAN_CONFIG[pId].color}-400`} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-4">
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5  -z-10 group-hover:bg-purple-500/10 transition-colors" />
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Organization Root</p>
                                                    <p className="text-xs font-black italic text-white uppercase tracking-tight">
                                                        {selectedUser.organization?.name || 'Independent Node'}
                                                    </p>
                                                </div>
                                                <Shield size={20} className="text-white/10 group-hover:text-purple-400 transition-colors" />
                                            </div>

                                            <Button 
                                                variant="danger" 
                                                onClick={async () => {
                                                    if (window.confirm('Reset all active device nodes for this user?')) {
                                                        await handleUpdatePlan(selectedUser._id, { resetDevices: true });
                                                    }
                                                }}
                                                className="w-full h-14 rounded-2xl gap-3 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <AlertTriangle size={16} />
                                                Reset Device Matrix
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <div className="sticky top-10 p-12 border border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                                    <Scroll size={40} className="text-white/5 mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Select a node to modulate tiers</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

function AnalyticCard({ label, value, icon: Icon, color, trend }) {
    const colors = {
        emerald: 'text-emerald-400 bg-emerald-400/5 border-emerald-500/20',
        purple: 'text-purple-400 bg-purple-400/5 border-purple-500/20',
        cyan: 'text-cyan-400 bg-cyan-400/5 border-cyan-500/20',
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

function PlanIcon({ plan, size }) {
    if (plan === PLANS.LATTICE) return <Award size={size} />;
    if (plan === PLANS.NEURAL) return <Zap size={size} />;
    return <Shield size={size} />;
}

function StatusBadge({ status }) {
    const configs = {
        active: { color: 'emerald', icon: CheckCircle2 },
        trial: { color: 'blue', icon: Clock },
        expired: { color: 'red', icon: AlertTriangle },
        cancelled: { color: 'slate', icon: XCircle },
    };
    const config = configs[status] || configs.trial;
    const Icon = config.icon;

    const colors = {
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        red: 'bg-red-500/10 border-red-500/20 text-red-400',
        slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${colors[config.color]}`}>
            <Icon size={10} /> {status}
        </div>
    );
}
