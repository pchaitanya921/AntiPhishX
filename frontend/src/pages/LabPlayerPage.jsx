import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import api from '../services/api';
import AchievementNotification from '../components/AchievementNotification';
import LabManual from '../components/lab/LabManual';
import LabWorkspace from '../components/lab/LabWorkspace';
import ChatInterface from '../components/ai/ChatInterface';
import { useMemo } from 'react';

export default function LabPlayerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [lab, setLab] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [startTime] = useState(Date.now());
    const [newAchievements, setNewAchievements] = useState([]);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(true);
    const [showAi, setShowAi] = useState(false);

    // Hooks must be at the top level, not inside JSX
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

    const handleLabSubmit = async (answer, hintsUsed = 0) => {
        if (!answer) return;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        try {
            const response = await api.post(`/labs/${id}/submit`, {
                answer,
                timeSpent,
                hintsUsed
            });
            setResult(response.data);
            setSubmitted(true);
            if (response.data.newAchievements?.length > 0) {
                setNewAchievements(response.data.newAchievements);
                setCurrentAchievementIndex(0);
            }
        } catch (error) {
            console.error('Error submitting lab:', error);
            throw error;
        }
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
            {/* Left Sidebar: Lab Manual */}
            <div
                className={`${collapsed ? 'w-[60px]' : 'w-[320px]'} shrink-0 h-full border-r border-white/10 z-20 shadow-2xl transition-all duration-300 relative bg-[#0d1117] flex flex-col`}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >
                <div className={`h-full w-full overflow-hidden ${collapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-all duration-200 delay-75 flex flex-col`}>
                    <LabManual
                        lab={lab}
                        timeLeft={timeLeft}
                        formatTime={formatTime}
                        onSubmit={handleLabSubmit}
                        submitted={submitted}
                        result={result}
                        previewMode={user?.role === 'admin' || user?.role === 'instructor'}
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
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="font-mono">LIVE_LINK: OK</span>
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
        </div>
    );
}


