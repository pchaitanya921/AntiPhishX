import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Target, Zap, Award } from 'lucide-react';
import { Card } from '../components/ui';
import AchievementBadge from '../components/AchievementBadge';
import api from '../services/api';

const SAMPLE_ACHIEVEMENTS = [
    { id: 'a1', name: 'Swift Response', category: 'performance', points: 200, unlocked: true, progress: 100, description: 'Complete a lab in under 2 minutes' },
    { id: 'a2', name: 'Cyber Guardian', category: 'milestone', points: 300, unlocked: true, progress: 100, description: 'Complete 10 phishing detection labs' },
    { id: 'a3', name: 'Phishing Master', category: 'mastery', points: 500, unlocked: true, progress: 100, description: 'Achieve 100% accuracy in 5 email labs' },
    { id: 'a4', name: 'Threat Analyzer', category: 'performance', points: 250, unlocked: true, progress: 100, description: 'Correctly identify 50 threat indicators' },
    { id: 'a5', name: 'First Defender', category: 'milestone', points: 100, unlocked: true, progress: 100, description: 'Complete your first security lab' },
    { id: 'a6', name: 'Vishing Veteran', category: 'mastery', points: 400, unlocked: false, progress: 60, description: 'Complete all vishing simulation modules' },
    { id: 'a7', name: 'Speed Demon', category: 'performance', points: 350, unlocked: false, progress: 40, description: 'Finish 10 labs in under 90 seconds each' },
    { id: 'a8', name: 'Social Shield', category: 'mastery', points: 450, unlocked: false, progress: 75, description: 'Detect all social engineering tactics' },
    { id: 'a9', name: 'Smishing Slayer', category: 'mastery', points: 300, unlocked: false, progress: 50, description: 'Successfully complete all SMS phishing labs' },
    { id: 'a10', name: 'Malware Hunter', category: 'special', points: 600, unlocked: false, progress: 20, description: 'Identify 100 malware indicators across labs' },
    { id: 'a11', name: 'Perfect Score', category: 'performance', points: 500, unlocked: false, progress: 80, description: 'Get 100% in 10 consecutive quizzes' },
    { id: 'a12', name: 'Certified Expert', category: 'special', points: 1000, unlocked: false, progress: 30, description: 'Earn certificates in all course categories' },
];

export default function AchievementsPage() {
    const [loading] = useState(false);
    const [achievements] = useState(SAMPLE_ACHIEVEMENTS);
    const [stats] = useState({ total: 12, unlocked: 5, locked: 7, completionPercentage: 42 });
    const [filter, setFilter] = useState('all');

    const filteredAchievements = achievements.filter(achievement => {
        if (filter === 'unlocked') return achievement.unlocked;
        if (filter === 'locked') return !achievement.unlocked;
        return true;
    });

    // Group by category
    const groupedAchievements = filteredAchievements.reduce((acc, achievement) => {
        if (!acc[achievement.category]) {
            acc[achievement.category] = [];
        }
        acc[achievement.category].push(achievement);
        return acc;
    }, {});

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

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black italic tracking-tight text-white mb-2">
                    <Trophy className="inline-block mr-3 text-cyber-cyan" size={40} />
                    Achievements
                </h1>
                <p className="text-white/60">
                    Unlock achievements by completing labs and mastering cybersecurity skills
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-cyber-cyan/10 to-transparent border-cyber-cyan/20">
                    <div className="text-3xl font-black text-cyber-cyan mb-1">
                        {stats.unlocked}
                    </div>
                    <div className="text-sm text-white/60">Unlocked</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                    <div className="text-3xl font-black text-purple-400 mb-1">
                        {stats.locked}
                    </div>
                    <div className="text-sm text-white/60">Locked</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                    <div className="text-3xl font-black text-green-400 mb-1">
                        {stats.completionPercentage}%
                    </div>
                    <div className="text-sm text-white/60">Completion</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                    <div className="text-3xl font-black text-yellow-400 mb-1">
                        {achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}
                    </div>
                    <div className="text-sm text-white/60">Achievement Points</div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'unlocked', 'locked'].map(filterOption => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === filterOption
                            ? 'bg-cyber-cyan text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                ))}
            </div>

            {/* Achievements by Category */}
            {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
                const CategoryIcon = categoryIcons[category] || Award;
                return (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CategoryIcon className="text-cyber-cyan" size={24} />
                            <h2 className="text-2xl font-black italic text-white">
                                {categoryNames[category] || category}
                            </h2>
                            <span className="text-white/40 text-sm">
                                ({categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length})
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {categoryAchievements.map(achievement => (
                                <AchievementBadge
                                    key={achievement.id}
                                    achievement={achievement}
                                    unlocked={achievement.unlocked}
                                    progress={achievement.progress}
                                    size="lg"
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {filteredAchievements.length === 0 && (
                <div className="text-center py-20 text-white/40">
                    <Lock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No achievements found matching your filter.</p>
                </div>
            )}
        </div>
    );
}
