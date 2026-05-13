import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, Download, Share2, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import confetti from 'canvas-confetti';

export default function CertificationReveal({ certificate, onClose }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (certificate) {
            // Trigger confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [certificate]);

    if (!certificate) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6  bg-black/80"
            >
                <div className="absolute inset-0 bg-cyber-grid opacity-10" />
                
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="relative w-full max-w-4xl"
                >
                    {/* Holographic Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 rounded-[4rem]  opacity-20 animate-pulse" />
                    
                    <Card className="relative overflow-hidden rounded-[3.5rem] bg-[#050505] border-white/10 p-12 shadow-[0_0_100px_rgba(16,185,129,0.15)]">
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Left: Animated Icon & Title */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Badge variant="emerald" className="px-4 py-2 text-[10px] uppercase italic tracking-[0.3em] mb-6">Certification Unlocked</Badge>
                                    <h1 className="text-6xl font-black italic uppercase text-white leading-[0.9] tracking-tighter mb-4">
                                        Level <span className="text-emerald-400">Mastery</span> Achieved
                                    </h1>
                                    <p className="text-white/40 text-lg font-medium leading-relaxed">
                                        Your behavioral resilience and tactical expertise have been verified by the AntiPhishX Intelligence Core.
                                    </p>
                                </motion.div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Credential Earned</p>
                                            <p className="text-white font-bold">{certificate.domain.replace(/_/g, ' ').toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Verification Status</p>
                                            <p className="text-white font-bold">Authenticated on Public Ledger</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Button className="flex-1 h-14 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest italic rounded-2xl gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                        <Download size={20} /> Download PDF
                                    </Button>
                                    <Button variant="outline" className="h-14 px-8 border-white/10 text-white/60 hover:text-white rounded-2xl">
                                        <Share2 size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Holographic Certificate Card */}
                            <motion.div
                                initial={{ x: 50, opacity: 0, rotateY: -20 }}
                                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="relative aspect-[3/4] perspective-1000"
                            >
                                <div className="w-full h-full rounded-[3rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-purple-500/10 border border-white/10 p-1 relative overflow-hidden group">
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3s] pointer-events-none" />
                                    
                                    <div className="w-full h-full rounded-[2.8rem] bg-[#0a0a0a] p-10 flex flex-col items-center justify-center text-center relative">
                                        {/* Background Elements */}
                                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
                                        
                                        <ShieldCheck className="text-emerald-500 w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">AntiPhishX Certified</div>
                                        
                                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none mb-8">
                                            {certificate.domain.replace(/_/g, ' ')}
                                        </h2>
                                        
                                        <div className="w-full h-px bg-white/10 mb-8" />
                                        
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest font-black mb-2">Recipient</p>
                                        <p className="text-xl font-bold text-white mb-8">CHATTING AI</p>
                                        
                                        <div className="mt-auto pt-8 flex items-center justify-between w-full">
                                            <div className="text-left">
                                                <p className="text-white/20 text-[7px] uppercase tracking-widest mb-1">Issue Date</p>
                                                <p className="text-white text-[9px] font-bold">{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/20 text-[7px] uppercase tracking-widest mb-1">Cert ID</p>
                                                <p className="text-emerald-400 text-[9px] font-mono">{certificate.certificateId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

