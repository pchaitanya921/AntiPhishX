import React, { useState, useEffect } from 'react';
import { Medal, Lock, Shield, Zap, Target, Star, Trophy, Award, Search, Filter } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const BADGE_TYPES = {
    technical: { icon: Zap, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/20' },
    social: { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    milestone: { icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    expert: { icon: Award, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
};

const SAMPLE_BADGES = [
    { id: 'b1', name: 'Swift Response', description: 'Complete a lab in under 2 minutes.', type: 'technical', points: 200, unlocked: true, date: '2026-01-15' },
    { id: 'b2', name: 'Phishing Master', description: 'Achieve 100% accuracy across 5 email labs.', type: 'expert', points: 500, unlocked: true, date: '2026-01-28' },
    { id: 'b3', name: 'Cyber Guardian', description: 'Complete 10 phishing detection labs.', type: 'milestone', points: 300, unlocked: true, date: '2026-02-09' },
    { id: 'b4', name: 'Threat Analyzer', description: 'Correctly identify 50 threat indicators.', type: 'technical', points: 250, unlocked: true, date: '2026-02-21' },
    { id: 'b5', name: 'Vanguard', description: 'Complete 5 phishing labs without a single mistake.', type: 'expert', points: 450, unlocked: false, date: null },
    { id: 'b6', name: 'Pathfinder', description: 'Complete all beginner-level training modules.', type: 'milestone', points: 350, unlocked: false, date: null },
    { id: 'b7', name: 'Social Engineer', description: 'Detect all social engineering tactics in labs.', type: 'social', points: 400, unlocked: false, date: null },
    { id: 'b8', name: 'Speed Demon', description: 'Finish 10 labs each in under 90 seconds.', type: 'technical', points: 300, unlocked: false, date: null },
    { id: 'b9', name: 'Malware Hunter', description: 'Identify 100 malware indicators across labs.', type: 'expert', points: 600, unlocked: false, date: null },
    { id: 'b10', name: 'Smishing Slayer', description: 'Successfully complete all SMS phishing labs.', type: 'social', points: 280, unlocked: false, date: null },
];

export default function BadgesPage() {
    const [loading] = useState(false);
    const [badges] = useState(SAMPLE_BADGES);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBadges = badges.filter(badge => {
        const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'unlocked' && badge.unlocked) || (filter === 'locked' && !badge.unlocked);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30">
                            <Medal className="text-cyber-cyan w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                            Skill <span className="text-cyber-cyan">Badges</span>
                        </h1>
                    </div>
                    <p className="text-white/40 text-lg font-medium max-w-xl">
                        A visual record of your operational achievements and specialized certifications.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search badges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyber-cyan/50 transition-all w-64"
                        />
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['all', 'unlocked', 'locked'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyber-cyan text-black' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredBadges.map((badge) => {
                        const typeInfo = BADGE_TYPES[badge.type] || BADGE_TYPES.technical;
                        const Icon = typeInfo.icon;

                        return (
                            <motion.div
                                key={badge.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className={`h-full group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${badge.unlocked
                                    ? 'bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 hover:border-cyber-cyan/40'
                                    : 'bg-black/40 border-white/5 grayscale pointer-events-none'
                                    }`}>
                                    {/* Unlocked glow effect */}
                                    {badge.unlocked && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}

                                    <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative group/icon`}>
                                            <div className={`absolute inset-0 rounded-full ${typeInfo.bg} animate-pulse opacity-20`} />
                                            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${typeInfo.border} transition-transform duration-1000 group-hover:rotate-180`} />

                                            {badge.unlocked ? (
                                                <Icon className={`w-10 h-10 ${typeInfo.color} drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`} />
                                            ) : (
                                                <Lock className="w-10 h-10 text-white/10" />
                                            )}
                                        </div>

                                        <h3 className={`text-xl font-black uppercase italic tracking-tighter mb-3 ${badge.unlocked ? 'text-white' : 'text-white/20'
                                            }`}>
                                            {badge.name}
                                        </h3>

                                        <p className={`text-sm leading-relaxed mb-6 flex-grow ${badge.unlocked ? 'text-white/60' : 'text-white/10'
                                            }`}>
                                            {badge.description}
                                        </p>

                                        {badge.unlocked ? (
                                            <div className="w-full pt-6 border-t border-white/5">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-cyan mb-1">Earned On</div>
                                                <div className="text-white text-sm font-bold uppercase">{badge.date}</div>
                                            </div>
                                        ) : (
                                            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">
                                                Locked Achievement
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredBadges.length === 0 && (
                <div className="py-32 text-center">
                    <Trophy className="w-16 h-16 text-white/10 mx-auto mb-6" />
                    <p className="text-white/40 font-bold uppercase tracking-[0.3em]">No badges found matching your query</p>
                </div>
            )}
        </div>
    );
}
