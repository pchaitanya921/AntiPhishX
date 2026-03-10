import React, { useState, useEffect } from 'react';
import {
    Clock,
    Map,
    List,
    HelpCircle,
    Flag,
    ChevronRight,
    ChevronDown,
    CheckCircle,
    AlertTriangle,
    FileText,
    Shield,
    BarChart3,
    Users,
    Edit3
} from 'lucide-react';

// Returns the appropriate multiple-choice verdicts for each lab type.
// Falls back to the classic phishing trio if unknown.
const getAnswerOptions = (lab) => {
    const topic = (lab?.topic || '').toLowerCase();
    const type = (lab?.type || '').toLowerCase();

    if (topic === 'social_engineering' || type === 'social_engineering') {
        return [
            'phishing',
            'vishing',
            'smishing',
            'pretexting',
            'baiting',
            'tailgating',
            'impersonation',
        ];
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
    if (topic === 'malware_detection' || type === 'malware' || type === 'file') {
        return ['malware', 'legitimate', 'suspicious', 'ransomware'];
    }
    if (topic === 'bec' || topic === 'business_email_compromise') {
        return ['phishing', 'legitimate', 'bec', 'suspicious'];
    }
    // Default — classic phishing labs
    return ['phishing', 'legitimate', 'suspicious'];
};

const LabManual = ({ lab, timeLeft, onSubmit, submitted, result, formatTime, previewMode }) => {
    const [activeSection, setActiveSection] = useState('scenario'); // scenario, instructions, hints
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [flagInput, setFlagInput] = useState('');
    const [visibleHints, setVisibleHints] = useState(0); // Track how many hints revealed
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]); // Track terminal step completion

    // Listen for terminal step completion events
    useEffect(() => {
        const handleStepComplete = (event) => {
            setCompletedSteps(event.detail.completedSteps || []);
        };

        window.addEventListener('labStepCompleted', handleStepComplete);
        return () => window.removeEventListener('labStepCompleted', handleStepComplete);
    }, []);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        console.log("Submitting lab answer:", selectedAnswer);
        try {
            // Pass answer AND hints used count
            await onSubmit(selectedAnswer || flagInput, visibleHints);
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full w-full glass-panel border-white/5 bg-[#0d1117] flex flex-col relative overflow-hidden font-sans shadow-2xl">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-cyber-purple/10 blur-3xl -z-10" />

            {/* Header / Protocol Info */}
            <div className="p-6 pb-2 shrink-0 z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
                    Lab Protocol
                </div>
                <h1 className="text-sm font-black italic uppercase tracking-tight text-cyber-purple truncate leading-tight">
                    {lab.title}
                </h1>

                {/* Admin/Instructor Controls */}
                {previewMode && (
                    <div className="mt-3 flex flex-col gap-2 bg-white/5 border border-white/10 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase text-white/30 tracking-wider">Answer Key</span>
                                <span className="text-xs font-bold text-white capitalize">{lab.correctAnswer || 'Hidden'}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black uppercase text-white/30 tracking-wider">Status</span>
                                <span className={`text-[10px] font-bold uppercase ${lab.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {lab.status || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5 my-1" />

                        <div className="flex items-center justify-end gap-2 flex-wrap">
                            <a
                                href={`/admin/labs/${lab._id}/analytics`}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase rounded border border-white/5 transition-colors flex items-center gap-2"
                            >
                                <BarChart3 size={12} /> Analytics
                            </a>
                            <a
                                href={`/admin/labs/${lab._id}/submissions`}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase rounded border border-white/5 transition-colors flex items-center gap-2"
                            >
                                <Users size={12} /> Submissions
                            </a>
                            <a
                                href={`/admin/labs/${lab._id}/edit`}
                                className="px-3 py-1.5 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple text-[10px] font-black uppercase rounded border border-cyber-purple/30 transition-colors flex items-center gap-2"
                            >
                                <Edit3 size={12} /> Edit Lab
                            </a>
                        </div>
                    </div>
                )}

                {/* Timer Styled as Status */}
                <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border ${timeLeft < 300 && !previewMode ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <div className={`w-2 h-2 rounded-full ${previewMode ? 'bg-yellow-500' : (timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse')}`} />
                    <div className="flex-1 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                            {previewMode ? 'Time Limit (Reference)' : 'Time Remaining'}
                        </span>
                        <span className={`font-mono font-bold text-sm ${previewMode ? 'text-yellow-500' : (timeLeft < 300 ? 'text-red-400' : 'text-green-400')}`}>
                            {previewMode ? `${Math.floor(lab.timeLimit / 60)} min` : formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Styled like Sidebar Items) */}
            <div className="px-6 py-2 shrink-0 space-y-2">
                <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {[
                        { id: 'scenario', icon: Map, label: 'Scenario' },
                        { id: 'instructions', icon: List, label: 'Task' },
                        { id: 'hints', icon: HelpCircle, label: 'Hints' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group ${activeSection === tab.id
                                ? 'bg-cyber-purple/20 text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] border border-white/10'
                                : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <tab.icon size={14} className={`transition-transform duration-300 ${activeSection === tab.id ? 'scale-110 drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : 'group-hover:scale-110'}`} />
                            <span className="font-black italic uppercase text-[10px] tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar relative z-10">
                {activeSection === 'scenario' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-cyber-cyan/10 rounded-lg text-cyber-cyan">
                                    <Map size={18} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-white/70">Briefing</h3>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed font-medium">
                                {lab.scenario}
                            </p>
                        </div>

                        {lab.description && (
                            <div className="px-4 py-3 border-l-2 border-white/10 text-xs text-white/50 italic">
                                {lab.description}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'instructions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-1 bg-gradient-to-r from-cyber-purple to-transparent rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-cyber-purple">Objectives</h3>
                        </div>

                        <div className="space-y-3">
                            {/* Terminal Lab Objectives */}
                            {lab.content?.steps && lab.content.type === 'terminal' ? (
                                lab.content.steps.map((step, idx) => {
                                    const isCompleted = completedSteps.includes(idx);
                                    return (
                                        <div key={step.id} className="flex items-start gap-4 group">
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all ${isCompleted
                                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                : 'bg-white/5 border-white/5 text-white/30 group-hover:text-cyber-cyan group-hover:border-cyber-cyan/30'
                                                }`}>
                                                {isCompleted ? '✓' : idx + 1}
                                            </div>
                                            <p className={`text-sm transition-colors pt-0.5 ${isCompleted
                                                ? 'text-green-400 line-through opacity-70'
                                                : 'text-white/70 group-hover:text-white'
                                                }`}>
                                                {step.objective}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                (lab.steps && lab.steps.length > 0 ? lab.steps : [
                                    "Analyze digital artifacts in the workspace",
                                    "Identify Indicators of Compromise (IoCs)",
                                    "Determine threat classification"
                                ]).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/30 group-hover:text-cyber-cyan group-hover:border-cyber-cyan/30 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-white/70 group-hover:text-white transition-colors pt-0.5">{step}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Answer Section */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-2">
                                <Flag size={14} /> Final Determination
                            </h3>

                            {!submitted ? (
                                /* ── Admin preview: show only the correct answer ── */
                                previewMode ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
                                            <CheckCircle size={16} className="text-green-400 shrink-0" />
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-green-500/60 mb-0.5">Correct Answer</div>
                                                <div className="text-sm font-black text-green-300 capitalize tracking-wide">{lab.correctAnswer || '—'}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-white/20 italic text-center">Submission available in learner mode only</div>
                                    </div>
                                ) : (
                                    /* ── Learner mode: selectable radio options ── */
                                    <div className="space-y-2">
                                        {getAnswerOptions(lab).map((option) => (
                                            <label
                                                key={option}
                                                className={`relative flex items-center p-4 rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer group hover:bg-white/[0.05] hover:border-white/10
                                                    ${selectedAnswer === option
                                                        ? 'bg-cyber-purple/10 border-cyber-purple/50 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                                                        : 'border-white/5 bg-white/[0.01]'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="lab-answer"
                                                    value={option}
                                                    checked={selectedAnswer === option}
                                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                                    className="mr-3 accent-cyber-purple"
                                                />
                                                <span className="capitalize font-bold text-sm tracking-wide text-white/90 group-hover:text-white">
                                                    {option}
                                                </span>
                                                {selectedAnswer === option && (
                                                    <div className="absolute right-0 top-0 h-full w-1 bg-cyber-purple shadow-[0_0_10px_#7c3aed]" />
                                                )}
                                            </label>
                                        ))}

                                        <button
                                            onClick={handleSubmit}
                                            disabled={!selectedAnswer || isSubmitting}
                                            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] mt-6 transition-all relative overflow-hidden
                                                ${isSubmitting
                                                    ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                    : selectedAnswer
                                                        ? 'bg-cyber-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group'
                                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                                }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {isSubmitting ? 'Transmitting...' : (selectedAnswer ? 'Execute Submission' : 'Select Classification')}
                                                {!isSubmitting && selectedAnswer && <ChevronRight size={14} />}
                                                {isSubmitting && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                                            </span>
                                            {!isSubmitting && selectedAnswer && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className={`p-5 rounded-2xl border backdrop-blur-sm ${result?.correct ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {result?.correct ? <CheckCircle className="text-green-400" size={20} /> : <AlertTriangle className="text-red-400" size={20} />}
                                        <span className={`font-black uppercase tracking-tight text-lg ${result?.correct ? 'text-green-400' : 'text-red-400'}`}>
                                            {result?.correct ? 'Mission Accomplished' : 'Mission Failed'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed font-mono">
                                        &gt; {result?.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'hints' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Hint Control Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500">Intelligence</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-white/30">RESTRICTED ACCESS</span>
                                {lab.hints && visibleHints < lab.hints.length && !previewMode && (
                                    <button
                                        onClick={() => setVisibleHints(prev => prev + 1)}
                                        className="px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase rounded border border-yellow-500/20 transition-colors"
                                    >
                                        Reveal Next Hint (-{lab.hints[visibleHints].cost || 0} pts)
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Terminal Lab Hints (from content.steps) */}
                        {lab.content?.steps && lab.content.type === 'terminal' && (
                            <div className="space-y-3">
                                <div className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                    <p className="text-xs text-cyan-200">
                                        💡 Use these hints to complete each objective in the terminal
                                    </p>
                                </div>
                                {lab.content.steps.map((step, idx) => (
                                    <div key={step.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                            <h4 className="text-xs font-bold text-white/70">{step.objective}</h4>
                                        </div>
                                        <p className="text-xs text-yellow-200/80 font-mono bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                                            {step.hint}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Valid Hints List */}
                        {lab.hints && Array.isArray(lab.hints) && (
                            <div className="space-y-4">
                                {lab.hints.slice(0, previewMode ? lab.hints.length : visibleHints).map((hint, i) => {
                                    const isPreview = previewMode;
                                    let hintText = typeof hint === 'string' ? hint : (hint.content || hint.text || hint.description || 'Hint details unavailable');

                                    if (isPreview) {
                                        hintText = "Hint content visible only in learner execution mode.";
                                    }

                                    const hintCost = typeof hint === 'object' ? hint.cost : 0;

                                    return (
                                        <div key={i} className={`p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors ${isPreview ? 'opacity-60' : ''}`}>
                                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                                <HelpCircle size={40} />
                                            </div>
                                            <div className="flex justify-between items-center mb-2 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-yellow-500 text-xs uppercase tracking-wider">Hint 0{i + 1}</span>
                                                    {isPreview && (
                                                        <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-[8px] font-black text-yellow-500 uppercase tracking-widest">
                                                            PREVIEW MODE
                                                        </span>
                                                    )}
                                                </div>
                                                {hintCost > 0 && (
                                                    <span className="text-[10px] font-mono text-red-400">
                                                        -{hintCost} PTS {isPreview && <span className="opacity-50">(Learner Penalty)</span>}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm relative z-10 ${isPreview ? 'text-yellow-100/40 italic' : 'text-yellow-100/70'}`}>{hintText}</p>
                                        </div>
                                    );
                                })}

                                {/* Placeholder for unrevealed hints in learner mode */}
                                {!previewMode && visibleHints < lab.hints.length && (
                                    <div className="p-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 text-xs font-mono">
                                        {lab.hints.length - visibleHints} more hint(s) available...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Node Status */}
            <div className="mt-auto pt-4 p-6 border-t border-white/5 z-10">
                <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Shield size={14} className="text-white/40" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">System Status</div>
                        <div className="text-[10px] font-mono text-green-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            ONLINE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabManual;
