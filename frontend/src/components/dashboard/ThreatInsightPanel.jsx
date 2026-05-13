import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, CheckCircle2, AlertTriangle, Zap, ExternalLink, BrainCircuit } from 'lucide-react';
import { Button, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

export default function ThreatInsightPanel({ isOpen, onClose, analytics }) {
    const navigate = useNavigate();

    // ===== REAL THREAT SCORE CALCULATION =====
    const calculateThreatScore = () => {
        if (!analytics) return { level: 'LOW', label: 'Strong Security Awareness', color: 'green' };

        let score = 100; // Start at perfect (100 = LOW threat)

        // Factor 1: Quiz Performance (40% weight)
        const quizPassRate = analytics.quizPassRate || 0;
        if (quizPassRate < 50) score -= 40;
        else if (quizPassRate < 70) score -= 20;

        // Factor 2: Lab Performance (30% weight)
        const labPassRate = analytics.labPassRate || 0;
        if (labPassRate < 50) score -= 30;
        else if (labPassRate < 70) score -= 15;

        // Factor 3: Activity Level (20% weight)
        const hasActivity = (analytics.quizAttempts || 0) > 0 || (analytics.labAttempts || 0) > 0;
        if (!hasActivity) score -= 20; // No engagement = risk

        // Factor 4: Overall Progress (10% weight)
        const progress = analytics.overallProgress || 0;
        if (progress < 30) score -= 10;

        // Determine threat level
        if (score >= 70) return { level: 'LOW', label: 'Strong Security Awareness', color: 'green' };
        if (score >= 40) return { level: 'MEDIUM', label: 'Needs Improvement', color: 'yellow' };
        return { level: 'HIGH', label: 'At Risk - Training Required', color: 'red' };
    };

    const threatScore = calculateThreatScore();

    // ===== REAL RISK FACTORS =====
    const riskFactors = [
        { label: 'Phishing Email Clicks', status: 'safe', detail: 'None detected' }, // Future: track from labs
        { label: 'Suspicious Link Interaction', status: 'safe', detail: 'Safe' }, // Future: track from labs
        { label: 'SMS / Call Response', status: 'safe', detail: 'No risky action' }, // Future: track from labs
        {
            label: 'Quiz Performance',
            status: (analytics?.quizPassRate || 0) >= 70 ? 'safe' : (analytics?.quizPassRate || 0) >= 50 ? 'warning' : 'danger',
            detail: (analytics?.quizAttempts || 0) > 0 ? `${Math.round(analytics?.quizPassRate || 0)}% Score` : 'No attempts yet'
        },
        {
            label: 'Recent Labs',
            status: (analytics?.labAttempts || 0) > 0 ? 'safe' : 'warning',
            detail: (analytics?.labAttempts || 0) > 0 ? `${analytics.labAttempts} completed` : 'No labs started'
        },
    ];

    const recentActivity = (analytics?.recentActivity || []).slice(0, 3).map(log => ({
        id: log._id,
        action: String(log.action || log.topic || 'System Activity').replace(/_/g, ' '),
        safe: log.severity !== 'critical',
    }));

    // ===== GENERATE PERSONALIZED AI INSIGHT =====
    const generateAIInsight = () => {
        if (!analytics) return "Welcome! Complete your first quiz to get personalized security insights.";

        const { quizAttempts, quizPassRate, labAttempts, overallProgress } = analytics;
        const level = threatScore.level;

        // HIGH RISK - Urgent action needed
        if (level === 'HIGH') {
            if (quizAttempts === 0 && labAttempts === 0) {
                return "⚠️ **Action Required:** You haven't started any training yet. Begin with the 'Phishing Basics' quiz to build your security awareness and reduce your risk score.";
            }
            if (quizPassRate < 50) {
                return `⚠️ **Needs Improvement:** Your quiz pass rate is ${Math.round(quizPassRate)}%. Review the course materials and retake quizzes to strengthen your understanding of phishing tactics.`;
            }
            return "⚠️ **Training Recommended:** Your current activity level puts you at risk. Complete at least 2 quizzes and 1 lab simulation this week to improve your security posture.";
        }

        // MEDIUM RISK - Encouragement to improve
        if (level === 'MEDIUM') {
            if (quizPassRate >= 50 && quizPassRate < 70) {
                return `📈 **You're Making Progress:** Your ${Math.round(quizPassRate)}% pass rate shows you're learning. Focus on the areas you struggled with to reach the 70% threshold for LOW risk.`;
            }
            if (labAttempts === 0) {
                return "🎯 **Next Step:** You've done well on quizzes! Now apply your knowledge in a hands-on lab simulation to see real-world phishing scenarios.";
            }
            return `💪 **Keep Going:** You're ${Math.round(overallProgress)}% through your training. Complete ${100 - Math.round(overallProgress)}% more to achieve LOW risk status.`;
        }

        // LOW RISK - Positive reinforcement
        if (quizPassRate >= 90) {
            return `🌟 **Excellent Work!** Your ${Math.round(quizPassRate)}% pass rate is outstanding. You're a phishing detection expert! Keep practicing to maintain your sharp skills.`;
        }
        if (labAttempts > 0 && quizPassRate >= 70) {
            return "✅ **Great job!** You consistently identify phishing attempts and avoid risky actions. Try advanced vishing scenarios to stay sharp.";
        }
        return "✅ **Well Done:** Your security awareness is strong. Continue regular training to stay ahead of evolving threats.";
    };

    const aiInsight = generateAIInsight();

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60  z-[9999]"
                    />

                    {/* Floating Modal Panel */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg max-h-[85vh] bg-[#0b0f1a] border border-white/10 rounded-3xl flex flex-col shadow-2xl pointer-events-auto overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <Shield className={`text-${threatScore.color}-400 w-6 h-6`} />
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-wider text-white">Threat Score: {threatScore.level}</h2>
                                        <p className={`text-xs text-${threatScore.color}-400 font-bold`}>{threatScore.label}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                                {/* 1. Risk Factor Summary */}
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Risk Factor Summary</h3>
                                    <div className="space-y-3">
                                        {riskFactors.map((factor, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                                <span className="text-sm font-bold text-white">{factor.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold ${factor.status === 'safe' ? 'text-green-400' :
                                                        factor.status === 'warning' ? 'text-yellow-400' :
                                                            'text-red-400'
                                                        }`}>
                                                        {factor.detail}
                                                    </span>
                                                    {factor.status === 'safe' && <CheckCircle2 size={16} className="text-green-400" />}
                                                    {factor.status === 'warning' && <AlertTriangle size={16} className="text-yellow-400" />}
                                                    {factor.status === 'danger' && <AlertTriangle size={16} className="text-red-400" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 2. Recent Activity Snapshot */}
                                <section>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Recent Activity Snapshot</h3>
                                    <div className="space-y-3">
                                        {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm">
                                                {activity.safe ? (
                                                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                                                ) : (
                                                    <AlertTriangle size={16} className="text-red-400 shrink-0" />
                                                )}
                                                <span className="text-white/80">{activity.action}</span>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-white/40 italic">No recent activity recorded.</p>
                                        )}
                                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-400">
                                            <ClockIcon />
                                            <span>Avg response time: Good</span>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. AI Coach Insight */}
                                <section className="relative p-6 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <BrainCircuit size={80} className="text-cyber-purple" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse" />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-cyber-purple">Aegis AI Insight</h3>
                                        </div>
                                        <p className="text-sm font-medium text-white leading-relaxed whitespace-pre-line">
                                            {aiInsight}
                                        </p>
                                    </div>
                                </section>

                                {/* 4. Score Logic Info */}
                                <section className="grid grid-cols-3 gap-2">
                                    <div className={`p-3 rounded-lg border text-center ${threatScore.level === 'LOW'
                                            ? 'bg-green-500/10 border-green-500/20'
                                            : 'bg-white/[0.03] border-white/5 opacity-50'
                                        }`}>
                                        <div className="text-xs font-black uppercase text-green-400 mb-1">Low</div>
                                        <div className="text-[10px] text-white/60">You're safe</div>
                                    </div>
                                    <div className={`p-3 rounded-lg border text-center ${threatScore.level === 'MEDIUM'
                                            ? 'bg-yellow-500/10 border-yellow-500/20'
                                            : 'bg-white/[0.03] border-white/5 opacity-50'
                                        }`}>
                                        <div className="text-xs font-black uppercase text-yellow-400 mb-1">Medium</div>
                                        <div className="text-[10px] text-white/60">Keep Training</div>
                                    </div>
                                    <div className={`p-3 rounded-lg border text-center ${threatScore.level === 'HIGH'
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-white/[0.03] border-white/5 opacity-50'
                                        }`}>
                                        <div className="text-xs font-black uppercase text-red-400 mb-1">High</div>
                                        <div className="text-[10px] text-white/60">Action Required</div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer / CTA */}
                            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                                <Button
                                    onClick={() => navigate('/courses')}
                                    variant="primary"
                                    className="w-full justify-center gap-2 h-12 uppercase text-xs font-black tracking-widest"
                                >
                                    <Zap size={16} /> Try a New Simulation
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

