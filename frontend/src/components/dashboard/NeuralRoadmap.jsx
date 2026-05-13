import React from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Shield, 
    Lock, 
    CheckCircle2, 
    BrainCircuit, 
    TrendingUp, 
    Clock, 
    ChevronRight, 
    Target,
    Activity
} from 'lucide-react';
import { Card, Badge, Button } from '../ui';

const NeuralRoadmap = ({ roadmapData, onSmartStart }) => {
    if (!roadmapData || roadmapData.status === 'initializing') {
        return (
            <Card className="p-10 bg-[#111111]/40 border-white/5 animate-pulse">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="h-4 w-48 bg-white/5 rounded" />
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl" />
                    ))}
                </div>
            </Card>
        );
    }

    const { riskScore, confidenceIndex, roadmap, forecast } = roadmapData;

    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight">Neural <span className="text-emerald-400">Roadmap</span></h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">AI-Orchestrated Resilience Path</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Risk Forecast</p>
                        <div className="flex items-center gap-2 text-emerald-400 font-black italic text-sm">
                            <TrendingUp size={14} /> -{riskScore - forecast.projection30Days}% Next 30d
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5" />
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">AI Confidence</p>
                        <div className="text-white font-black italic text-sm">
                            {Math.round(confidenceIndex * 100)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Start Banner */}
            <Card className="p-8 border-none bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Zap size={100} className="text-emerald-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge variant="primary" className="h-5 px-3 mb-2 animate-pulse">Critical Priority</Badge>
                        <h4 className="text-2xl font-black italic text-white uppercase tracking-tight">Optimal Node Detected</h4>
                        <p className="text-xs text-white/40 font-medium italic max-w-md">
                            "AI identifies high susceptibility to authority-based social engineering. Recommend immediate deployment of 'Executive Impersonation' node."
                        </p>
                    </div>
                    <Button 
                        variant="primary" 
                        className="h-16 px-10 rounded-[1.5rem] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        onClick={onSmartStart}
                    >
                        <Zap size={18} className="mr-3" /> Execute Smart Start
                    </Button>
                </div>
            </Card>

            {/* Roadmap Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                {roadmap.map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                    >
                        {/* Dot */}
                        <div className={`absolute -left-10 top-2 w-4 h-4 rounded-full border-2 bg-[#0A0A0A] z-10 
                            ${step.status === 'mastered' ? 'border-emerald-500 bg-emerald-500' : 
                              step.status === 'active' ? 'border-emerald-500 animate-pulse' : 
                              'border-white/10'}`} 
                        >
                            {step.status === 'mastered' && <CheckCircle2 size={10} className="text-black" />}
                        </div>

                        <Card className={`p-6 border-white/5 transition-all duration-500 hover:border-emerald-500/20 
                            ${step.status === 'active' ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : 'bg-[#111111]/40'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h5 className={`text-sm font-black uppercase italic tracking-tight ${step.status === 'mastered' ? 'text-white/40 line-through' : 'text-white'}`}>
                                            {step.title}
                                        </h5>
                                        {step.status === 'prioritized' && <Badge variant="primary" className="h-4 text-[7px]">Recommended</Badge>}
                                        {step.status === 'mastered' && <Badge variant="success" className="h-4 text-[7px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Mastered</Badge>}
                                    </div>
                                    <p className="text-[10px] font-medium text-white/30 italic">
                                        {step.description || step.reasoning || 'Mission objective clear. Proceed with caution.'}
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    {step.status === 'mastered' ? (
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Shield size={16} />
                                        </div>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full border border-white/5">
                                            <ChevronRight size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* AI Reasoning Footer */}
            <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Activity size={14} />
                </div>
                <p className="text-[10px] font-medium text-white/20 italic leading-relaxed">
                    "Adaptive Learning Engine is continuously re-calibrating your path. Next evaluation cycle in 24h or upon completion of prioritized node."
                </p>
            </div>
        </div>
    );
};

export default NeuralRoadmap;
