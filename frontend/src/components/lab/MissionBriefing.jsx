import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Terminal, AlertTriangle, Target, ChevronRight, Play } from 'lucide-react';
import { Button } from '../ui';

const MissionBriefing = ({ lab, onStart }) => {
    const [step, setStep] = useState(0);

    const briefingSteps = [
        {
            title: "NEURAL UPLINK ESTABLISHED",
            subtitle: "Authorized Intelligence Session",
            icon: Shield,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            content: (
                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-white/60 font-mono text-sm leading-relaxed">
                            Welcome, Operative. You have been granted access to the AntiPhishX Simulation Hub. 
                            Your mission is to analyze and neutralize a high-fidelity {lab.topic.replace(/_/g, ' ')} threat.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <span className="text-[10px] text-white/20 uppercase font-black block mb-1">Target Sector</span>
                            <span className="text-white font-black italic uppercase text-xs">{lab.topic}</span>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <span className="text-[10px] text-white/20 uppercase font-black block mb-1">Threat Level</span>
                            <span className="text-emerald-400 font-black italic uppercase text-xs">{lab.level}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "MISSION INTEL",
            subtitle: "Threat Scenario Analysis",
            icon: Target,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            content: (
                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <h4 className="text-white font-black italic uppercase text-xs mb-3">SITUATION REPORT</h4>
                        <p className="text-white/60 font-mono text-sm leading-relaxed">
                            {lab.description}
                        </p>
                    </div>
                    <div className="p-6 bg-red-500/[0.02] border border-red-500/10 rounded-2xl">
                        <h4 className="text-red-400 font-black italic uppercase text-xs mb-3">PRIMARY OBJECTIVE</h4>
                        <p className="text-white/60 font-mono text-sm leading-relaxed">
                            Successfully identify the malicious vector and prevent a data breach in the virtualized enterprise environment.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "ENVIRONMENT LOADED",
            subtitle: "Ready for Execution",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            content: (
                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <h4 className="text-white font-black italic uppercase text-xs mb-4 text-center">MISSION PROTOCOLS</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-white/40 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Inspect all artifacts for psychological triggers.
                            </li>
                            <li className="flex items-center gap-3 text-white/40 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Use the AI Copilot if anomaly detection fails.
                            </li>
                            <li className="flex items-center gap-3 text-white/40 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Submit your final determination for validation.
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    ];

    const currentStep = briefingSteps[step];
    const Icon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0d1117]">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-2xl"
            >
                {/* Header Decoration */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <div 
                                key={i}
                                className={`h-1 transition-all duration-500 ${i <= step ? 'w-12 bg-emerald-500' : 'w-6 bg-white/5'}`}
                            />
                        ))}
                    </div>
                    <div className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                        Protocol: AntiPhishX_X11
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111111]/40 border border-white/5  p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Icon */}
                        <div className="absolute -top-10 -right-10 opacity-[0.03]">
                            <Icon size={300} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-10">
                                <div className={`p-5 rounded-2xl ${currentStep.bg} ${currentStep.color}`}>
                                    <Icon size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                                        {currentStep.title}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                                        {currentStep.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="min-h-[250px]">
                                {currentStep.content}
                            </div>

                            <div className="mt-12 flex justify-between items-center">
                                <button 
                                    onClick={onStart}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors"
                                >
                                    Skip Briefing
                                </button>
                                
                                {step < briefingSteps.length - 1 ? (
                                    <Button 
                                        onClick={() => setStep(step + 1)}
                                        className="h-16 px-10 rounded-2xl gap-3"
                                    >
                                        Next Protocol <ChevronRight size={18} />
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={onStart}
                                        className="h-16 px-10 rounded-2xl gap-3 bg-emerald-500 text-black hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                    >
                                        Execute Mission <Play size={18} fill="currentColor" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Deco */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 animate-pulse">
                        Synchronizing Intelligence Node {lab._id?.slice(-6)}...
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default MissionBriefing;

