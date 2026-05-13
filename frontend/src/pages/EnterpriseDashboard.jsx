import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    ShieldAlert, 
    Users, 
    Zap, 
    TrendingUp, 
    Activity, 
    CreditCard, 
    BarChart3, 
    Clock, 
    Award,
    RefreshCw,
    BrainCircuit,
    ArrowUpRight,
    Search,
    Filter,
    FileText,
    Settings,
    MoreHorizontal,
    Mail,
    Crosshair
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import { Card, Button, Badge, Spinner, Input } from '../components/ui';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import DepartmentDrillDownModal from '../components/dashboard/DepartmentDrillDownModal';

const EnterpriseDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Drilldown state
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            const response = await api.get('/analytics/enterprise-executive');
            setDashboardData(response.data.data);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error('Dashboard Fetch Error:', error);
            toast.error('Failed to sync intelligence node.');
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Spinner className="w-20 h-20" />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/40 animate-pulse">
                        Synchronizing Neural Metrics...
                    </p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
                <Card className="max-w-md p-10 border-white/5 bg-[#0A0A0A] text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <ShieldAlert size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Intelligence Node Offline</h3>
                    <p className="text-xs font-medium text-white/40 leading-relaxed italic">
                        The executive synchronization layer is currently unavailable. This may occur if your account lacks proper enterprise clearance or the analytics engine is recalibrating.
                    </p>
                    <Button variant="outline" className="w-full h-12 border-white/10" onClick={fetchDashboardData}>
                        Re-attempt Synchronization
                    </Button>
                </Card>
            </div>
        );
    }

    const { summary, riskHeatmap, growthAndRevenue, activityFeed, trainingEfficiency, riskForecasting } = dashboardData;

    // Formatting growth data for AreaChart
    const growthChartData = growthAndRevenue?.userGrowth?.map(g => ({
        name: `${g._id.month}/${g._id.year}`,
        users: g.count
    })) || [];

    // Formatting risk heatmap for Radar Chart
    const radarData = riskHeatmap?.length > 0 ? riskHeatmap.slice(0, 5).map(dept => ({
        subject: dept._id || 'General',
        A: Math.round(dept.avgRiskScore || 0),
        B: Math.round(dept.avgUrgency || 0),
        fullMark: 100,
    })) : [];

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-12 pb-32">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <LayoutDashboard size={16} className="text-black" />
                        </div>
                        <Badge variant="primary" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                            Enterprise Node v2.0
                        </Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">
                        Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyber-cyan">Intelligence</span>
                    </h1>
                    <p className="text-white/30 text-xs font-medium tracking-widest uppercase italic">
                        Real-time adaptive risk observability // SEC: {new Date().toLocaleTimeString()}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        variant="secondary" 
                        className="h-14 px-6 border-white/5"
                        onClick={fetchDashboardData}
                        loading={refreshing}
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    </Button>
                    <Button variant="primary" className="h-14 px-8">
                        <FileText size={16} /> Export Intelligence
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Resilience Score', value: `${summary.overallResilienceScore}%`, icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Risk Reduction', value: `${summary.phishingFailureReduction}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Total Revenue', value: `₹${(growthAndRevenue.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Active Learners', value: growthAndRevenue.subscriptionStatus, icon: Users, color: 'text-lime-400', bg: 'bg-lime-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-8 group hover:border-white/20 transition-all duration-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon size={20} />
                                </div>
                                <ArrowUpRight size={16} className="text-white/10 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-white italic mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{stat.label}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Primary Analytics */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* User Growth Chart */}
                    <Card className="p-10 border-white/5 bg-[#0A0A0A]">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-xl font-black uppercase italic text-white tracking-tight mb-1">Scale Velocity</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Active Node Enrollment Trend</p>
                            </div>
                            <Badge variant="primary" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400">Live Telemetry</Badge>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthChartData.length > 0 ? growthChartData : [{name: 'Empty', users: 0}]}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px', fontWeight: '900' }}
                                        itemStyle={{ color: '#10b981' }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Department Risk Radar & Predictive Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Card className="p-10 border-white/5 bg-[#0A0A0A] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black uppercase italic text-white tracking-tight">Sector Vulnerability</h3>
                                <Badge variant="primary" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Interactive</Badge>
                            </div>
                            <div className="h-[250px] w-full flex items-center justify-center">
                                {radarData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 900}} />
                                            <Radar name="Risk" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
                                            <Radar name="Susceptibility" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                                            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">No Dept. Data Found</div>
                                )}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {radarData.map((dept, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedDepartment(dept.subject);
                                            setIsDrilldownOpen(true);
                                        }}
                                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 transition-all text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-cyan-400 flex items-center gap-2 group"
                                    >
                                        {dept.subject}
                                        <Crosshair size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-10 border-white/5 bg-[#0A0A0A] flex flex-col">
                            <h3 className="text-xl font-black uppercase italic text-white tracking-tight mb-8">AI Forecasting</h3>
                            <div className="space-y-6 flex-1">
                                {riskForecasting.highRiskForecasting.slice(0, 4).map((user, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-500">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-white leading-none mb-1">{user.firstName} {user.lastName}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{user.department}</p>
                                            </div>
                                        </div>
                                        <Badge variant="danger" className="h-6">
                                            {Math.round(user.behavioralProfile?.riskScore || 0)} RISK
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-8 border border-white/5">View All Forecasts</Button>
                        </Card>
                    </div>

                    {/* Training Efficiency */}
                    <Card className="p-10 border-white/5 bg-[#0A0A0A]">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-xl font-black uppercase italic text-white tracking-tight mb-1">Neural Efficiency</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Topic-wise Completion and Accuracy</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black uppercase text-white/30">Completed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                    <span className="text-[8px] font-black uppercase text-white/30">Accuracy</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trainingEfficiency.labStats.slice(0, 6)}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis 
                                        dataKey="_id" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900}} 
                                        dy={10}
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px' }}
                                    />
                                    <Bar dataKey="completed" fill="#10b981" radius={[10, 10, 0, 0]} />
                                    <Bar dataKey="avgScore" fill="#06b6d4" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Real-time Feed & AI Insights */}
                <div className="lg:col-span-4 space-y-10">
                    
                    {/* AI Insights Widget */}
                    <Card className="p-8 border-none bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BrainCircuit size={80} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Zap size={18} className="text-emerald-400 animate-pulse" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">AI Strategic Insights</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="primary" className="h-5 px-3">Critical</Badge>
                                        <span className="text-[9px] font-black text-white/40 uppercase">Vulnerability Detected</span>
                                    </div>
                                    <p className="text-xs font-medium text-white/70 leading-relaxed italic">
                                        "Engineering department shows 45% susceptibility to authority-based phishing. Recommend deploying 'CEO Fraud' simulations immediately."
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="lime" className="h-5 px-3">Positive</Badge>
                                        <span className="text-[9px] font-black text-white/40 uppercase">Resilience Growth</span>
                                    </div>
                                    <p className="text-xs font-medium text-white/70 leading-relaxed italic">
                                        "Finance team has improved detection speed by 2.4s this month. Neural adaptation is 15% above target."
                                    </p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-8 border-emerald-500/20 text-emerald-400 text-[9px] h-12">
                                Generate Full Risk Intelligence Report
                            </Button>
                        </div>
                    </Card>

                    {/* Real-time Activity Feed */}
                    <Card className="p-10 border-white/5 bg-[#0A0A0A]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black uppercase italic text-white tracking-tight">Signal Feed</h3>
                            <Activity size={16} className="text-emerald-500 animate-pulse" />
                        </div>
                        
                        <div className="space-y-10">
                            {activityFeed.length > 0 ? activityFeed.slice(0, 8).map((log, i) => (
                                <div key={i} className="flex gap-4 relative group">
                                    {i !== activityFeed.slice(0, 8).length - 1 && (
                                        <div className="absolute left-[19px] top-10 bottom-[-40px] w-[1px] bg-white/5" />
                                    )}
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                                        {log.user?.avatar ? (
                                            <img src={log.user.avatar} className="w-full h-full rounded-full" />
                                        ) : (
                                            <Users size={16} className="text-white/20" />
                                        )}
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-bold text-white italic">{log.user?.firstName || 'System'}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                                {log.eventType?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-medium text-white/40 italic line-clamp-2">
                                            {log.description || 'Action recorded in secure ledger.'}
                                        </p>
                                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
                                            <Clock size={10} />
                                            {log.createdAt ? (
                                                (() => {
                                                    try {
                                                        return format(new Date(log.createdAt), 'HH:mm:ss');
                                                    } catch (e) {
                                                        return '--:--:--';
                                                    }
                                                })()
                                            ) : '--:--:--'}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">No Signals Detected</div>
                            )}
                        </div>
                    </Card>

                    {/* Subscription Distribution */}
                    <Card className="p-10 border-white/5 bg-[#0A0A0A]">
                        <h3 className="text-xl font-black uppercase italic text-white tracking-tight mb-10">Node Deployment</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={growthAndRevenue.planDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={10}
                                        dataKey="count"
                                    >
                                        {growthAndRevenue.planDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#10b981', '#06b6d4', '#8b5cf6'][index % 3]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '1rem', fontSize: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-10">
                            {growthAndRevenue.planDistribution.map((plan, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500'][i % 3]}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{plan._id?.replace('_', ' ')}</span>
                                    </div>
                                    <span className="text-xs font-black text-white italic">{plan.count} Nodes</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Drilldown Modal */}
            <DepartmentDrillDownModal 
                isOpen={isDrilldownOpen} 
                onClose={() => setIsDrilldownOpen(false)} 
                department={selectedDepartment} 
            />
        </div>
    );
};

export default EnterpriseDashboard;
