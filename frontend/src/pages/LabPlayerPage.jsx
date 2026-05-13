import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Trophy, Star, ArrowRight, Home, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AchievementNotification from '../components/AchievementNotification';
import LabManual from '../components/lab/LabManual';
import LabWorkspace from '../components/lab/LabWorkspace';
import ChatInterface from '../components/ai/ChatInterface';
import MissionBriefing from '../components/lab/MissionBriefing';

export default function LabPlayerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { connected } = useSocket();

    // All hooks must be declared before any conditional returns
    const [lab, setLab] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [startTime] = useState(Date.now());
    const [newAchievements, setNewAchievements] = useState([]);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
    const [showFinalResult, setShowFinalResult] = useState(false);
    const [stars, setStars] = useState(0);
    const [collapsed, setCollapsed] = useState(false); // Start expanded for better visibility
    const [showAi, setShowAi] = useState(false);
    const [showBriefing, setShowBriefing] = useState(true);

    const isAdminPrivileged = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role);
    const isAdminOrInstructor = isAdminPrivileged || user?.role === 'instructor';

    const memoizedLabContext = useMemo(() => {
        if (!lab) return null;
        return {
            labId: id,
            topic: lab.topic,
            level: lab.level,
            title: lab.title
        };
    }, [id, lab?.topic, lab?.level, lab?.title]);

    useEffect(() => {
        fetchLab();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, submitted]);

    const fetchLab = async () => {
        try {
            const response = await api.get(`/labs/${id}`);
            const labData = response.data.data || response.data;
            if (!labData) throw new Error('Lab data not found');

            setLab(labData);
            setTimeLeft(labData.timeLimit || 600);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching lab:', error);
            setLoading(false);
        }
    };

    const handleLabSubmit = async (answer, hintsUsed = 0, telemetry = {}) => {
        if (!answer) return;
        console.log('[LAB_PLAYER] Processing determination for node:', id, 'Answer:', answer);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        try {
            const response = await api.post(`/labs/${id}/submit`, {
                answer,
                timeSpent,
                hintsUsed,
                telemetry
            });
            
            if (response.data) {
                console.log('[LAB_PLAYER] Determination accepted by Intelligence Node');
                setResult(response.data);
                setSubmitted(true);
                setCollapsed(false); // Ensure manual stays open to show results
                
                if (response.data.newAchievements?.length > 0) {
                    setNewAchievements(response.data.newAchievements);
                    setCurrentAchievementIndex(0);
                }
            } else {
                throw new Error('Invalid response from Intelligence Node');
            }
        } catch (error) {
            console.error('[LAB_PLAYER] Transmission failure:', error);
            throw error;
        }
    };

    const handleRetry = () => {
        setSubmitted(false);
        setResult(null);
        setShowFinalResult(false);
    };

    const handleFinalSubmit = () => {
        // Calculate stars based on performance
        let rating = 3;
        const timeLimit = lab?.timeLimit || 600;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        if (result?.hintsUsed > 0) rating--;
        if (timeSpent > timeLimit / 2) rating--;
        if (rating < 1) rating = 1;
        
        setStars(rating);
        setShowFinalResult(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-cyber-cyan font-mono text-sm animate-pulse">BOOTING SECURE ENVIRONMENT...</div>
                </div>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-white mb-4">Lab Not Found</h2>
                    <button
                        onClick={() => navigate('/labs')}
                        className="px-6 py-3 bg-cyber-cyan text-black font-black rounded-2xl hover:bg-cyber-cyan/80 transition-all"
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex-1 flex bg-[#0d1117] min-h-0">
            <AnimatePresence>
                {showBriefing && (
                    <MissionBriefing 
                        lab={lab} 
                        onStart={() => setShowBriefing(false)} 
                    />
                )}
            </AnimatePresence>
            {/* Left Sidebar: Lab Manual */}
            <div
                className={`${(collapsed && !submitted) ? 'w-[60px]' : 'w-[360px]'} shrink-0 h-full border-r border-white/10 z-20 shadow-2xl transition-all duration-500 relative bg-[#0d1117] flex flex-col`}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => !submitted && setCollapsed(true)}
            >
                <div className={`h-full w-full overflow-hidden ${(collapsed && !submitted) ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-all duration-300 flex flex-col`}>
                        <LabManual
                            lab={lab}
                            timeLeft={timeLeft}
                            formatTime={formatTime}
                            onSubmit={handleLabSubmit}
                            onRetry={handleRetry}
                            onSubmitLab={handleFinalSubmit}
                            submitted={submitted}
                            result={result}
                            previewMode={isAdminOrInstructor}
                        />
                </div>

                {collapsed && (
                    <div className="absolute inset-0 flex flex-col items-center pt-20 gap-8 text-white/20 pointer-events-none">
                        <div className="vertical-text font-mono tracking-widest text-xs uppercase transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
                            Hover to Expand Manual
                        </div>
                    </div>
                )}
            </div>

            {/* Middle Pane: Workspace */}
            <div className="flex-1 h-full relative border-r border-white/5 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="h-12 bg-[#161b22] border-b border-white/10 flex items-center justify-between px-4 text-xs select-none">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/labs')}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} />
                            <span>Exit</span>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-cyber-cyan font-bold tracking-tighter uppercase italic">NODE_{lab.topic?.toUpperCase() || 'CORE'}_VIRTUAL</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* AI Toggle Button */}
                        <button
                            onClick={() => setShowAi(!showAi)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${showAi
                                ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                        >
                            <Sparkles size={14} className={showAi ? 'animate-pulse' : ''} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">AI Copilot</span>
                        </button>

                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="flex items-center gap-2 text-white/30">
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="font-mono">{connected ? 'LIVE_LINK: OK' : 'LIVE_LINK: OFFLINE'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
                    <LabWorkspace
                        lab={lab}
                        onSimulationComplete={() => setCollapsed(false)}
                    />
                </div>
            </div>

            {/* Right Sidebar: AI Assistant */}
            <div
                className={`shrink-0 h-full border-l border-white/10 shadow-2xl transition-all duration-300 relative bg-[#0d1117] flex flex-col overflow-hidden ${showAi ? 'w-[400px]' : 'w-0'
                    }`}
            >
                <div className="h-full w-[400px] flex flex-col">
                    <ChatInterface
                        isCompact={true}
                        labContext={memoizedLabContext}
                    />
                </div>
            </div>

            {/* Achievement Notifications */}
            {newAchievements.length > 0 && currentAchievementIndex < newAchievements.length && (
                <AchievementNotification
                    achievement={newAchievements[currentAchievementIndex]}
                    onClose={() => {
                        if (currentAchievementIndex < newAchievements.length - 1) {
                            setCurrentAchievementIndex(currentAchievementIndex + 1);
                        } else {
                            setNewAchievements([]);
                            setCurrentAchievementIndex(0);
                        }
                    }}
                />
            )}
            {/* Final Result Modal */}
            <AnimatePresence>
                {showFinalResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d1117]/95 "
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-lg bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                        >
                            {/* Header: Visual Celebration */}
                            <div className="relative h-48 bg-gradient-to-br from-cyber-cyan/20 to-transparent flex items-center justify-center">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                <motion.div
                                    initial={{ rotate: -15, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                    className="relative z-10"
                                >
                                    <div className="w-24 h-24 bg-cyber-cyan rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,255,194,0.4)]">
                                        <Trophy className="w-12 h-12 text-black" />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <div className="w-5 h-5 text-cyber-cyan flex items-center justify-center font-bold">⚡</div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <div className="p-10 text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-black text-white mb-2 uppercase tracking-tight"
                                >
                                    Mission Accomplished
                                </motion.h2>
                                <p className="text-white/40 font-mono text-sm mb-8 uppercase tracking-widest">
                                    Intelligence Node: {lab.title}
                                </p>

                                {/* Stars Calculation */}
                                <div className="flex justify-center gap-3 mb-10">
                                    {[1, 2, 3].map((s) => (
                                        <motion.div
                                            key={s}
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.3 + (s * 0.1) }}
                                        >
                                            <Star
                                                className={`w-10 h-10 ${s <= stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'text-white/10'}`}
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                        <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Score</div>
                                        <div className="text-2xl font-black text-white">+{result?.score || lab.points}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                        <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">XP Gained</div>
                                        <div className="text-2xl font-black text-cyber-cyan">+{result?.experiencePoints || 150}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/labs')}
                                        className="w-full h-[64px] bg-cyber-cyan text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,194,0.2)] hover:shadow-[0_0_50px_rgba(0,255,194,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Next Intelligence Node
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full h-[64px] bg-white/5 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Return to Command Base
                                        <Home className="w-5 h-5 opacity-40" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

