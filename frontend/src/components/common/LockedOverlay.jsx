import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LockedOverlay = ({ requiredPlan = 'Neural Advanced', message }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-xl border border-white/10"
        >
            <div className="bg-gradient-to-br from-cyber-cyan/20 to-emerald-500/20 p-4 rounded-full mb-4 border border-cyber-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Lock className="w-8 h-8 text-cyber-cyan" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-400" />
                PREMIUM CONTENT
            </h3>
            
            <p className="text-white/70 text-center px-6 mb-6 max-w-xs">
                {message || `Upgrade to ${requiredPlan} to unlock this intelligence module.`}
            </p>
            
            <Link 
                to="/pricing"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyber-cyan text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
            >
                UPGRADE NOW
                <ArrowRight className="w-4 h-4" />
            </Link>
        </motion.div>
    );
};

export default LockedOverlay;
