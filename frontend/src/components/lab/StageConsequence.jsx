import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { Button } from '../ui';

const StageConsequence = ({ consequence, onContinue }) => {
    if (!consequence) return null;

    let bgClass = 'bg-slate-900';
    let borderClass = 'border-slate-700';
    let textClass = 'text-slate-200';
    let Icon = Info;

    switch (consequence.severity) {
        case 'low':
            bgClass = 'bg-yellow-900/40';
            borderClass = 'border-yellow-700';
            textClass = 'text-yellow-400';
            Icon = AlertTriangle;
            break;
        case 'medium':
            bgClass = 'bg-orange-900/40';
            borderClass = 'border-orange-700';
            textClass = 'text-orange-400';
            Icon = AlertOctagon;
            break;
        case 'high':
        case 'critical':
            bgClass = 'bg-red-900/40';
            borderClass = 'border-red-700';
            textClass = 'text-red-400';
            Icon = ShieldAlert;
            break;
        default:
            break;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full p-6 rounded-2xl border ${bgClass} ${borderClass} flex flex-col items-center text-center`}
        >
            <div className={`p-4 rounded-full bg-black/30 mb-4 ${textClass}`}>
                <Icon size={48} className="animate-pulse" />
            </div>
            
            <h3 className={`text-2xl font-black mb-2 ${textClass}`}>
                {consequence.severity === 'critical' ? 'CRITICAL BREACH' : 'SECURITY INCIDENT'}
            </h3>
            
            <p className="text-slate-300 text-lg mb-6">
                {consequence.message}
            </p>

            {consequence.lossAmount && (
                <div className="bg-black/50 border border-red-500/30 text-red-400 py-2 px-6 rounded-lg font-mono font-bold mb-6 flex items-center gap-2">
                    <span>Simulated Data Loss:</span>
                    <span className="text-xl">${consequence.lossAmount.toLocaleString()}</span>
                </div>
            )}

            <Button onClick={onContinue} variant="primary" className="w-full sm:w-auto">
                Acknowledge & Continue
            </Button>
        </motion.div>
    );
};

export default StageConsequence;

