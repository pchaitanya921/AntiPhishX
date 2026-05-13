import React, { useState, useEffect } from 'react';
import {
    Clock, Map, List, HelpCircle, Flag, ChevronRight, ChevronDown,
    CheckCircle, AlertTriangle, FileText, Shield, BarChart3,
    Users, Edit3, Target, Zap, Trophy, ArrowLeft, ShieldCheck, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge } from '../ui';

const getAnswerOptions = (lab) => {
    const topic = (lab?.topic || '').toLowerCase();
    const type = (lab?.type || '').toLowerCase();

    if (topic === 'social_engineering' || type === 'social_engineering') {
        return ['phishing', 'vishing', 'smishing', 'pretexting', 'baiting', 'tailgating', 'impersonation'];
    }
    if (topic === 'qr_phishing' || type === 'qr' || type === 'qr_code') {
        return ['phishing', 'legitimate', 'suspicious', 'malware'];
    }
    if (topic === 'smishing' || type === 'smishing' || type === 'sms') {
        return ['smishing', 'legitimate', 'suspicious'];
    }
    if (topic === 'vishing' || type === 'vishing' || type === 'call') {
        return ['vishing', 'legitimate', 'suspicious'];
    }
    if (topic === 'advanced_ai_adaptive' || type === 'adaptive') {
        return ['phishing', 'legitimate', 'suspicious', 'ai_manipulation', 'neural_attack'];
    }
    if (topic === 'malware_detection' || type === 'malware' || type === 'file') {
        return ['malware', 'legitimate', 'suspicious', 'ransomware'];
    }
    return ['phishing', 'legitimate', 'suspicious'];
};

const LabManual = ({ lab, timeLeft, onSubmit, onRetry, onSubmitLab, submitted, result, formatTime, previewMode }) => {
    const [activeSection, setActiveSection] = useState('scenario');
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [visibleHints, setVisibleHints] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [telemetry, setTelemetry] = useState({
        urgencySusceptibility: 0,
        authoritySusceptibility: 0,
        curiositySusceptibility: 0,
        hesitationPatterns: [],
        reportingAction: false
    });

    useEffect(() => {
        const handleStepComplete = (event) => {
            setCompletedSteps(event.detail.completedSteps || []);
        };
        const handleTelemetry = (event) => {
            setTelemetry(prev => ({
                ...prev,
                ...event.detail
            }));
        };
        window.addEventListener('labStepCompleted', handleStepComplete);
        window.addEventListener('labTelemetryUpdate', handleTelemetry);
        return () => {
            window.removeEventListener('labStepCompleted', handleStepComplete);
            window.removeEventListener('labTelemetryUpdate', handleTelemetry);
        };
    }, []);

    const [submissionStatus, setSubmissionStatus] = useState('Analyzing Threat...');
    const [submissionError, setSubmissionError] = useState(null);
    
    const statusCycle = [
        'Analyzing Threat...',
        'Processing Intelligence...',
        'Verifying Determination...',
        'Updating Risk Profile...'
    ];

    useEffect(() => {
        let interval;
        if (isSubmitting) {
            setSubmissionError(null);
            let i = 0;
            interval = setInterval(() => {
                i = (i + 1) % statusCycle.length;
                setSubmissionStatus(statusCycle[i]);
            }, 1200);
        } else {
            setSubmissionStatus(statusCycle[0]);
        }
        return () => clearInterval(interval);
    }, [isSubmitting]);

    const handleSubmit = async () => {
        if (isSubmitting || !selectedAnswer || submitted) return;
        
        setIsSubmitting(true);
        setSubmissionError(null);
        
        try {
            await onSubmit(selectedAnswer, visibleHints, telemetry);
        } catch (error) {
            console.error("[LAB_SUBMIT] Critical failure:", error);
            const errorDetail = error.response?.data?.message || error.message || "Intelligence Node unreachable.";
            setSubmissionError(`Transmission failure: ${errorDetail}`);
            setIsSubmitting(false);
        } finally {
            // Safety timeout remains for absolute UI robustness
            setTimeout(() => setIsSubmitting(false), 5000);
        }
    };

    return (
        <div className="h-full w-full bg-[#0A0A0A] flex flex-col relative overflow-hidden font-sans border-r border-white/5">
            {/* Header */}
            <div className="p-8 pb-4 shrink-0 border-b border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                    <Badge variant="primary" className="px-3 py-1.5 text-[9px]">
                        Protocol_{lab.topic?.slice(0, 3).toUpperCase() || 'CORE'}
                    </Badge>
                    <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        Active Node
                    </div>
                </div>

                <h1 className="text-xl font-black italic uppercase tracking-tight text-white leading-tight">
                    {lab.title}
                </h1>

                {/* Status Bar */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-700 ${timeLeft < 300 && !previewMode ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]' : 'bg-emerald-500/5 border-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.05)]'}`}>
                    <div className="flex items-center gap-3">
                        <Clock size={16} className={timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Temporal Sync</span>
                    </div>
                    <span className={`font-mono font-black text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {previewMode ? 'UNLIMITED' : formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-4 flex gap-2 shrink-0">
                {[
                    { id: 'scenario', icon: Map, label: 'Briefing' },
                    { id: 'instructions', icon: Terminal, label: 'Execution' },
                    { id: 'hints', icon: HelpCircle, label: 'Intel' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl transition-all duration-500 border ${activeSection === tab.id
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'text-white/20 border-transparent hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeSection === tab.id ? 'text-emerald-400' : ''} />
                        <span className="font-black italic uppercase text-[9px] tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar space-y-8">
                <AnimatePresence mode="wait">
                    {activeSection === 'scenario' && (
                        <motion.div
                            key="scenario"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-emerald-400/40">
                                    <Map size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Operation Context</span>
                                </div>
                                <p className="text-sm font-medium text-white/60 leading-relaxed italic">
                                    "{lab.scenario}"
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'instructions' && (
                        <motion.div
                            key="instructions"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-10"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-lime-400/40">
                                    <Target size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Operational Objectives</span>
                                </div>
                                <div className="space-y-3">
                                    {(lab.steps || ["Analyze digital artifacts", "Identify IoCs", "Execute final determination"]).map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-medium text-white/50 group-hover:text-white transition-colors pt-0.5 leading-snug">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Final Determination</h3>
                                    {!submitted && <Badge variant="primary" className="text-[8px]">+ {lab.points || 100} PTS</Badge>}
                                </div>

                                {!submitted ? (
                                    <div className="space-y-3">
                                        {getAnswerOptions(lab).map((option) => (
                                            <div
                                                key={option}
                                                onClick={() => setSelectedAnswer(option)}
                                                className={`flex items-center p-5 rounded-[1.25rem] border transition-all duration-500 cursor-pointer group ${selectedAnswer === option
                                                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 mr-4 transition-all ${selectedAnswer === option ? 'border-emerald-400 bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'border-white/10'}`} />
                                                <span className={`text-sm font-black italic uppercase tracking-wider ${selectedAnswer === option ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                                                    {option}
                                                </span>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSubmit();
                                            }}
                                            disabled={!selectedAnswer || isSubmitting || submitted}
                                            className={`w-full h-[64px] mt-8 font-black rounded-full transition-all duration-500 flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-[10px] relative z-[100] ${
                                                submitted
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                                    : !selectedAnswer || isSubmitting 
                                                        ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' 
                                                        : 'bg-emerald-500 text-black hover:bg-white shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95'
                                            }`}
                                        >
                                            {submitted ? (
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck size={18} className="animate-pulse" />
                                                    <span>MISSION COMPLETE</span>
                                                </div>
                                            ) : isSubmitting ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                                    <span className="animate-pulse tracking-widest">{submissionStatus}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    Execute Submission
                                                    {selectedAnswer && <ChevronRight size={18} className="opacity-40" />}
                                                </>
                                            )}
                                        </button>

                                        {submissionError && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                                            >
                                                <AlertTriangle size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{submissionError}</span>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                        className={`p-8 rounded-[2rem] border  relative overflow-hidden ${result?.correct ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 border-red-500/30'}`}
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                                            {result?.correct ? <Trophy size={80} /> : <AlertTriangle size={80} />}
                                        </div>
                                        
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result?.correct ? 'bg-emerald-400 text-black shadow-[0_0_20px_#10b981]' : 'bg-red-500 text-white'}`}
                                                >
                                                    {result?.correct ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                                </motion.div>
                                                <div>
                                                    <h4 className={`text-xl font-black italic uppercase tracking-tight ${result?.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {result?.correct ? 'MISSION SUCCESS' : 'SYSTEM COMPROMISE'}
                                                    </h4>
                                                    <div className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">
                                                        {result?.correct ? 'Threat Neutralized Successfully' : `Security Breach Detected [Node_${lab._id?.slice(-4)}]`}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                                                <p className="text-xs font-medium text-white/60 leading-relaxed italic">
                                                    "{result?.explanation}"
                                                </p>
                                            </div>

                                            {result?.correct && (
                                                <div className="flex items-center justify-between pt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Points Harvested</span>
                                                        <motion.span 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.5 }}
                                                            className="text-2xl font-black italic text-emerald-400"
                                                        >
                                                            +{result?.pointsEarned || lab.points} XP
                                                        </motion.span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Node Status</span>
                                                        <motion.span 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.7 }}
                                                            className="text-xs font-black italic text-emerald-400 uppercase tracking-widest"
                                                        >
                                                            SECURED
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            )}
                                            {result?.correct && (
                                                <div className="pt-4">
                                                    <button
                                                        onClick={onSubmitLab}
                                                        className="w-full h-[64px] bg-cyber-cyan text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:shadow-[0_0_30px_rgba(0,255,194,0.5)] transition-all hover:-translate-y-0.5 active:scale-95 group"
                                                    >
                                                        <span className="flex items-center justify-center gap-3">
                                                            Finalize Mission
                                                            <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                            {!result?.correct && (
                                                <div className="pt-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAnswer('');
                                                            onRetry();
                                                        }}
                                                        className="w-full h-[52px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all active:scale-95"
                                                    >
                                                        Analyze & Retry Mission
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'hints' && (
                        <motion.div
                            key="hints"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-lime-400 italic">Intelligence Intel</h3>
                                <div className="text-[9px] font-black text-white/10 uppercase tracking-widest">Restricted Access</div>
                            </div>

                            {!previewMode && visibleHints < (lab.hints?.length || 0) && (
                                <button
                                    onClick={() => setVisibleHints(prev => prev + 1)}
                                    className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-center group"
                                >
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <Zap size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Request Intelligence Reveal</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Cost: {lab.hints?.[visibleHints]?.cost || 25} XP</span>
                                </button>
                            )}

                            <div className="space-y-4">
                                {lab.hints?.slice(0, previewMode ? lab.hints.length : visibleHints).map((hint, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-lime-400/20 transition-all">
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                                            <HelpCircle size={40} />
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest italic">Intel_Node 0{i + 1}</span>
                                        </div>
                                        <p className="text-sm font-medium text-white/50 leading-relaxed italic">
                                            "{typeof hint === 'string' ? hint : (hint.content || hint.text)}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex items-center gap-4 opacity-30">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Core Status</div>
                    <div className="text-[10px] font-mono text-emerald-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ENCRYPTED_UPLINK_STABLE
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabManual;

