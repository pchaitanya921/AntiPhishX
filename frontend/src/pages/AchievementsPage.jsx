import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Target, Zap, Award, Users, Search } from 'lucide-react';
import { Card } from '../components/ui';
import AchievementBadge from '../components/AchievementBadge';
import { achievementAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons = {
    milestone: Target,
    mastery: Trophy,
    performance: Zap,
    special: Star
};

const categoryNames = {
    milestone: 'Milestones',
    mastery: 'Topic Mastery',
    performance: 'Performance',
    special: 'Special'
};

export default function AchievementsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [loading, setLoading] = useState(true);
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({ unlocked: 0, totalXP: 0 });
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                if (isAdmin) {
                    // Admin: all UserAchievement records platform-wide
                    const res = await adminAPI.getAllUserAchievements();
                    const raw = res.data.data || [];
                    const normalized = raw.map(ua => ({
                        id: ua._id,
                        name: ua.achievement?.name || 'Unknown Achievement',
                        category: ua.achievement?.type || 'milestone',
                        points: ua.achievement?.points || 0,
                        description: ua.achievement?.description || '',
                        unlocked: true,
                        progress: 100,
                        earnedAt: ua.earnedAt,
                        userName: `${ua.user?.firstName || ''} ${ua.user?.lastName || ''}`.trim() || ua.user?.email || 'Unknown'
                    }));
                    setAchievements(normalized);
                    setStats({
                        unlocked: normalized.length,
                        totalXP: normalized.reduce((sum, a) => sum + a.points, 0)
                    });
                } else {
                    // Learner: my earned achievements
                    const res = await achievementAPI.getMyAchievements();
                    const { achievements: myAchievements, stats: apiStats } = res.data.data || {};
                    const normalized = (myAchievements || []).map(ua => ({
                        id: ua._id,
                        name: ua.achievement?.name || 'Unknown Achievement',
                        category: ua.achievement?.type || 'milestone',
                        points: ua.achievement?.points || 0,
                        description: ua.achievement?.description || '',
                        unlocked: true,
                        progress: 100,
                        earnedAt: ua.earnedAt
                    }));
                    setAchievements(normalized);
                    setStats({
                        unlocked: apiStats?.unlockedCount || normalized.length,
                        totalPoints: apiStats?.totalPoints || normalized.reduce((s, a) => s + a.points, 0),
                        completion: apiStats?.progress || 0,
                        totalAvailable: apiStats?.totalAvailable || normalized.length
                    });
                }
            } catch (err) {
                console.error('Failed to fetch achievements:', err);
                setError('Failed to load achievements');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, [isAdmin]);

    const filteredAchievements = achievements.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.userName && a.userName.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filter === 'all') return matchesSearch;
        return matchesSearch && a.category === filter;
    });

    // Group by category
    const groupedAchievements = filteredAchievements.reduce((acc, a) => {
        if (!acc[a.category]) acc[a.category] = [];
        acc[a.category].push(a);
        return acc;
    }, {});

    const categories = [...new Set(achievements.map(a => a.category))];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="space-y-4 text-center">
                    <div className="w-14 h-14 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto" />
                    <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Loading Achievements...</p>
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tight text-white mb-2">
                        <Trophy className="inline-block mr-3 text-cyber-cyan" size={40} />
                        {isAdmin ? 'Platform Achievements' : 'Achievements'}
                    </h1>
                    <p className="text-white/60">
                        {isAdmin
                            ? `${achievements.length} achievement${achievements.length !== 1 ? 's' : ''} earned across the platform.`
                            : 'Your earned achievement milestones in cybersecurity training.'}
                    </p>
                    {isAdmin && (
                        <p className="text-cyber-cyan/70 text-xs font-black uppercase tracking-widest mt-1">
                            Admin View — Platform-wide
                        </p>
                    )}
                </div>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={isAdmin ? "Search achievement or user..." : "Search achievements..."}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-11 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyber-cyan/50 transition-all w-72"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className={`grid grid-cols-1 gap-4 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-4'}`}>
                <Card className="p-4 bg-gradient-to-br from-cyber-cyan/10 to-transparent border-cyber-cyan/20">
                    <div className="text-3xl font-black text-cyber-cyan mb-1">{stats.unlocked}</div>
                    <div className="text-sm text-white/60">{isAdmin ? 'Total Earned' : 'Unlocked'}</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                    <div className="text-3xl font-black text-yellow-400 mb-1">
                        {isAdmin ? stats.totalXP : stats.totalPoints || 0}
                    </div>
                    <div className="text-sm text-white/60">Achievement XP</div>
                </Card>
                {!isAdmin && (
                    <>
                        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                            <div className="text-3xl font-black text-purple-400 mb-1">
                                {(stats.totalAvailable || 0) - (stats.unlocked || 0)}
                            </div>
                            <div className="text-sm text-white/60">Still Locked</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                            <div className="text-3xl font-black text-green-400 mb-1">{stats.completion || 0}%</div>
                            <div className="text-sm text-white/60">Completion</div>
                        </Card>
                    </>
                )}
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'all' ? 'bg-cyber-cyan text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => {
                        const Icon = categoryIcons[cat] || Award;
                        return (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${filter === cat ? 'bg-cyber-cyan text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                <Icon size={14} />
                                {categoryNames[cat] || cat}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Achievements by Category */}
            {Object.keys(groupedAchievements).length > 0 ? (
                Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
                    const CategoryIcon = categoryIcons[category] || Award;
                    return (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CategoryIcon className="text-cyber-cyan" size={24} />
                                <h2 className="text-2xl font-black italic text-white">
                                    {categoryNames[category] || category}
                                </h2>
                                <span className="text-white/40 text-sm">
                                    ({categoryAchievements.length})
                                </span>
                            </div>

                            {isAdmin ? (
                                // Admin: table-style list with user column
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {categoryAchievements.map((achievement, idx) => (
                                            <motion.div
                                                key={achievement.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                            >
                                                <Card className="p-5 flex items-center gap-6 bg-white/[0.03] border-white/10 hover:border-cyber-cyan/30 transition-all">
                                                    {/* Icon */}
                                                    <div className="w-12 h-12 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                                                        <CategoryIcon className="text-cyber-cyan" size={20} />
                                                    </div>
                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-black text-white uppercase tracking-tight">{achievement.name}</h3>
                                                            <span className="text-[10px] bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                                {achievement.points} XP
                                                            </span>
                                                        </div>
                                                        <p className="text-white/50 text-sm truncate">{achievement.description}</p>
                                                    </div>
                                                    {/* User */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <Users size={14} className="text-cyber-cyan" />
                                                        <span className="text-cyber-cyan text-sm font-bold">{achievement.userName}</span>
                                                    </div>
                                                    {/* Date */}
                                                    <div className="text-white/40 text-xs font-mono flex-shrink-0">
                                                        {achievement.earnedAt
                                                            ? format(new Date(achievement.earnedAt), 'dd MMM yyyy')
                                                            : 'N/A'}
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                // Learner: badge grid view
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {categoryAchievements.map(achievement => (
                                        <AchievementBadge
                                            key={achievement.id}
                                            achievement={achievement}
                                            unlocked={true}
                                            progress={100}
                                            size="lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <Lock size={64} className="text-white/5 mx-auto mb-6" />
                    <h2 className="text-3xl font-black italic text-white/20 uppercase tracking-widest mb-4">
                        {searchQuery
                            ? 'No achievements match your search'
                            : isAdmin
                                ? 'No Achievements Earned Yet'
                                : 'No Achievements Unlocked Yet'}
                    </h2>
                    <p className="text-white/10 max-w-md mx-auto font-medium">
                        {isAdmin
                            ? 'No learners have earned any achievements on the platform yet.'
                            : 'Complete labs, quizzes, and courses to unlock your first achievement.'}
                    </p>
                </div>
            )}
        </div>
    );
}

