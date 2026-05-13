import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, X, Maximize2, Minimize2, Send, Zap, Target, BookOpen, BarChart3, Fingerprint, Award, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';

/**
 * AICopilotPanel Component
 * Slide-out AI command center for advanced cybersecurity operations.
 */
const AICopilotPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const quickInsights = [
        { icon: Target, label: "Simulations", path: "/labs", color: "text-emerald-400" },
        { icon: BookOpen, label: "Roadmap", path: "/academy/roadmap", color: "text-cyan-400" },
        { icon: BarChart3, label: "Intelligence", path: "/admin/intelligence", color: "text-purple-400" },
        { icon: Fingerprint, label: "Behavior", path: "/profile", color: "text-amber-400" }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0c0c0e] border-l border-white/10 z-[1001] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 bg-white/[0.02] border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative group">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <Cpu size={24} className="text-emerald-400 relative z-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Neural Copilot <span className="text-emerald-500">v4.0</span></h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Synaptic Link Established</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all group"
                                >
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            {/* Quick Insights Bar */}
                            <div className="grid grid-cols-4 gap-3 mt-8 relative z-10">
                                {quickInsights.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            navigate(item.path);
                                            onClose();
                                        }}
                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group"
                                    >
                                        <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Chat Interface */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <ChatInterface initialMode="cyber" isCompact={false} />
                        </div>

                        {/* Footer / Status */}
                        <div className="p-4 bg-black border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Zap size={10} className="text-emerald-500" /> Latency: 12ms</span>
                                <span className="flex items-center gap-1.5"><AlertCircle size={10} className="text-cyan-500" /> Integrity: 99.9%</span>
                            </div>
                            <span>AntiPhishX OS v2026.05.12</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AICopilotPanel;
