import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
    ShieldCheck, TrendingUp, AlertTriangle, Users, Building2,
    Download, LayoutDashboard, BrainCircuit, Target, ArrowUpRight,
    Map, FileSpreadsheet, ChevronRight, Info, Zap, Terminal, Globe, 
    Activity, Fingerprint, Lock, ShieldAlert
} from 'lucide-react';
import { Card, Button, Badge, Spinner } from '../components/ui';
import { enterpriseAPI, adminInsightAPI } from '../services/api';

export default function ExecutiveIntelligence() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Log tab switches
        if (data && activeTab) {
            const typeMap = {
                overview: 'DRILLDOWN_ANALYSIS',
                heatmap: 'RISK_HEATMAP_VIEW',
                predictive: 'PREDICTIVE_FORECAST_ACTION'
            };
            adminInsightAPI.logInteraction({
                insightType: typeMap[activeTab] || 'DRILLDOWN_ANALYSIS',
                actionTaken: 'tab_switched',
                metadata: { tab: activeTab }
            });
        }
    }, [activeTab, data]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await enterpriseAPI.getExecutiveSummary();
            if (res.data.success) {
                setData(res.data.data);
                // Log the initial view
                adminInsightAPI.logInteraction({
                    insightType: 'DRILLDOWN_ANALYSIS',
                    actionTaken: 'viewed',
                    metadata: { path: '/admin/intelligence' }
                });
            }
        } catch (err) {
            console.error('Failed to load executive intelligence', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-emerald-500/20  rounded-full animate-pulse" />
                <Spinner className="w-20 h-20 relative z-10" />
            </div>
            <div className="text-emerald-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">
                Decrypting Behavioral Telemetry...
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-20">
            <Card className="p-12 text-center border-red-500/20 bg-red-500/[0.02]">
                <ShieldAlert size={48} className="text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl font-black italic text-white uppercase mb-2">Access Denied</h2>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Metadata extraction failed. Verify uplink integrity.</p>
            </Card>
        </div>
    );

    const { kpis, heatmap, predictive } = data;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 space-y-12 pb-32">
            {/* Executive Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Badge variant="primary" className="px-4 py-2 text-[10px]">
                            Intelligence Layer v9.0
                        </Badge>
                        <div className="flex items-center gap-2 text-emerald-400/40 text-[9px] font-black uppercase tracking-[0.3em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Security Cleared
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                        Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Intelligence</span>
                    </h1>
                    <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Predictive human-risk modeling & organizational resilience metrics
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-16 px-8 gap-3">
                        <FileSpreadsheet size={18} /> Export Raw
                    </Button>
                    <Button className="h-16 px-10 gap-3">
                        <Download size={18} /> Generate Board Report
                    </Button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPICard label="Resilience Score" value={kpis.overallResilienceScore} trend={`+${kpis.reportingRateImprovement}%`} trendType="up" icon={ShieldCheck} color="emerald" />
                <KPICard label="Risk Reduction" value={`${kpis.phishingFailureReduction}%`} trend="vs Baseline" trendType="up" icon={TrendingUp} color="emerald" />
                <KPICard label="Active Simulations" value={kpis.activeCampaigns} trend="Sector Node Active" trendType="neutral" icon={Target} color="lime" />
                <KPICard label="Threat Exposure" value={kpis.totalSimulationsSent} trend="Dispatched" trendType="neutral" icon={AlertTriangle} color="emerald" />
            </div>

            {/* Intelligence Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex gap-3 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 w-fit">
                    {['overview', 'heatmap', 'predictive'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                                activeTab === tab 
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                    : 'text-white/20 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
                    <BrainCircuit size={16} /> Neural Analysis Mode: Active
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {activeTab === 'overview' && <OverviewTab heatmap={heatmap} predictive={predictive} />}
                    {activeTab === 'heatmap' && <HeatmapTab heatmap={heatmap} />}
                    {activeTab === 'predictive' && <PredictiveTab predictive={predictive} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function OverviewTab({ heatmap, predictive }) {
    return (
        <div className="grid lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 p-12 bg-[#111111]/40  border-white/5 rounded-[3rem]">
                <div className="flex justify-between items-center mb-12">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-4">
                            <Map size={24} className="text-emerald-400" />
                            Organizational Risk Distribution
                        </h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Psychological Attack Vector Mapping</p>
                    </div>
                </div>
                <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={heatmap} layout="vertical" barGap={8}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="_id" type="category" stroke="#ffffff20" fontSize={10} width={120} tick={{ fontWeight: 900, textTransform: 'uppercase' }} />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ backgroundColor: '#111111', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px' }}
                            />
                            <Bar dataKey="avgUrgency" name="Urgency Risk" fill="#10B981" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="avgAuthority" name="Authority Risk" fill="#A3E635" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="avgReward" name="Reward Risk" fill="#FFFFFF10" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-12 bg-emerald-500/[0.02] border-emerald-500/10  rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <BrainCircuit size={150} className="text-emerald-500" />
                </div>
                
                <div className="relative z-10 space-y-10">
                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-4 mb-2">
                            <BrainCircuit size={24} className="text-emerald-400" />
                            Neural Forecast
                        </h3>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                            Predictive 30-day credential compromise vulnerability clusters
                        </p>
                    </div>

                    <div className="space-y-4">
                        {predictive.highRiskForecasting.slice(0, 5).map((user, idx) => (
                            <motion.div 
                                whileHover={{ x: 5 }}
                                key={idx} 
                                className="flex items-center justify-between p-5 rounded-2xl bg-[#111111]/80 border border-white/5 hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-black text-xs text-black italic">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black italic uppercase tracking-tight text-white">{user.firstName} {user.lastName}</div>
                                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">{user.department}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 text-sm font-black italic">{Math.round(100 - user.points)}%</div>
                                    <div className="text-[8px] font-bold text-white/10 uppercase">High Risk</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <Button variant="outline" className="w-full h-16 rounded-[1.5rem] mt-4" onClick={() => setActiveTab('predictive')}>
                        Execute Full Analysis
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function HeatmapTab({ heatmap }) {
    return (
        <Card className="p-12 bg-[#111111]/40  border-white/5 rounded-[4rem]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="space-y-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tight">Psychological <span className="text-emerald-400">Heatmap</span></h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Multi-Vector Susceptibility Analysis</p>
                </div>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-white/40">High Urgency</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-lime-400" />
                        <span className="text-[9px] font-black uppercase text-white/40">Authority Sensitivity</span>
                    </div>
                </div>
            </div>

            <div className="h-[600px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={heatmap}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis dataKey="_id" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 900 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                        <Radar name="Urgency" dataKey="avgUrgency" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                        <Radar name="Authority" dataKey="avgAuthority" stroke="#A3E635" fill="#A3E635" fillOpacity={0.1} />
                        <Radar name="Reward" dataKey="avgReward" stroke="#ffffff" fill="#ffffff" fillOpacity={0.05} />
                        <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #ffffff10', borderRadius: '24px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 mt-16 pt-12 border-t border-white/5">
                {heatmap.slice(0, 3).map((dept, i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{dept._id} Sector</span>
                            <Badge variant="primary" className="text-[8px]">{Math.round((dept.avgUrgency + dept.avgAuthority)/2)} AVG RISK</Badge>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(dept.avgUrgency + dept.avgAuthority)/2}%` }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-lime-400"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function PredictiveTab({ predictive }) {
    return (
        <div className="space-y-10">
            <div className="grid lg:grid-cols-12 gap-10">
                <Card className="lg:col-span-8 p-12 bg-[#111111]/40  border-white/5 rounded-[4rem]">
                    <div className="mb-12">
                        <h3 className="text-3xl font-black italic uppercase tracking-tight mb-2">Neural <span className="text-emerald-400">Risk Timeline</span></h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Simulated Attack Failure Projections</p>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={predictive.highRiskForecasting.slice(0, 10)}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="lastName" stroke="#ffffff10" fontSize={10} tick={{ fontWeight: 900 }} />
                                <YAxis stroke="#ffffff10" fontSize={10} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #ffffff10', borderRadius: '24px' }} />
                                <Area type="monotone" dataKey="points" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="lg:col-span-4 p-12 bg-emerald-500/[0.02] border-emerald-500/10 rounded-[4rem] flex flex-col justify-between">
                    <div className="space-y-8">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <BrainCircuit size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Intelligence Recommendation</h3>
                        <p className="text-sm font-medium text-white/30 leading-relaxed italic">
                            "AI analysis indicates a 42% increase in urgency-based vulnerability within the Finance and HR sectors. We recommend immediate deployment of the 'Quarterly Bonus' adaptive simulation node."
                        </p>
                    </div>
                    <Button variant="primary" className="h-18 w-full rounded-[2rem] mt-12">
                        Execute Remediation
                    </Button>
                </Card>
            </div>

            <Card className="p-12 bg-[#111111]/40 border-white/5 rounded-[4rem]">
                <h3 className="text-2xl font-black italic uppercase mb-10">High-Risk Individual Profiles</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predictive.highRiskForecasting.map((user, i) => (
                        <div key={i} className="p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black italic text-emerald-400">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                    user.points < 40 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    Node_{user._id.slice(-4)}
                                </div>
                            </div>
                            <h4 className="text-lg font-black italic text-white uppercase mb-1">{user.firstName} {user.lastName}</h4>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">{user.department}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-emerald-400" />
                                    <span className="text-[9px] font-black uppercase text-white/40">Neural Risk</span>
                                </div>
                                <span className="text-sm font-black italic text-emerald-400">{Math.round(100 - user.points)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function KPICard({ label, value, trend, trendType, icon: Icon, color }) {
    return (
        <Card className="p-8 bg-[#111111]/40 border-white/5  rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-700">
            <div className="flex justify-between items-start mb-12">
                <div className={`p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-700`}>
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${
                    trendType === 'up' ? 'text-emerald-400' : 'text-white/20'
                }`}>
                    {trend} {trendType === 'up' && <ArrowUpRight size={14} />}
                </div>
            </div>
            <div>
                <div className="text-5xl font-black italic tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-700 origin-left text-white leading-none">
                    {value}
                </div>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{label}</div>
            </div>
        </Card>
    );
}

