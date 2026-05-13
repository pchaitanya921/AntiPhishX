import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, ArrowRight, Zap } from 'lucide-react';
import { Button } from './index';
import { useNavigate } from 'react-router-dom';

const LockedFeature = ({ 
    children, 
    requiredPlan = 'neural_advanced', 
    message = 'Upgrade your node to unlock this intelligence module.',
    overlayOnly = false 
}) => {
    const navigate = useNavigate();
    const planName = requiredPlan.replace('_', ' ').toUpperCase();

    const getPlanTheme = (plan) => {
        switch (plan) {
            case 'enterprise_lattice':
                return {
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/20',
                    border: 'border-purple-500/30',
                    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
                    btn: 'bg-purple-500 hover:bg-purple-400'
                };
            case 'neural_advanced':
                return {
                    color: 'text-cyber-cyan',
                    bg: 'bg-cyan-500/20',
                    border: 'border-cyan-500/30',
                    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
                    btn: 'bg-cyan-500 hover:bg-cyan-400'
                };
            default: // core_node
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-500/30',
                    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
                    btn: 'bg-emerald-500 hover:bg-emerald-400'
                };
        }
    };

    const theme = getPlanTheme(requiredPlan);

    if (overlayOnly) {
        return (
            <div className="relative group h-full">
                <div className="pointer-events-none opacity-40 blur-[2px] grayscale h-full">
                    {children}
                </div>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black/80 rounded-[inherit] border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                    <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.border} flex items-center justify-center mb-4 ${theme.glow}`}>
                        <Lock className={theme.color} size={20} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.color} mb-2`}>Tier Restricted</p>
                    <h4 className="text-sm font-black text-white uppercase italic mb-4">{planName} REQUIRED</h4>
                    <Button 
                        size="sm" 
                        variant="primary" 
                        className={`h-8 px-4 text-[9px] font-black uppercase tracking-widest ${theme.btn} text-black border-none`}
                        onClick={() => navigate('/pricing')}
                    >
                        Initialize Upgrade
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-12 rounded-[3rem] bg-[#0c0c0e] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[300px]"
        >
            <div className="relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 mx-auto relative">
                    <div className={`absolute inset-0 ${theme.bg} rounded-full opacity-50`} />
                    <ShieldAlert className={`${theme.color} relative z-10`} size={32} />
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.bg} ${theme.border} mb-6`}>
                    <Zap size={12} className={`${theme.color} animate-pulse`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.color}`}>Intelligence Gate</span>
                </div>

                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4 leading-none">
                    Sector <span className={theme.color}>Restricted</span>
                </h3>
                
                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-md mx-auto mb-10 italic">
                    "{message}"
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={() => navigate('/pricing')}
                        className={`h-14 px-8 ${theme.btn} text-black font-black uppercase tracking-widest text-[10px] rounded-2xl ${theme.glow} border-none`}
                    >
                        Upgrade to {planName} <ArrowRight className="ml-2" size={14} />
                    </Button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors p-4"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default LockedFeature;

