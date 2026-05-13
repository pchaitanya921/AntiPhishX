import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Input, Spinner } from '../components/ui';
import { 
    BookOpen, Search, Filter, Shield, Clock, Award, AlertCircle, 
    Video, Terminal, Globe, Zap, Fingerprint, Brain, QrCode,
    Phone, MessageSquare, Anchor, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI } from '../services/api';
import PermissionWrapper from '../components/auth/PermissionWrapper';
import LockedFeature from '../components/ui/LockedFeature';
import { LEVEL_TO_PLAN } from '../config/plans';

const NeuralThumbnail = ({ category, title, src }) => {
    const [imgError, setImgError] = useState(false);

    const getNeuralIcon = (cat) => {
        const baseClass = "w-20 h-20 transition-all duration-700 group-hover:scale-110";
        switch (cat?.toLowerCase()) {
            case 'phishing':
                return (
                    <div className="relative">
                        <Anchor className={`${baseClass} text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]`} />
                        <div className="absolute inset-0 bg-emerald-500/20  animate-pulse" />
                    </div>
                );
            case 'social_engineering':
                return (
                    <div className="relative">
                        <Brain className={`${baseClass} text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]`} />
                        <div className="absolute inset-0 bg-pink-500/20  animate-pulse" />
                    </div>
                );
            case 'qr':
            case 'qr_code':
                return (
                    <div className="relative">
                        <QrCode className={`${baseClass} text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`} />
                        <div className="absolute inset-0 bg-white/10  animate-pulse" />
                    </div>
                );
            case 'vishing':
                return (
                    <div className="relative">
                        <Phone className={`${baseClass} text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]`} />
                        <div className="absolute inset-0 bg-emerald-500/20  animate-pulse" />
                    </div>
                );
            case 'smishing':
                return (
                    <div className="relative">
                        <MessageSquare className={`${baseClass} text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.8)]`} />
                        <div className="absolute inset-0 bg-lime-500/20  animate-pulse" />
                    </div>
                );
            case 'executive_intelligence':
                return (
                    <div className="relative">
                        <Shield className={`${baseClass} text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]`} />
                        <div className="absolute inset-0 bg-emerald-500/20  animate-pulse" />
                    </div>
                );
            case 'tactical_defense':
                return (
                    <div className="relative">
                        <Terminal className={`${baseClass} text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]`} />
                        <div className="absolute inset-0 bg-blue-500/20  animate-pulse" />
                    </div>
                );
            case 'cognitive_security':
                return (
                    <div className="relative">
                        <Brain className={`${baseClass} text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]`} />
                        <div className="absolute inset-0 bg-purple-500/20  animate-pulse" />
                    </div>
                );
            case 'advanced_ai_adaptive':
                return (
                    <div className="relative">
                        <Zap className={`${baseClass} text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]`} />
                        <div className="absolute inset-0 bg-amber-500/20  animate-pulse" />
                    </div>
                );
            default:
                return (
                    <div className="relative">
                        <ShieldCheck className={`${baseClass} text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]`} />
                        <div className="absolute inset-0 bg-emerald-500/10  animate-pulse" />
                    </div>
                );
        }
    };

    if (src && !imgError) {
        return (
            <img
                src={src}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
                {getNeuralIcon(category)}
            </div>
        </div>
    );
};

export default function CoursesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getAll({ published: true });
            setCourses(response.data.data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError('Failed to connect to Intelligence Node. Please verify your uplink.');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        (course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter italic text-white uppercase leading-none">
                        Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Archive</span>
                    </h1>
                    <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Authorized Intelligence Training Modules · Sector_{user?._id?.slice(-4) || 'hub'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[300px]">
                    <Input
                        icon={Search}
                        placeholder="Search Intelligence Node..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" className="h-16 px-8" onClick={fetchCourses}>
                        <Filter size={18} className="text-emerald-400" />
                        Refresh Archive
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
                        <Spinner className="w-20 h-20 relative z-10" />
                    </div>
                    <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Synchronizing Data Structures...</p>
                </div>
            ) : error ? (
                <Card className="p-16 flex flex-col items-center justify-center text-center gap-8 bg-red-500/[0.02] border-red-500/10">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black italic text-white uppercase">Archive Link Severed</h3>
                        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{error}</p>
                    </div>
                    <Button variant="danger" onClick={fetchCourses} size="lg">Reconnect to Hub</Button>
                </Card>
            ) : filteredCourses.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center gap-8 text-white/10">
                    <Shield size={100} className="stroke-[0.5]" />
                    <p className="font-black uppercase text-[10px] tracking-[0.5em]">No training nodes detected in current sector</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCourses.map((course) => {
                        const reqPlan = LEVEL_TO_PLAN[course.level] || 'core_node';

                        return (
                            <div key={course._id} className="relative group">
                                <Card
                                    hover
                                    className={`flex flex-col h-full bg-[#111111] border-white/5 rounded-[3rem] overflow-hidden transition-all duration-500 ${course.isLocked ? 'cursor-not-allowed grayscale-[0.5] blur-[1px]' : ''}`}
                                    onClick={() => !course.isLocked && navigate(`/courses/${course._id}`)}
                                >
                                    <div className="h-64 relative overflow-hidden">
                                        <NeuralThumbnail 
                                            category={course.category} 
                                            title={course.title} 
                                            src={course.thumbnail} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
                                    </div>

                                    <div className="p-10 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Badge variant="primary" className="bg-emerald-500/5 border-emerald-500/10 text-emerald-400">
                                                {course.category || 'Intelligence'}
                                            </Badge>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>

                                        <h3 className="text-2xl font-black mb-4 group-hover:text-emerald-400 transition-colors text-white uppercase italic tracking-tight leading-tight">
                                            {course.title}
                                        </h3>
                                        
                                        <p className="text-xs font-medium text-white/30 mb-8 line-clamp-2 leading-relaxed">
                                            {course.description}
                                        </p>

                                        <div className="mt-auto grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                                            <div className="flex flex-col items-center gap-2">
                                                <Clock size={16} className="text-emerald-400/40" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{course.estimatedDuration || 0}M</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 border-x border-white/5 px-2">
                                                <BookOpen size={16} className="text-lime-400/40" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{course.modules?.length || 0} Levels</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <Video size={16} className="text-emerald-400/40" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{course.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0} Files</span>
                                            </div>
                                        </div>

                                        <div className="pt-10 flex flex-col gap-4">
                                            <Button
                                                variant="primary"
                                                className="w-full h-16"
                                                onClick={() => !course.isLocked && navigate(`/courses/${course._id}`)}
                                                disabled={course.isLocked}
                                            >
                                                {course.isLocked ? 'Locked' : 'Execute Course'}
                                            </Button>
                                            {(user?.role === 'admin' || user?.role === 'instructor') && (
                                                <Button
                                                    variant="secondary"
                                                    className="w-full h-14"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(user?.role === 'admin' ? `/admin/courses/${course._id}` : `/instructor/courses/${course._id}`);
                                                    }}
                                                >
                                                    Modify Node
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                                {course.isLocked && (
                                    <LockedFeature 
                                        overlayOnly 
                                        requiredPlan={reqPlan} 
                                        message={`Module clearance requires ${reqPlan.replace('_', ' ').toUpperCase()} node access.`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

