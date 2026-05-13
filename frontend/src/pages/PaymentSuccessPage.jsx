// Payment Success Page - Hardened
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Download, CreditCard, Sparkles, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge } from '../components/ui';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [counter, setCounter] = useState(5);
    const [isActivating, setIsActivating] = useState(true);
    const invoiceNumber = location.state?.invoiceNumber || `APX-INV-${Math.floor(Math.random() * 100000)}`;

    useEffect(() => {
        const syncPermissions = async () => {
            await refreshUser();
            setIsActivating(false);
            toast.success("Permissions Synchronized Successfully");
        };
        syncPermissions();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [counter, navigate]);

    return (
        <div className="relative min-h-screen bg-[#020203] text-white flex items-center justify-center overflow-hidden p-6">
            {/* Background Cinematic Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyber-purple/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative z-10 w-full max-w-4xl"
            >
                <Card className="bg-[#0A0A0B]/80 backdrop-blur-3xl border-white/5 rounded-[4rem] p-12 lg:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <Zap size={300} />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-10">
                        {/* Success Icon Animation */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                        >
                            <ShieldCheck size={64} className="text-black" />
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none"
                            >
                                {isActivating ? 'SYNCHRONIZING...' : 'PLAN ACTIVATED'}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-emerald-400/60 text-lg font-black uppercase tracking-widest italic"
                            >
                                {isActivating 
                                    ? 'Validating cryptographic payment signatures...' 
                                    : 'Access permissions synchronized successfully.'}
                            </motion.p>
                        </div>

                        {/* Transaction Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="w-full max-w-md bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Invoice Hash</span>
                                <span className="text-xs font-mono text-emerald-400">{invoiceNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Node Status</span>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 text-[8px] font-black uppercase">Active</Badge>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black uppercase text-white/20">Payment Secured</div>
                                        <div className="text-xs font-bold text-white/60 tracking-tight">Verified via Razorpay Intelligence</div>
                                    </div>
                                </div>
                                <Sparkles className="text-amber-400 opacity-40 animate-pulse" size={16} />
                            </div>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Button 
                                onClick={() => navigate('/dashboard')}
                                disabled={isActivating}
                                className="h-16 px-12 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-full font-black uppercase tracking-widest text-[10px] gap-3 transition-all duration-500 group disabled:opacity-50"
                            >
                                {isActivating ? 'Wait...' : 'Launch Dashboard'}
                                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </Button>
                            <Button 
                                variant="ghost"
                                className="h-16 px-12 border border-white/5 hover:bg-white/5 rounded-full font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white gap-3 transition-all"
                            >
                                <Download size={16} />
                                Download Invoice
                            </Button>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10"
                        >
                            Orchestrating system access...
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
