import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Building2,
    Users,
    ShieldAlert,
    TrendingDown,
    Activity,
    Download,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Target
} from 'lucide-react';
import { Card, Button, Badge, Spinner } from '../components/ui';
import { enterpriseAPI, adminInsightAPI } from '../services/api';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

export default function EnterpriseAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const reportRef = useRef(null);

    useEffect(() => {
        enterpriseAPI.getAnalytics()
            .then(res => {
                if (res.data.success) {
                    setData(res.data.data);
                    // Log the view action
                    adminInsightAPI.logInteraction({
                        insightType: 'RISK_HEATMAP_VIEW',
                        actionTaken: 'viewed',
                        metadata: { path: '/admin/enterprise-analytics' }
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;
        try {
            setGeneratingPDF(true);
            
            // Log the export action
            adminInsightAPI.logInteraction({
                insightType: 'REPORT_EXPORT',
                actionTaken: 'downloaded',
                metadata: { reportType: 'Enterprise_Performance_PDF' }
            });

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: '#0a0a0c', // Match dark theme
                windowWidth: 1200
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Enterprise_Security_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('PDF Generation Failed', err);
        } finally {
            setGeneratingPDF(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner size="lg" className="text-cyber-cyan mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Aggregating Organizational Data...</p>
            </div>
        );
    }

    if (!data) return <div className="text-center text-white">Failed to load enterprise data</div>;

    const { platformStats, departmentData, topVulnerabilities, heatmap = [] } = data;

    // Format vulnerability data for PieChart
    const pieData = topVulnerabilities.map(v => ({ name: v.type.replace(/_/g, ' '), value: v.count }));

    const heatmapData = heatmap.map(dept => ({
        name: dept._id || 'Unknown',
        Urgency: Math.round(dept.avgUrgency || 0),
        Authority: Math.round(dept.avgAuthority || 0),
        Reward: Math.round(dept.avgReward || 0),
        Curiosity: Math.round(dept.avgCuriosity || 0),
        Fear: Math.round(dept.avgFear || 0)
    }));

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-4">
                        <Building2 size={12} className="text-cyber-cyan" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-cyan">Enterprise Overview</span>
                    </div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Organizational <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Performance</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Department segmentation & risk telemetry
                    </p>
                </div>

                <Button 
                    onClick={handleDownloadReport} 
                    disabled={generatingPDF}
                    className="h-12 px-6 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                >
                    {generatingPDF ? <Spinner size="sm" /> : <FileText size={16} />}
                    {generatingPDF ? 'Generating...' : 'Download PDF Report'}
                </Button>
            </div>

            {/* Dashboard Container to be printed */}
            <div ref={reportRef} className="space-y-8 bg-[#0a0a0c] p-1 rounded-2xl">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={ShieldAlert}
                        label="Average Risk Score"
                        value={platformStats.averageRiskScore}
                        subValue="Scale 0-100 (Lower is better)"
                        color="purple"
                    />
                    <StatCard
                        icon={Target}
                        label="Detection Accuracy"
                        value={`${platformStats.averageAccuracy}%`}
                        subValue="Overall phishing flag catch rate"
                        color="green"
                    />
                    <StatCard
                        icon={Activity}
                        label="Avg Response Time"
                        value={`${platformStats.averageResponseTime}s`}
                        subValue="Time taken per simulation"
                        color="cyan"
                    />
                    <StatCard
                        icon={Users}
                        label="Active Staff"
                        value={platformStats.totalLearners}
                        subValue="Enrolled in training"
                        color="blue"
                    />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* Department Performance */}
                    <Card className="p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                            <Building2 size={20} className="text-emerald-400" />
                            Risk by Department
                        </h3>
                        <div className="h-[300px] w-full">
                            {departmentData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={departmentData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="department" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                        <Bar dataKey="averageRiskScore" name="Avg Risk Score" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="averageAccuracy" name="Avg Accuracy %" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest font-bold">No department data available</div>
                            )}
                        </div>
                    </Card>

                    {/* Common Vulnerabilities */}
                    <Card className="p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                            <ShieldAlert size={20} className="text-rose-500" />
                            Common Vulnerabilities
                        </h3>
                        <div className="h-[300px] w-full flex items-center">
                            {pieData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(10, 10, 12, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                                                itemStyle={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-col gap-3 pl-4 max-w-[50%]">
                                        {pieData.map((v, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                <span className="text-[10px] font-bold text-white/70 uppercase leading-tight truncate">{v.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest font-bold">No vulnerability data available</div>
                            )}
                        </div>
                    </Card>

                    {/* HRI Heatmap (New) */}
                    <Card className="lg:col-span-2 p-10 border-white/5 bg-white/[0.02] rounded-[3rem]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                                    <Fingerprint size={24} className="text-cyber-cyan" />
                                    Human Risk <span className="text-cyber-cyan">Intelligence Heatmap</span>
                                </h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Departmental Susceptibility Analysis</p>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={heatmapData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                    <XAxis type="number" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <YAxis dataKey="name" type="category" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="Urgency" fill="#EF4444" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="Authority" fill="#FACC15" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="Reward" fill="#10B981" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="Curiosity" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="Fear" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color }) {
    const colors = {
        purple: 'text-purple-400 bg-purple-400/10',
        cyan: 'text-cyan-400 bg-cyan-400/10',
        green: 'text-emerald-400 bg-emerald-400/10',
        blue: 'text-blue-400 bg-blue-400/10'
    };

    return (
        <Card className="p-6 relative overflow-hidden border-white/5 bg-white/[0.02]">
            <div className={`absolute -right-4 -bottom-4 opacity-[0.05] ${colors[color]}`}>
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
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {subValue}
                </div>
            </div>
        </Card>
    );
}

