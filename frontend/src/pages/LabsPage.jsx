import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, MessageSquare, QrCode, Users, Zap, Bug, Shield,
    ChevronRight, Trophy, Clock, Terminal, Search, Filter, 
    ArrowLeft, ShieldCheck, Activity, Target, BrainCircuit, Globe,
    Star, CheckCircle2, BarChart2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, Spinner } from '../components/ui';
import LockedFeature from '../components/ui/LockedFeature';

const TOPICS = [
    {
        id: 'executive_intelligence',
        name: 'Executive Intelligence',
        description: 'Strategic risk management and C-suite security awareness.',
        icon: Users,
        color: 'emerald',
        requiredTopic: 'executive_intelligence'
    },
    {
        id: 'tactical_defense',
        name: 'Tactical Defense',
        description: 'Technical analysis, header forensics, and malware triage.',
        icon: Terminal,
        color: 'lime',
        requiredTopic: 'tactical_defense'
    },
    {
        id: 'cognitive_security',
        name: 'Cognitive Security',
        description: 'Psychological manipulation, vishing, and social engineering.',
        icon: BrainCircuit,
        color: 'emerald',
        requiredTopic: 'cognitive_security'
    },
    {
        id: 'advanced_ai_adaptive',
        name: 'AI Adaptive Threats',
        description: 'Neural attacks, autonomous phishing, and deepfake defense.',
        icon: Zap,
        color: 'lime',
        requiredTopic: 'advanced_ai_adaptive'
    }
];

const LEVELS = [
    { id: 'beginner', name: 'Beginner', description: 'Basic patterns and obvious red flags', color: 'emerald', requiredPlan: 'core_node' },
    { id: 'intermediate', name: 'Intermediate', description: 'Subtle behavioral indicators', color: 'lime', requiredPlan: 'neural_advanced' },
    { id: 'advanced', name: 'Advanced', description: 'Sophisticated multi-vector attacks', color: 'emerald', requiredPlan: 'neural_advanced' },
    { id: 'expert', name: 'Expert', description: 'Real-world APT & Zero-Day scenarios', color: 'lime', requiredPlan: 'enterprise_lattice' }
];

import PermissionWrapper from '../components/auth/PermissionWrapper';
import { PLANS, LEVEL_TO_PLAN } from '../config/plans';

export default function LabsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [selectedLabProgress, setSelectedLabProgress] = useState(null);
    const [showScoreboardModal, setShowScoreboardModal] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, []);

    useEffect(() => {
        if (selectedTopic && selectedLevel) {
            fetchLabs();
        }
    }, [selectedTopic, selectedLevel]);

    const fetchProgress = async () => {
        try {
            const response = await api.get('/progress');
            setProgress(response.data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const fetchLabs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/labs?topic=${selectedTopic}&level=${selectedLevel}`);
            setLabs(response.data.data);
        } catch (error) {
            console.error('Error fetching labs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Badge variant="primary" className="px-4 py-2 text-[10px]">
                            Simulation Hub v4.2
                        </Badge>
                        <div className="flex items-center gap-2 text-emerald-400/40 text-[9px] font-black uppercase tracking-[0.3em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                            Sandbox: Active
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                        Simulation <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Labs</span>
                    </h1>
                    <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">
                        ENVIRONMENT: SAFE · PAYLOAD STATUS: TOKENIZED · SECTOR_{user?._id?.slice(-4) || 'hub'}
                    </p>
                </div>

                {progress?.overall && (
                    <div className="flex flex-wrap gap-4">
                        <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Completion</span>
                            <span className="text-lg font-black italic text-emerald-400">{progress.overall.completionRate}%</span>
                        </div>
                        <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Points</span>
                            <span className="text-lg font-black italic text-lime-400">{progress.overall.totalScore}</span>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!selectedTopic ? (
                    <motion.div
                        key="topics"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-4">
                            <Terminal size={18} className="text-emerald-400" />
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tight">Select Training Sector</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {TOPICS.map((topic) => {
                                const Icon = topic.icon;
                                return (
                                    <PermissionWrapper 
                                        key={topic.id}
                                        requiredTopic={topic.requiredTopic}
                                        fallbackMessage={`Requires specialized node clearance`}
                                    >
                                        <Card
                                            hover
                                            onClick={() => setSelectedTopic(topic.id)}
                                            className="p-10 bg-[#111111] border-white/5 rounded-[2.5rem] group"
                                        >
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-700">
                                                    <Icon size={32} />
                                                </div>
                                                <Badge variant="primary" className="text-[8px]">Sector Active</Badge>
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">
                                                {topic.name}
                                            </h3>
                                            <p className="text-white/30 text-xs font-medium mb-10 leading-relaxed">
                                                {topic.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 italic">
                                                    40 Analysis Nodes
                                                </span>
                                                <ChevronRight className="text-emerald-500 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </Card>
                                    </PermissionWrapper>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : !selectedLevel ? (
                    <motion.div
                        key="levels"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-10"
                    >
                        <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="gap-3">
                            <ArrowLeft size={16} /> Back to Sectors
                        </Button>

                        <div className="flex items-center gap-4">
                            <Target size={18} className="text-lime-400" />
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tight">Difficulty Matrix Calibration</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {LEVELS.map((level) => (
                                <PermissionWrapper
                                    key={level.id}
                                    requiredPlan={level.requiredPlan}
                                    fallbackMessage={`Requires ${level.requiredPlan.replace('_', ' ').toUpperCase()} calibration`}
                                >
                                    <Card
                                        hover
                                        onClick={() => setSelectedLevel(level.id)}
                                        className="p-10 bg-[#111111] border-white/5 rounded-[3rem] group"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight group-hover:text-lime-400 transition-colors">
                                                {level.name}
                                            </h3>
                                            <Badge variant={level.color === 'emerald' ? 'primary' : 'lime'} className="text-[8px]">
                                                Calibration Mode
                                            </Badge>
                                        </div>
                                        <p className="text-white/30 text-sm font-medium mb-10 leading-relaxed">
                                            {level.description}
                                        </p>
                                        <div className="flex items-center justify-end">
                                            <ChevronRight size={24} className="text-lime-400 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </Card>
                                </PermissionWrapper>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="labs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-10"
                    >
                        <Button variant="ghost" onClick={() => setSelectedLevel(null)} className="gap-3">
                            <ArrowLeft size={16} /> Back to Matrix
                        </Button>

                        <div className="flex items-center gap-4">
                            <ShieldCheck size={18} className="text-emerald-400" />
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tight">
                                {TOPICS.find(t => t.id === selectedTopic)?.name} · {LEVELS.find(l => l.id === selectedLevel)?.name} Nodes
                            </h2>
                        </div>

                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center gap-8">
                                <Spinner className="w-20 h-20" />
                                <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Initializing Lab Environment...</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-8">
                                {labs.map((lab, index) => {
                                    const labProgress = progress?.labs?.find(p => p.lab === lab._id);
                                    const isCompleted = labProgress?.completed;

                                    return (
                                        <div className="relative group">
                                            <Card
                                                key={lab._id}
                                                hover
                                                onClick={() => !lab.isLocked && navigate(`/labs/${lab._id}`)}
                                                className={`p-10 bg-[#111111] border-white/5 rounded-[3rem] group transition-all duration-500 ${isCompleted ? 'border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : ''} ${lab.isLocked ? 'cursor-not-allowed grayscale-[0.5]' : ''}`}
                                            >
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isCompleted ? 'text-emerald-400' : 'text-white/20'}`}>
                                                            Node_{index + 1}
                                                        </span>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
                                                        {isCompleted && (
                                                            <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                                <CheckCircle2 size={10} className="text-emerald-400" />
                                                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">
                                                        {lab.title}
                                                    </h3>
                                                    {isCompleted && labProgress.stars > 0 && (
                                                        <div className="flex gap-1 pt-1">
                                                            {[1, 2, 3].map(s => (
                                                                <Star key={s} size={12} className={`${s <= labProgress.stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-white/10'}`} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5'}`}>
                                                        <Trophy className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-lime-400'}`} />
                                                        <span className="text-xs font-black text-white">
                                                            {isCompleted ? `${labProgress.score}/${lab.points}` : `${lab.points}`} PTS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-white/30 text-sm font-medium mb-12 line-clamp-2">
                                                {lab.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                                <div className="flex items-center gap-8">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-white/20" />
                                                        <span className="text-[10px] font-black text-white uppercase">{Math.floor(lab.timeLimit / 60)}M</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={16} className="text-white/20" />
                                                        <span className="text-[10px] font-black text-white uppercase">V_{lab.difficulty}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {isCompleted && (
                                                        <Button 
                                                            variant="ghost" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setSelectedLabProgress({ ...labProgress, title: lab.title });
                                                                setShowScoreboardModal(true);
                                                            }}
                                                            className="h-14 px-5 border border-white/5 hover:bg-white/5 text-white/40 hover:text-white group/score"
                                                            title="View Mission Performance"
                                                        >
                                                            <BarChart2 size={20} className="group-hover/score:scale-110 transition-transform" />
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant={isCompleted ? "outline" : "primary"} 
                                                        className={`h-14 px-8 ${isCompleted ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' : ''}`}
                                                    >
                                                        {isCompleted ? 'Replay' : 'Execute'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                        {lab.isLocked && (
                                            <LockedFeature 
                                                overlayOnly 
                                                requiredPlan={LEVEL_TO_PLAN[lab.level]} 
                                                message={`Sector ${lab.level?.toUpperCase()} requires advanced node clearance.`}
                                            />
                                        )}
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Mission Scoreboard Modal */}
            <AnimatePresence>
                {showScoreboardModal && selectedLabProgress && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d1117]/95"
                        onClick={() => setShowScoreboardModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck size={14} /> Mission Verified
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none">
                                            Performance Intel
                                        </h3>
                                    </div>
                                    <button 
                                        onClick={() => setShowScoreboardModal(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft size={20} className="rotate-90" />
                                    </button>
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-8">
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Intelligence Node</p>
                                    <p className="text-lg font-black text-white italic uppercase tracking-tight">{selectedLabProgress.title}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                                        <div className="flex justify-center gap-1 mb-2">
                                            {[1, 2, 3].map(s => (
                                                <Star key={s} size={14} className={`${s <= selectedLabProgress.stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-white/10'}`} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Efficiency</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                                        <div className="text-xl font-black text-emerald-400 mb-1 tracking-tight">{selectedLabProgress.score}</div>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Score Harvested</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Time Spent</span>
                                        <span className="text-xs font-black text-white italic uppercase">{Math.floor(selectedLabProgress.timeSpent / 60)}M {selectedLabProgress.timeSpent % 60}S</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Attempts</span>
                                        <span className="text-xs font-black text-white italic uppercase">{selectedLabProgress.attempts} Operations</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-3">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Last Determination</span>
                                        <span className="text-xs font-black text-white italic uppercase">{new Date(selectedLabProgress.lastAttemptAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowScoreboardModal(false)}
                                    className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                                >
                                    Dismiss Intel
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

