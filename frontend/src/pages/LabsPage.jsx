import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MessageSquare,
    QrCode,
    Users,
    Zap,
    Bug,
    Shield,
    ChevronRight,
    Trophy,
    Clock
} from 'lucide-react';
import api from '../services/api';

const COLOR_VARIANTS = {
    'cyber-cyan': {
        border: 'hover:border-cyber-cyan/40',
        bg: 'bg-cyber-cyan/10',
        text: 'text-cyber-cyan',
        icon: 'text-cyber-cyan'
    },
    'green-500': {
        border: 'hover:border-green-500/40',
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        icon: 'text-green-500'
    },
    'blue-500': {
        border: 'hover:border-blue-500/40',
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        icon: 'text-blue-500'
    },
    'purple-500': {
        border: 'hover:border-purple-500/40',
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
        icon: 'text-purple-500'
    },
    'pink-500': {
        border: 'hover:border-pink-500/40',
        bg: 'bg-pink-500/10',
        text: 'text-pink-500',
        icon: 'text-pink-500'
    },
    'red-500': {
        border: 'hover:border-red-500/40',
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        icon: 'text-red-500'
    },
    'orange-500': {
        border: 'hover:border-orange-500/40',
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
        icon: 'text-orange-500'
    },
    'yellow-500': {
        border: 'hover:border-yellow-500/40',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        icon: 'text-yellow-500'
    }
};

const TOPICS = [
    {
        id: 'phishing',
        name: 'Email Phishing',
        description: 'Identify malicious emails and phishing attempts',
        icon: Mail,
        color: 'cyber-cyan',
        gradient: 'from-cyber-cyan/20 to-blue-500/20'
    },
    {
        id: 'vishing',
        name: 'Voice Phishing (Vishing)',
        description: 'Recognize phone scams and voice-based attacks',
        icon: Phone,
        color: 'green-500',
        gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
        id: 'smishing',
        name: 'SMS Phishing (Smishing)',
        description: 'Detect malicious text messages and SMS scams',
        icon: MessageSquare,
        color: 'blue-500',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        id: 'qr_code',
        name: 'QR Code Attacks',
        description: 'Analyze suspicious QR codes and prevent quishing',
        icon: QrCode, // Ensure this import is valid
        color: 'purple-500',
        gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
        id: 'social_engineering',
        name: 'Social Engineering',
        description: 'Recognize manipulation tactics and psychological attacks',
        icon: Users,
        color: 'pink-500',
        gradient: 'from-pink-500/20 to-rose-500/20'
    },
    {
        id: 'advanced_threats',
        name: 'Advanced Threats',
        description: 'Detect APT, zero-day exploits, and sophisticated attacks',
        icon: Zap,
        color: 'red-500',
        gradient: 'from-red-500/20 to-orange-500/20'
    },
    {
        id: 'malware_detection',
        name: 'Malware Detection',
        description: 'Identify malicious files, attachments, and downloads',
        icon: Bug,
        color: 'orange-500',
        gradient: 'from-orange-500/20 to-yellow-500/20'
    }
];

const LEVELS = [
    { id: 'beginner', name: 'Beginner', description: 'Basic patterns and obvious red flags', color: 'green-500' },
    { id: 'intermediate', name: 'Intermediate', description: 'More subtle indicators', color: 'yellow-500' },
    { id: 'advanced', name: 'Advanced', description: 'Sophisticated attacks', color: 'orange-500' },
    { id: 'expert', name: 'Expert', description: 'Real-world APT scenarios', color: 'red-500' }
];

export default function LabsPage() {
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = useState(null);

    // Debugging
    useEffect(() => {
        console.log('LabsPage Mounted');
        console.log('TOPICS:', TOPICS);
    }, []);

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
        console.log(`Fetching labs for topic: ${selectedTopic}, level: ${selectedLevel}`);
        setLoading(true);
        try {
            const response = await api.get(`/labs?topic=${selectedTopic}&level=${selectedLevel}`);
            console.log('Labs response:', response.data);
            setLabs(response.data.data);
        } catch (error) {
            console.error('Error fetching labs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicSelect = (topicId) => {
        console.log('Selected Topic:', topicId);
        setSelectedTopic(topicId);
        setSelectedLevel(null);
        setLabs([]);
    };

    const handleLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
    };

    const handleLabStart = (labId) => {
        navigate(`/labs/${labId}`);
    };

    return (
        <div className="flex-1 flex flex-col py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black italic text-white mb-4 tracking-tight">
                        Simulation <span className="text-cyber-cyan">Labs</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        ENVIRONMENT: SAFE • PAYLOAD STATUS: TOKENIZED
                    </p>

                    {/* Progress Stats */}
                    {progress && progress.overall && (
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded-full">
                                <span className="text-sm font-black uppercase tracking-widest text-cyber-cyan">
                                    {progress.overall.completedLabs}/{progress.overall.totalLabs} Labs Completed
                                </span>
                            </div>
                            <div className="px-6 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                <Trophy className="w-4 h-4 text-yellow-500 inline mr-2" />
                                <span className="text-sm font-black uppercase tracking-widest text-yellow-500">
                                    {progress.overall.totalScore} Points
                                </span>
                            </div>
                            <div className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                <span className="text-sm font-black uppercase tracking-widest text-purple-500">
                                    {progress.overall.completionRate}% Complete
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-black uppercase tracking-widest text-green-500">
                            Sandbox Active
                        </span>
                    </div>
                </div>

                {!selectedTopic ? (
                    /* Topic Selection */
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black italic text-white mb-8">
                            Select Training Topic
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TOPICS.map((topic) => {
                                const Icon = topic.icon;
                                const variants = COLOR_VARIANTS[topic.color] || COLOR_VARIANTS['cyber-cyan'];
                                return (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicSelect(topic.id)}
                                        className={`group relative p-8 bg-gradient-to-br ${topic.gradient} border border-white/10 rounded-3xl transition-all hover:scale-105 ${variants.border}`}
                                    >
                                        <div className={`absolute top-6 right-6 p-3 rounded-2xl ${variants.bg}`}>
                                            {Icon && <Icon className={`w-6 h-6 ${variants.icon}`} />}
                                        </div>

                                        <h3 className="text-xl font-black text-white mb-3 pr-16">
                                            {topic.name}
                                        </h3>
                                        <p className="text-white/60 text-sm mb-6">
                                            {topic.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-widest text-white/40">
                                                40 Labs
                                            </span>
                                            <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${variants.text}`} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : !selectedLevel ? (
                    /* Level Selection */
                    <div className="space-y-6">
                        <button
                            onClick={() => setSelectedTopic(null)}
                            className="text-white/60 hover:text-white transition-colors mb-6"
                        >
                            ← Back to Topics
                        </button>

                        <h2 className="text-2xl font-black italic text-white mb-8">
                            Select Difficulty Level
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {LEVELS.map((level) => {
                                const variants = COLOR_VARIANTS[level.color] || COLOR_VARIANTS['green-500'];
                                return (
                                    <button
                                        key={level.id}
                                        onClick={() => handleLevelSelect(level.id)}
                                        className={`group p-8 bg-white/[0.02] border border-white/10 rounded-3xl transition-all hover:scale-105 ${variants.border}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-white mb-2">
                                                    {level.name}
                                                </h3>
                                                <p className="text-white/60 text-sm">
                                                    {level.description}
                                                </p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-full ${variants.bg}`}>
                                                <span className={`text-xs font-black uppercase tracking-widest ${variants.text}`}>
                                                    10 Labs
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${variants.text}`} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Lab List */
                    <div className="space-y-6">
                        <button
                            onClick={() => setSelectedLevel(null)}
                            className="text-white/60 hover:text-white transition-colors mb-6"
                        >
                            ← Back to Levels
                        </button>

                        <h2 className="text-2xl font-black italic text-white mb-8">
                            {TOPICS.find(t => t.id === selectedTopic)?.name} - {LEVELS.find(l => l.id === selectedLevel)?.name}
                        </h2>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {labs.map((lab, index) => (
                                    <button
                                        key={lab._id}
                                        onClick={() => handleLabStart(lab._id)}
                                        className="group p-6 bg-white/[0.02] border border-white/10 rounded-3xl hover:border-cyber-cyan/40 transition-all hover:scale-105 text-left"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-black uppercase tracking-widest text-cyber-cyan">
                                                        Lab {index + 1}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Trophy className="w-3 h-3 text-yellow-500" />
                                                        <span className="text-xs text-white/60">{lab.points} pts</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-black text-white mb-2">
                                                    {lab.title}
                                                </h3>
                                                <p className="text-white/60 text-sm mb-4">
                                                    {lab.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-white/40" />
                                                    <span className="text-xs text-white/60">{Math.floor(lab.timeLimit / 60)} min</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Shield className="w-4 h-4 text-white/40" />
                                                    <span className="text-xs text-white/60">Difficulty {lab.difficulty}/10</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
