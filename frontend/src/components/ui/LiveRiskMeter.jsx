import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveRiskMeter = ({ score, isScanning }) => {
    // Determine color and status based on score
    let colorClass = 'bg-green-500';
    let textClass = 'text-green-400';
    let Icon = ShieldCheck;
    let label = 'Safe';

    if (score >= 70) {
        colorClass = 'bg-red-500';
        textClass = 'text-red-400';
        Icon = ShieldAlert;
        label = 'Phishing';
    } else if (score >= 30) {
        colorClass = 'bg-yellow-500';
        textClass = 'text-yellow-400';
        Icon = AlertTriangle;
        label = 'Suspicious';
    }

    return (
        <div className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-700 ">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <Icon className={textClass} size={20} />
                    <span className="text-slate-300 font-medium text-sm uppercase tracking-wider">
                        Live Threat Risk
                    </span>
                    {isScanning && (
                        <span className="text-xs text-indigo-400 animate-pulse ml-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block"></span>
                            Scanning
                        </span>
                    )}
                </div>
                <div className={`font-bold text-lg ${textClass}`}>
                    {score}% <span className="text-xs font-normal text-slate-500 ml-1">({label})</span>
                </div>
            </div>

            {/* Meter Bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <motion.div
                    className={`h-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Ticks */}
            <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1 px-1">
                <span>0</span>
                <span>30</span>
                <span>70</span>
                <span>100</span>
            </div>
        </div>
    );
};

export default LiveRiskMeter;

