import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, Award, TrendingUp, Medal } from 'lucide-react';
import { Card } from '../components/ui';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TOPICS = [
    { id: 'phishing', name: 'Phishing' },
    { id: 'vishing', name: 'Vishing' },
    { id: 'smishing', name: 'Smishing' },
    { id: 'qr_code', name: 'QR Code' },
    { id: 'social_engineering', name: 'Social Engineering' },
    { id: 'advanced_threats', name: 'Advanced Threats' },
    { id: 'malware_detection', name: 'Malware Detection' }
];

const SAMPLE_LEADERBOARD = [
    { user: 'u1', rank: 1, username: 'Priya Sharma', totalPoints: 9840, labsCompleted: 47, achievementsUnlocked: 12, achievementPoints: 2400, accuracy: 97.2, averageTime: 78, averageScore: 97.2, topicPoints: 1840, topicCompleted: 12, topicAccuracy: 97.2 },
    { user: 'u2', rank: 2, username: 'Arjun Mehta', totalPoints: 8920, labsCompleted: 43, achievementsUnlocked: 10, achievementPoints: 2100, accuracy: 95.1, averageTime: 84, averageScore: 95.1, topicPoints: 1720, topicCompleted: 11, topicAccuracy: 95.1 },
    { user: 'u3', rank: 3, username: 'Deepika Rao', totalPoints: 8350, labsCompleted: 39, achievementsUnlocked: 9, achievementPoints: 1900, accuracy: 93.8, averageTime: 91, averageScore: 93.8, topicPoints: 1600, topicCompleted: 10, topicAccuracy: 93.8 },
    { user: 'u4', rank: 4, username: 'Vikram Bose', totalPoints: 7740, labsCompleted: 36, achievementsUnlocked: 8, achievementPoints: 1700, accuracy: 91.4, averageTime: 99, averageScore: 91.4, topicPoints: 1480, topicCompleted: 9, topicAccuracy: 91.4 },
    { user: 'u5', rank: 5, username: 'Meera Iyer', totalPoints: 7120, labsCompleted: 33, achievementsUnlocked: 7, achievementPoints: 1500, accuracy: 89.7, averageTime: 105, averageScore: 89.7, topicPoints: 1340, topicCompleted: 8, topicAccuracy: 89.7 },
    { user: 'u6', rank: 6, username: 'Sanjay Gupta', totalPoints: 6580, labsCompleted: 30, achievementsUnlocked: 6, achievementPoints: 1300, accuracy: 87.3, averageTime: 112, averageScore: 87.3, topicPoints: 1220, topicCompleted: 8, topicAccuracy: 87.3 },
    { user: 'u7', rank: 7, username: 'Pooja Nair', totalPoints: 5940, labsCompleted: 27, achievementsUnlocked: 5, achievementPoints: 1100, accuracy: 85.0, averageTime: 118, averageScore: 85.0, topicPoints: 1100, topicCompleted: 7, topicAccuracy: 85.0 },
    { user: 'u8', rank: 8, username: 'Raj Kumar', totalPoints: 5310, labsCompleted: 24, achievementsUnlocked: 4, achievementPoints: 900, accuracy: 82.6, averageTime: 127, averageScore: 82.6, topicPoints: 980, topicCompleted: 6, topicAccuracy: 82.6 },
    { user: 'u9', rank: 9, username: 'P.Lakshmi Sai', totalPoints: 4780, labsCompleted: 21, achievementsUnlocked: 4, achievementPoints: 800, accuracy: 80.1, averageTime: 134, averageScore: 80.1, topicPoints: 860, topicCompleted: 5, topicAccuracy: 80.1 },
    { user: 'u10', rank: 10, username: 'Venkata Jeshwanth', totalPoints: 4210, labsCompleted: 18, achievementsUnlocked: 3, achievementPoints: 650, accuracy: 78.5, averageTime: 142, averageScore: 78.5, topicPoints: 740, topicCompleted: 5, topicAccuracy: 78.5 },
];

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overall');
    const [selectedTopic, setSelectedTopic] = useState('phishing');
    const [leaderboard] = useState(SAMPLE_LEADERBOARD);
    const [userRank] = useState(9); // P.Lakshmi Sai at rank 9
    const [loading] = useState(false);

    const getRankBadge = (rank) => {
        if (rank === 1) return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', text: '1st' };
        if (rank === 2) return { icon: '🥈', color: 'from-gray-300 to-gray-500', text: '2nd' };
        if (rank === 3) return { icon: '🥉', color: 'from-orange-400 to-orange-600', text: '3rd' };
        if (rank <= 10) return { icon: null, color: 'from-cyber-cyan/20 to-cyber-cyan/40', text: `${rank}th` };
        return { icon: null, color: 'from-white/5 to-white/10', text: `${rank}th` };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const tabs = [
        { id: 'overall', name: 'Overall', icon: Trophy },
        { id: 'achievements', name: 'Achievements', icon: Award },
        { id: 'topic', name: 'Topics', icon: Target },
        { id: 'speed', name: 'Speed', icon: Zap },
        { id: 'accuracy', name: 'Accuracy', icon: TrendingUp }
    ];

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
                    Leaderboards
                </h1>
                <p className="text-white/60">
                    Compete with other cybersecurity enthusiasts and climb the ranks
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-cyber-cyan text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.name}
                        </button>
                    );
                })}
            </div>

            {/* Topic Selector (only for topic tab) */}
            {activeTab === 'topic' && (
                <div className="flex gap-2 flex-wrap">
                    {TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTopic === topic.id
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>
            )}

            {/* User Rank Card */}
            {userRank && (
                <Card className="p-4 bg-gradient-to-r from-cyber-cyan/10 to-purple-500/10 border-cyber-cyan/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-black text-cyber-cyan">
                                #{userRank}
                            </div>
                            <div>
                                <div className="text-white font-bold">Your Rank</div>
                                <div className="text-sm text-white/60">
                                    {activeTab === 'overall' && 'Overall Leaderboard'}
                                    {activeTab === 'achievements' && 'Achievement Points'}
                                    {activeTab === 'topic' && `${TOPICS.find(t => t.id === selectedTopic)?.name} Topic`}
                                    {activeTab === 'speed' && 'Speed Leaderboard'}
                                    {activeTab === 'accuracy' && 'Accuracy Leaderboard'}
                                </div>
                            </div>
                        </div>
                        <Medal className="text-cyber-cyan" size={32} />
                    </div>
                </Card>
            )}

            {/* Leaderboard Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-white/80">Rank</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-white/80">User</th>
                                {activeTab === 'overall' && (
                                    <>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Total Points</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Labs</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Achievements</th>
                                    </>
                                )}
                                {activeTab === 'achievements' && (
                                    <>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Achievement Points</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Unlocked</th>
                                    </>
                                )}
                                {activeTab === 'topic' && (
                                    <>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Points</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Completed</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Accuracy</th>
                                    </>
                                )}
                                {activeTab === 'speed' && (
                                    <>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Avg Time</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Labs</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Accuracy</th>
                                    </>
                                )}
                                {activeTab === 'accuracy' && (
                                    <>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Accuracy</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Labs</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-white/80">Points</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => {
                                const rankBadge = getRankBadge(entry.rank);
                                const isCurrentUser = entry.user === user._id;

                                return (
                                    <tr
                                        key={entry.user}
                                        className={`border-b border-white/5 transition-colors ${isCurrentUser
                                            ? 'bg-cyber-cyan/10 hover:bg-cyber-cyan/15'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${rankBadge.color}`}>
                                                {rankBadge.icon && <span className="text-lg">{rankBadge.icon}</span>}
                                                <span className="font-bold text-white">{entry.rank}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {entry.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">
                                                        {entry.username}
                                                        {isCurrentUser && (
                                                            <span className="ml-2 text-xs text-cyber-cyan">(You)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Overall Tab */}
                                        {activeTab === 'overall' && (
                                            <>
                                                <td className="px-6 py-4 text-right font-bold text-cyber-cyan">
                                                    {entry.totalPoints?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.labsCompleted}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.achievementsUnlocked}
                                                </td>
                                            </>
                                        )}

                                        {/* Achievements Tab */}
                                        {activeTab === 'achievements' && (
                                            <>
                                                <td className="px-6 py-4 text-right font-bold text-purple-400">
                                                    {entry.achievementPoints?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.achievementsUnlocked}
                                                </td>
                                            </>
                                        )}

                                        {/* Topic Tab */}
                                        {activeTab === 'topic' && (
                                            <>
                                                <td className="px-6 py-4 text-right font-bold text-cyber-cyan">
                                                    {entry.topicPoints?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.topicCompleted}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.topicAccuracy?.toFixed(1)}%
                                                </td>
                                            </>
                                        )}

                                        {/* Speed Tab */}
                                        {activeTab === 'speed' && (
                                            <>
                                                <td className="px-6 py-4 text-right font-bold text-green-400">
                                                    {formatTime(entry.averageTime)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.labsCompleted}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.averageScore?.toFixed(1)}%
                                                </td>
                                            </>
                                        )}

                                        {/* Accuracy Tab */}
                                        {activeTab === 'accuracy' && (
                                            <>
                                                <td className="px-6 py-4 text-right font-bold text-yellow-400">
                                                    {entry.accuracy?.toFixed(1)}%
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.labsCompleted}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white/80">
                                                    {entry.totalPoints?.toLocaleString()}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-20 text-white/40">
                        <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No data available for this leaderboard yet.</p>
                        <p className="text-sm mt-2">Complete some labs to get started!</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
