import React, { useState, useEffect } from 'react';
import { Medal, Lock, Shield, Zap, Target, Star, Trophy, Award, Search, Users } from 'lucide-react';
import { Card } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const BADGE_TYPES = {
    technical: { icon: Zap, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/20' },
    social: { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    milestone: { icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    expert: { icon: Award, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
};

export default function BadgesPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                setLoading(true);
                if (isAdmin) {
                    // Admin: get all UserBadge records (who earned what)
                    const res = await adminAPI.getAllUserBadges();
                    const rawBadges = res.data.data || [];
                    // Normalise to a flat display format
                    setBadges(rawBadges.map(ub => ({
                        id: ub._id,
                        name: ub.badge?.name || 'Unknown Badge',
                        description: ub.badge?.description || '',
                        type: ub.badge?.type || 'technical',
                        points: ub.badge?.points || 0,
                        unlocked: true,
                        date: ub.earnedAt ? format(new Date(ub.earnedAt), 'dd MMM yyyy') : 'N/A',
                        userName: `${ub.user?.firstName || ''} ${ub.user?.lastName || ''}`.trim() || ub.user?.email || 'Unknown'
                    })));
                } else {
                    // Learner: get my earned badges
                    const res = await achievementAPI.getMyBadges();
                    const myBadges = res.data.data || [];
                    setBadges(myBadges.map(ub => ({
                        id: ub._id,
                        name: ub.badge?.name || 'Unknown Badge',
                        description: ub.badge?.description || '',
                        type: ub.badge?.type || 'technical',
                        points: ub.badge?.points || 0,
                        unlocked: true,
                        date: ub.earnedAt ? format(new Date(ub.earnedAt), 'dd MMM yyyy') : 'N/A',
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch badges:', err);
                setError('Failed to load badges');
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, [isAdmin]);

    const filteredBadges = badges.filter(badge => {
        const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (badge.userName && badge.userName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = filter === 'all' || (filter === 'unlocked' && badge.unlocked);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="space-y-4 text-center">
                    <div className="w-14 h-14 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto" />
                    <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Loading Badges...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-32 text-red-400 font-bold">{error}</div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30">
                            <Medal className="text-cyber-cyan w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                                {isAdmin ? 'All ' : 'My '}
                                <span className="text-cyber-cyan">Badges</span>
                            </h1>
                            {isAdmin && (
                                <p className="text-cyber-cyan/70 text-xs font-black uppercase tracking-widest mt-1">
                                    Admin View — Platform-wide
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-white/40 text-lg font-medium max-w-xl">
                        {isAdmin
                            ? `${badges.length} badge${badges.length !== 1 ? 's' : ''} earned across the platform.`
                            : 'A visual record of your operational achievements and specialized certifications.'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={isAdmin ? "Search badge or user..." : "Search badges..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyber-cyan/50 transition-all w-64"
                        />
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['all', 'unlocked'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyber-cyan text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredBadges.length > 0 ? (
                isAdmin ? (
                    // Admin: list-style view for easier reading of all platform badges
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredBadges.map((badge, index) => {
                                const typeInfo = BADGE_TYPES[badge.type] || BADGE_TYPES.technical;
                                const Icon = typeInfo.icon;
                                return (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <Card className="p-5 flex items-center gap-6 bg-white/[0.03] border-white/10 hover:border-cyber-cyan/30 transition-all group">
                                            {/* Icon */}
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center relative flex-shrink-0">
                                                <div className={`absolute inset-0 rounded-full ${typeInfo.bg} opacity-20`} />
                                                <Icon className={`w-6 h-6 ${typeInfo.color} relative z-10`} />
                                            </div>

                                            {/* Badge Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-white uppercase tracking-tight text-lg italic">
                                                        {badge.name}
                                                    </h3>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${typeInfo.border} ${typeInfo.color}`}>
                                                        {badge.type}
                                                    </span>
                                                </div>
                                                <p className="text-white/50 text-sm truncate max-w-2xl">
                                                    {badge.description}
                                                </p>
                                            </div>

                                            {/* User Info */}
                                            <div className="flex items-center gap-3 px-6 border-x border-white/5 flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center">
                                                    <Users size={14} className="text-cyber-cyan" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-cyber-cyan text-sm font-black uppercase italic leading-none mb-1">
                                                        {badge.userName}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                        User Earner
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Points & Date */}
                                            <div className="flex flex-col items-end flex-shrink-0">
                                                <div className="text-white font-black text-sm mb-1">{badge.points} XP</div>
                                                <div className="text-white/40 text-[10px] font-mono">{badge.date}</div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    // Learner: original card grid view
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
                                        <Card className="h-full group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 hover:border-cyber-cyan/40">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5  opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                                                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative group/icon">
                                                    <div className={`absolute inset-0 rounded-full ${typeInfo.bg} animate-pulse opacity-20`} />
                                                    <div className={`absolute inset-0 rounded-full border-2 border-dashed ${typeInfo.border} transition-transform duration-1000 group-hover:rotate-180`} />
                                                    <Icon className={`w-10 h-10 ${typeInfo.color} drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`} />
                                                </div>

                                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3 text-white">
                                                    {badge.name}
                                                </h3>
                                                <p className="text-sm text-white/60 leading-relaxed mb-4 flex-grow">
                                                    {badge.description}
                                                </p>

                                                <div className="w-full space-y-2 pt-4 border-t border-white/5">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-cyan mb-1">Earned On</div>
                                                    <div className="text-white text-sm font-bold">{badge.date}</div>
                                                    <div className="text-[10px] text-white/40 font-bold">{badge.points} XP</div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )
            ) : (
                <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <Trophy className="w-20 h-20 text-white/5 mx-auto mb-8" />
                    <h2 className="text-3xl font-black italic text-white/20 uppercase tracking-widest mb-4">
                        {searchQuery ? 'No badges match your search' : isAdmin ? 'No Badges Earned Yet' : 'No Badges Earned Yet'}
                    </h2>
                    <p className="text-white/10 max-w-md mx-auto font-medium">
                        {isAdmin
                            ? 'No learners have earned badges yet on the platform.'
                            : 'Complete labs and training modules to earn skill badges.'}
                    </p>
                </div>
            )}
        </div>
    );
}

