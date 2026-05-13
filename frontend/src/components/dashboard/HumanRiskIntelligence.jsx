import React from 'react';
import { motion } from 'framer-motion';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';
import { 
    BrainCircuit, Target, Zap, Activity, 
    ShieldAlert, Fingerprint, Cpu, TrendingUp 
} from 'lucide-react';

const HumanRiskIntelligence = ({ hri }) => {
    if (!hri) return null;

    const radarData = [
        { subject: 'Urgency', A: hri.urgencySusceptibility || 0, fullMark: 100 },
        { subject: 'Authority', A: hri.authoritySusceptibility || 0, fullMark: 100 },
        { subject: 'Reward', A: hri.rewardSusceptibility || 0, fullMark: 100 },
        { subject: 'Curiosity', A: hri.curiositySusceptibility || 0, fullMark: 100 },
        { subject: 'Fear', A: hri.fearSusceptibility || 0, fullMark: 100 },
        { subject: 'Pressure', A: hri.socialPressureSusceptibility || 0, fullMark: 100 },
    ];

    const domainData = [
        { name: 'Executive', value: hri.domainExpertise?.executive_intelligence || 0 },
        { name: 'Tactical', value: hri.domainExpertise?.tactical_defense || 0 },
        { name: 'Cognitive', value: hri.domainExpertise?.cognitive_security || 0 },
        { name: 'AI/Adaptive', value: hri.domainExpertise?.advanced_ai_adaptive || 0 },
    ];

    const getRiskColor = (score) => {
        if (score < 30) return '#10B981'; // Emerald
        if (score < 60) return '#FACC15'; // Yellow
        return '#EF4444'; // Red
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Risk Score Card */}
            <div className="lg:col-span-4 bg-[#111111]/40 border border-white/5  rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Overall Risk Posture</h3>
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="96" cy="96" r="88"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="12"
                        />
                        <motion.circle
                            cx="96" cy="96" r="88"
                            fill="none"
                            stroke={getRiskColor(hri.riskScore)}
                            strokeWidth="12"
                            strokeDasharray={552}
                            initial={{ strokeDashoffset: 552 }}
                            animate={{ strokeDashoffset: 552 - (552 * hri.riskScore) / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="text-center z-10">
                        <span className="text-6xl font-black italic tracking-tighter text-white">{hri.riskScore}</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">HRI Index</p>
                    </div>
                </div>

                <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getRiskColor(hri.riskScore) }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        {hri.riskScore > 60 ? 'CRITICAL VULNERABILITY' : hri.riskScore > 30 ? 'MODERATE EXPOSURE' : 'OPTIMAL RESILIENCE'}
                    </span>
                </div>
            </div>

            {/* Susceptibility Radar */}
            <div className="lg:col-span-8 bg-[#111111]/40 border border-white/5  rounded-[3rem] p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <Fingerprint size={24} className="text-emerald-400" />
                            Neural <span className="text-emerald-400">Susceptibility</span>
                        </h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Psychological Manipulation Vectors</p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }}
                            />
                            <Radar
                                name="Susceptibility"
                                dataKey="A"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="lg:col-span-12 grid md:grid-cols-4 gap-6">
                <MetricBox 
                    icon={Activity} 
                    label="Detection Speed" 
                    value={`${hri.detectionSpeed || 0}s`} 
                    sub="Avg Response" 
                />
                <MetricBox 
                    icon={Target} 
                    label="Accuracy" 
                    value={`${hri.neutralizationAccuracy || 0}%`} 
                    sub="Neutralization" 
                />
                <MetricBox 
                    icon={TrendingUp} 
                    label="Failure Velocity" 
                    value={hri.failureVelocity || 0} 
                    sub="Drift Rate" 
                />
                <MetricBox 
                    icon={Cpu} 
                    label="HRI Maturity" 
                    value={hri.riskScore < 30 ? 'V4' : 'V2'} 
                    sub="Neural Level" 
                />
            </div>

            {/* Domain Expertise Bar Chart */}
            <div className="lg:col-span-12 bg-[#111111]/40 border border-white/5  rounded-[3rem] p-10">
                <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <BrainCircuit size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">Domain <span className="text-emerald-400">Mastery</span></h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">Cross-Sector Intelligence Calibration</p>
                    </div>
                </div>

                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={domainData}>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {domainData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10B981' : '#A3E635'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

function MetricBox({ icon: Icon, label, value, sub }) {
    return (
        <div className="bg-[#111111]/40 border border-white/5  rounded-[2.5rem] p-8 group hover:border-emerald-500/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-emerald-400/60 group-hover:text-emerald-400 transition-colors">
                    <Icon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black italic text-white tracking-tighter">{value}</span>
                <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    );
}

export default HumanRiskIntelligence;

