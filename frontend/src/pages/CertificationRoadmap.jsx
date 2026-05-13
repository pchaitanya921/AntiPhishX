import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Lock, 
    Unlock, 
    CheckCircle2, 
    ChevronRight, 
    Shield, 
    Zap, 
    Cpu, 
    Fingerprint,
    Award,
    Target,
    Map,
    X,
    TrendingUp
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { certificatesAPI } from '../services/api';
import { AnimatePresence } from 'framer-motion';

const TRACKS = [
    { 
        id: 'executive_intelligence', 
        title: 'Executive Intelligence', 
        icon: Zap,
        color: 'from-amber-500/20 to-amber-500/5',
        accent: 'text-amber-500',
        description: 'Master the art of executive deception detection and high-level strategy.'
    },
    { 
        id: 'tactical_defense', 
        title: 'Tactical Defense', 
        icon: Shield,
        color: 'from-emerald-500/20 to-emerald-500/5',
        accent: 'text-emerald-500',
        description: 'Analyze technical indicators and neutralize active phishing infrastructure.'
    },
    { 
        id: 'cognitive_security', 
        title: 'Cognitive Security', 
        icon: Fingerprint,
        color: 'from-cyan-500/20 to-cyan-500/5',
        accent: 'text-cyan-500',
        description: 'Understand the psychology of social engineering and cognitive manipulation.'
    },
    { 
        id: 'advanced_ai_adaptive', 
        title: 'Advanced AI Defense', 
        icon: Cpu,
        color: 'from-purple-500/20 to-purple-500/5',
        accent: 'text-purple-500',
        description: 'Secure against next-gen AI-driven threats and automated deception.'
    },
];

const LEVELS = [
    { id: 'beginner', title: 'Beginner', labs: 25 },
    { id: 'intermediate', title: 'Intermediate', labs: 50 },
    { id: 'advanced', title: 'Advanced', labs: 75 },
];

export default function CertificationRoadmap() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrereq, setSelectedPrereq] = useState(null);
    const [eligibilityLoading, setEligibilityLoading] = useState(false);
    const [eligibilityData, setEligibilityData] = useState(null);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const res = await certificatesAPI.getMyCertificates();
                if (res.data.success) setCertificates(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    const handleViewPrerequisites = async (domain, levelId, levelTitle) => {
        try {
            setSelectedPrereq({ domain, levelId, levelTitle });
            setEligibilityLoading(true);
            setEligibilityData(null);
            
            const res = await certificatesAPI.getEligibility({ domain, level: levelId });
            if (res.data.success) {
                setEligibilityData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch eligibility:', err);
        } finally {
            setEligibilityLoading(false);
        }
    };

    return (
        <>
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <Map className="text-emerald-400 w-10 h-10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Academy Infrastructure</span>
                </motion.div>
                <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter mb-4">
                    Certification <span className="text-emerald-400">Roadmap</span>
                </h1>
                <p className="text-white/40 max-w-2xl mx-auto text-lg font-medium">
                    Navigate the professional cybersecurity accreditation path. Progress from foundational security to advanced AI-adaptive defense mastery.
                </p>
            </div>

            <div className="space-y-32">
                {TRACKS.map((track, trackIdx) => (
                    <div key={track.id} className="relative">
                        {/* Background Path Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            {/* Track Identity */}
                            <div className="w-full md:w-80 shrink-0">
                                <div className={`p-8 rounded-[3rem] bg-gradient-to-br ${track.color} border border-white/10 `}>
                                    <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center ${track.accent} mb-6`}>
                                        <track.icon size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">{track.title}</h2>
                                    <p className="text-white/40 text-sm leading-relaxed mb-8">{track.description}</p>
                                    <div className="flex items-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-widest">
                                        <Target size={14} /> 3 Mastery Tiers
                                    </div>
                                </div>
                            </div>

                            {/* Progression Nodes */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                {LEVELS.map((level, levelIdx) => {
                                    const cert = certificates.find(c => c.domain === track.id && c.level === level.id);
                                    const isLocked = levelIdx > 0 && !certificates.find(c => c.domain === track.id && c.level === LEVELS[levelIdx-1].id);
                                    
                                    return (
                                        <motion.div
                                            key={level.id}
                                            whileHover={{ y: -5 }}
                                            className="relative"
                                        >
                                            <Card className={`p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5  h-full flex flex-col ${cert ? 'border-emerald-500/20' : isLocked ? 'opacity-40 grayscale' : ''}`}>
                                                <div className="flex justify-between items-start mb-10">
                                                    <Badge variant={cert ? "emerald" : "outline"} className="px-4 py-1.5 uppercase italic text-[9px] tracking-widest">
                                                        {level.title}
                                                    </Badge>
                                                    {cert ? (
                                                        <CheckCircle2 className="text-emerald-400" size={24} />
                                                    ) : isLocked ? (
                                                        <Lock className="text-white/20" size={24} />
                                                    ) : (
                                                        <Unlock className="text-emerald-500/40" size={24} />
                                                    )}
                                                </div>

                                                <div className="mb-8">
                                                    <h3 className="text-lg font-black italic text-white uppercase tracking-tight mb-1">{level.title} Mastery</h3>
                                                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Level {levelIdx + 1} Credential</p>
                                                </div>

                                                <div className="mt-auto space-y-6">
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-white/30">Requirement</span>
                                                        <span className="text-white">{level.labs} Labs</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${cert ? 'bg-emerald-500' : 'bg-white/10'}`} 
                                                            style={{ width: cert ? '100%' : '20%' }} 
                                                        />
                                                    </div>
                                                    
                                                    {!cert && !isLocked && (
                                                        <Button 
                                                            onClick={() => handleViewPrerequisites(track.id, level.id, level.title)}
                                                            className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-[9px] font-black italic rounded-xl flex items-center justify-center gap-2"
                                                        >
                                                            View Prerequisites <ChevronRight size={14} />
                                                        </Button>
                                                    )}
                                                    {cert && (
                                                        <Button className="w-full h-12 bg-emerald-500 text-black hover:bg-emerald-400 uppercase tracking-widest text-[9px] font-black italic rounded-xl flex items-center justify-center gap-2">
                                                            Earned <Award size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Recommendation Section */}
            <div className="mt-40 p-16 rounded-[4rem] bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12">
                    <Zap className="text-emerald-400 w-20 h-20 opacity-10 animate-pulse" />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <Badge variant="emerald" className="mb-6 px-4 py-2 uppercase tracking-[0.3em] italic">AI Adaptive Suggestion</Badge>
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-6">
                        Personalized Path Recommendation
                    </h2>
                    <p className="text-white/60 text-lg font-medium mb-10 leading-relaxed">
                        Based on your current Human-Risk profile, our AI suggests prioritizing the <span className="text-emerald-400">Tactical Defense</span> track. Your detection speed in email-based simulations shows high potential for Level 2 Mastery.
                    </p>
                    <Button className="h-16 px-10 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl italic shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        Launch Recommended Lab
                    </Button>
                </div>
            </div>

            {/* Prerequisite Modal */}
            <AnimatePresence>
                {selectedPrereq && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedPrereq(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#111111] border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full" />
                            
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <Badge variant="emerald" className="mb-2 uppercase tracking-widest text-[8px]">Requirement Intel</Badge>
                                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                                        {selectedPrereq.levelTitle} <span className="text-emerald-400">Prerequisites</span>
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedPrereq(null)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {eligibilityLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Analyzing User Matrix...</p>
                                </div>
                            ) : eligibilityData ? (
                                <div className="space-y-8 relative z-10">
                                    {/* Lab Progress */}
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Intelligence Modules</p>
                                                <h4 className="text-xl font-black italic text-white uppercase">Lab Completion</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-emerald-400">{eligibilityData.stats.completedLabs}</span>
                                                <span className="text-white/20 font-black"> / {eligibilityData.stats.requiredLabs}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (eligibilityData.stats.completedLabs / eligibilityData.stats.requiredLabs) * 100)}%` }}
                                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Resilience Score */}
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Behavioral Threshold</p>
                                                <h4 className="text-xl font-black italic text-white uppercase">Resilience Index</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-cyan-400">{Math.round(eligibilityData.stats.resilienceScore)}%</span>
                                                <span className="text-white/20 font-black text-xs"> (Req: {eligibilityData.stats.requiredResilience}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.round(eligibilityData.stats.resilienceScore)}%` }}
                                                className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                                            <TrendingUp size={20} />
                                        </div>
                                        <p className="text-[11px] font-medium text-white/60 italic leading-relaxed">
                                            {eligibilityData.eligible 
                                                ? "Thresholds met. Your profile is synchronized for credential issuance. Visit the training sector to finalize."
                                                : `Node optimization required. Complete ${eligibilityData.stats.requiredLabs - eligibilityData.stats.completedLabs} more labs in this domain to unlock certification eligibility.`}
                                        </p>
                                    </div>

                                    <Button 
                                        onClick={() => setSelectedPrereq(null)}
                                        className="w-full h-16 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                    >
                                        Acknowledge Intel
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-white/20 font-black uppercase tracking-widest text-sm">Failed to retrieve matrix data.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </>
    );
}

