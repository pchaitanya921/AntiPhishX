// Neural Cache Reset: Link Established
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TranscriptPanel from '../components/TranscriptPanel';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    PlayCircle,
    BookOpen,
    Clock,
    Shield,
    Video,
    Activity,
    FileText,
    Link as LinkIcon,
    Layers,
    ChevronDown,
    ChevronRight,
    Award,
    Wand2,
    Zap
} from 'lucide-react';
import { Card, Button, Badge, Spinner, VideoPlayer } from '../components/ui';
import { courseAPI, noteAPI } from '../services/api';
import { format } from 'date-fns';

export default function CoursePlayerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeLang, setActiveLang] = useState('en');
    const [expandedModules, setExpandedModules] = useState(['beginner', 'intermediate', 'advanced']);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('transcript'); // 'transcript', 'notes', 'resources'
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [notesLoading, setNotesLoading] = useState(false);
    const videoPlayerRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', icon: '🇺🇸' },
        { code: 'hi', name: 'Hindi', icon: '🇮🇳' },
        { code: 'te', name: 'Telugu', icon: '🇮🇳' },
        { code: 'bn', name: 'Bengali', icon: '🇮🇳' },
        { code: 'mr', name: 'Marathi', icon: '🇮🇳' },
        { code: 'ta', name: 'Tamil', icon: '🇮🇳' },
        { code: 'ur', name: 'Urdu', icon: '🇮🇳' },
        { code: 'gu', name: 'Gujarati', icon: '🇮🇳' },
        { code: 'kn', name: 'Kannada', icon: '🇮🇳' },
        { code: 'ml', name: 'Malayalam', icon: '🇮🇳' },
        { code: 'or', name: 'Odia', icon: '🇮🇳' },
        { code: 'pa', name: 'Punjabi', icon: '🇮🇳' },
        { code: 'as', name: 'Assamese', icon: '🇮🇳' },
        { code: 'mai', name: 'Maithili', icon: '🇮🇳' },
        { code: 'sat', name: 'Santali', icon: '🇮🇳' },
        { code: 'ks', name: 'Kashmiri', icon: '🇮🇳' },
        { code: 'ne', name: 'Nepali', icon: '🇮🇳' },
        { code: 'sd', name: 'Sindhi', icon: '🇮🇳' },
        { code: 'kok', name: 'Konkani', icon: '🇮🇳' },
        { code: 'doi', name: 'Dogri', icon: '🇮🇳' },
        { code: 'mni', name: 'Manipuri', icon: '🇮🇳' },
        { code: 'brx', name: 'Bodo', icon: '🇮🇳' },
        { code: 'sa', name: 'Sanskrit', icon: '🇮🇳' },
        { code: 'es', name: 'Spanish', icon: '🇪🇸' },
        { code: 'fr', name: 'French', icon: '🇫🇷' }
    ];

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getById(id);
            const courseData = response.data.data;
            setCourse(courseData);

            // Auto-select first video if available
            if (courseData.modules && courseData.modules.length > 0) {
                const firstModule = courseData.modules.find(m => m.videos?.length > 0);
                if (firstModule) {
                    setActiveVideo(firstModule.videos[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch training node:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch notes when active video changes
    useEffect(() => {
        if (activeVideo && course) {
            fetchNotes();
        }
    }, [activeVideo, course]);

    const fetchNotes = async () => {
        try {
            setNotesLoading(true);
            const response = await noteAPI.getNotes(course._id, activeVideo.title);
            setNotes(response.data.data.notes);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setNotesLoading(false);
        }
    };

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return;

        try {
            const response = await noteAPI.createNote({
                courseId: course._id,
                videoTitle: activeVideo.title,
                timestamp: Math.floor(currentTime),
                content: noteContent
            });

            setNotes([...notes, response.data.data.note]);
            setNoteContent('');
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await noteAPI.deleteNote(noteId);
            setNotes(notes.filter(n => n._id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleModule = (level) => {
        setExpandedModules(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] p-12 space-y-12 animate-pulse">
                <div className="h-[400px] w-full bg-white/5 rounded-[4rem]" />
                <div className="flex gap-12 max-w-[1700px] mx-auto w-full">
                    <div className="flex-1 space-y-8">
                        <div className="h-64 bg-white/5 rounded-[3rem]" />
                        <div className="space-y-4">
                            <div className="h-10 w-1/2 bg-white/5 rounded-xl" />
                            <div className="h-4 w-1/4 bg-white/5 rounded-lg" />
                        </div>
                    </div>
                    <div className="w-[450px] h-[600px] bg-white/5 rounded-[3rem]" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center selection:bg-red-500 selection:text-white">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-red-500/20 blur-[100px] animate-pulse" />
                    <div className="w-32 h-32 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 relative z-10">
                        <Activity size={60} className="animate-pulse" />
                    </div>
                </div>
                
                <div className="space-y-4 max-w-xl relative z-10">
                    <Badge variant="danger" className="h-6 px-4 mb-4 animate-bounce">Neural Link Severed</Badge>
                    <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-tight">
                        Node <span className="text-red-500">Recovery</span> Failed
                    </h1>
                    <p className="text-white/30 font-medium italic text-sm leading-relaxed">
                        "Intelligence uplink could not be established with the requested training node. This may be due to restricted sector access or a temporal synchronization error in the Neural Archive."
                    </p>
                </div>

                <div className="flex gap-6 mt-12 relative z-10">
                    <Button 
                        variant="primary" 
                        onClick={() => window.location.reload()}
                        className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        Retry Uplink
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/courses')}
                        className="h-16 px-10 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px]"
                    >
                        Return to Hub
                    </Button>
                </div>

                <div className="mt-20 flex flex-col items-center gap-2 opacity-20">
                    <div className="w-px h-20 bg-gradient-to-b from-red-500 to-transparent" />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">Sector_Diagnostic_Mode</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col selection:bg-cyber-cyan selection:text-black">
            {/* Cinematic Hero Banner */}
            <div className="relative h-[400px] w-full overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={course.thumbnail || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"}
                    className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 max-w-[1700px] mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-black">
                                {course.category?.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-black">
                                {course.level} clearance required
                            </Badge>
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/30 pt-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-cyber-cyan" /> {course.duration || '6 Hours'} Estimated
                                </div>
                                <div className="flex items-center gap-3">
                                    <Layers size={16} className="text-cyber-cyan" /> {course.modules?.length || 0} Strategic Sectors
                                </div>
                                <div className="flex items-center gap-3">
                                    <Award size={16} className="text-cyber-cyan" /> Level {course.level} Certification
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Return Button Overlay */}
                <div className="absolute top-8 left-12 z-30">
                    <button
                        onClick={() => navigate('/courses')}
                        className="flex items-center gap-3 px-6 py-3 bg-black/60  border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group font-black uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Exit Node
                    </button>
                </div>
            </div>

            <div className="flex-1 flex max-w-[1700px] mx-auto w-full p-12 gap-12 -mt-12 relative z-20">
                {/* Main Content: Video & Details */}
                <div className="flex-1 space-y-12">
                    {/* Video Player Section */}
                    <Card className="aspect-video w-full rounded-[3rem] overflow-hidden border-white/10 shadow-2xl bg-black">
                        <VideoPlayer
                            ref={videoPlayerRef}
                            url={activeVideo?.url}
                            videoUrl={activeVideo?.videoUrl}
                            thumbnailUrl={activeVideo?.thumbnailUrl}
                            cloudinaryId={activeVideo?.cloudinaryId}
                            onTimeUpdate={(time) => setCurrentTime(time)}
                            className="h-full w-full"
                        />
                    </Card>

                    {/* Active Unit Info */}
                    <div className="space-y-10">
                        <div className="flex items-start justify-between gap-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black italic text-white uppercase tracking-tight">{activeVideo?.title || 'Initializing Neural Link...'}</h2>
                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-cyber-cyan" />
                                        Duration: {activeVideo?.duration || 0} Seconds
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className="text-cyber-cyan" />
                                        Origin: {activeVideo?.source || 'SECURE_NODE'}
                                    </div>
                                </div>
                                {activeVideo?.summary && (
                                    <p className="text-white/40 text-base leading-relaxed italic max-w-4xl">
                                        "{activeVideo.summary}"
                                    </p>
                                )}
                            </div>
                            
                            {/* AI Copilot Toggle Inside Player */}
                            <div className="shrink-0 pt-2">
                                <Button 
                                    variant="outline" 
                                    className="h-16 px-8 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30 group"
                                    onClick={() => navigate('/ai-copilot')}
                                >
                                    <Wand2 className="mr-3 text-cyber-cyan group-hover:animate-pulse" size={18} />
                                    AI Learning Assistant
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-6">
                                {/* Tabs Header */}
                                <div className="flex items-center gap-6 border-b border-white/10 pb-0">
                                    {['transcript', 'notes', 'resources'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`
                                            pb-4 text-sm font-black uppercase tracking-widest transition-all relative
                                            ${activeTab === tab ? 'text-cyber-cyan' : 'text-white/40 hover:text-white'}
                                        `}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[400px]">
                                    {activeTab === 'transcript' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="space-y-6"
                                        >
                                            {/* Language Dropdown */}
                                            <div className="relative z-10">
                                                <button
                                                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                                    className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all w-full md:w-64 justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{languages.find(l => l.code === activeLang)?.icon}</span>
                                                        <div className="text-left">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Language</p>
                                                            <p className="text-sm font-bold text-white">{languages.find(l => l.code === activeLang)?.name}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown size={16} className={`text-white/40 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isLangMenuOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute top-full left-0 mt-2 w-full md:w-64 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
                                                        >
                                                            {languages.map(lang => {
                                                                const hasTranscript = activeVideo?.transcripts?.some(t => t.language === lang.code);

                                                                return (
                                                                    <button
                                                                        key={lang.code}
                                                                        onClick={() => {
                                                                            setActiveLang(lang.code);
                                                                            setIsLangMenuOpen(false);
                                                                        }}
                                                                        className={`
                                                                        w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/5 last:border-0
                                                                        ${activeLang === lang.code ? 'bg-cyber-cyan/10 text-cyber-cyan' : 'text-white/60'}
                                                                    `}
                                                                    >
                                                                        <span className="text-lg">{lang.icon}</span>
                                                                        <span className="text-sm font-bold">{lang.name}</span>
                                                                        {activeLang === lang.code && <Activity size={14} className="ml-auto" />}
                                                                        {hasTranscript && activeLang !== lang.code && <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/50 ml-auto" />}
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                {(() => {
                                                    const activeTranscript = activeVideo?.transcripts?.find(t => t.language === activeLang);
                                                    const summary = activeTranscript?.summary;
                                                    const segments = activeTranscript?.segments || [];

                                                    return (
                                                        <>
                                                            {summary && (
                                                                <div className="pb-4 mb-4 border-b border-white/10">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <FileText size={14} className="text-cyber-cyan" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">Summary</span>
                                                                    </div>
                                                                    <p className="text-white/80 text-sm leading-relaxed">{summary}</p>
                                                                </div>
                                                            )}
                                                            <TranscriptPanel
                                                                segments={segments}
                                                                content={activeTranscript?.content}
                                                                currentTime={currentTime}
                                                                onSegmentClick={(time) => {
                                                                    if (videoPlayerRef.current) videoPlayerRef.current.seekTo(time);
                                                                }}
                                                            />
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Your Neural Notes</h3>
                                                    <Badge variant="purple" className="text-[10px]">{formatTime(currentTime)}</Badge>
                                                </div>

                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        value={noteContent}
                                                        onChange={(e) => setNoteContent(e.target.value)}
                                                        placeholder="Capture a thought at this timestamp..."
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyber-purple/50 transition-all"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                                                    />
                                                    <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>Save</Button>
                                                </div>

                                                <div className="space-y-3 mt-6">
                                                    {notesLoading ? (
                                                        <div className="flex justify-center p-4"><Spinner size="sm" /></div>
                                                    ) : notes.length > 0 ? (
                                                        notes.map((note) => (
                                                            <div key={note._id} className="group flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-white/10">
                                                                <button
                                                                    onClick={() => {
                                                                        if (videoPlayerRef.current) videoPlayerRef.current.seekTo(note.timestamp);
                                                                    }}
                                                                    className="mt-1 px-2 py-1 bg-cyber-purple/20 text-cyber-purple rounded text-xs font-bold hover:bg-cyber-purple hover:text-white transition-all"
                                                                >
                                                                    {formatTime(note.timestamp)}
                                                                </button>
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-white/80">{note.content}</p>
                                                                    <p className="text-[10px] text-white/20 mt-1">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteNote(note._id)}
                                                                    className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-10 text-white/20 text-sm">
                                                            No notes taken for this node yet.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'resources' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="space-y-4"
                                        >
                                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                                <div className="space-y-3">
                                                    {activeVideo?.materials?.length > 0 ? (
                                                        activeVideo.materials.map((material, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-cyber-purple/40 transition-all group"
                                                            >
                                                                <div className="p-3 bg-cyber-purple/10 rounded-2xl text-cyber-purple group-hover:bg-cyber-purple group-hover:text-white transition-all">
                                                                    {material.type === 'pdf' ? <FileText size={20} /> : <LinkIcon size={20} />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-black text-white mb-1">{material.title}</p>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{material.type}</p>
                                                                </div>
                                                                <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                            </a>
                                                        ))
                                                    ) : (
                                                        <div className="p-10 border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-white/10 gap-4">
                                                            <Layers size={32} />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">No External Intelligence Found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Course Content / Playlist */}
                <div className="w-[450px] space-y-6">
                    <Card className="sticky top-40 bg-white/[0.02]  border border-white/5 h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-white/5">
                            <h3 className="text-xl font-black italic text-white flex items-center gap-3">
                                <BookOpen size={24} className="text-cyber-purple" />
                                Curriculum Core
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                            {course.modules?.map((module) => (
                                <div key={module.level} className="space-y-3">
                                    <button
                                        onClick={() => toggleModule(module.level)}
                                        className={`
                                            w-full flex items-center justify-between p-4 rounded-2xl transition-all border
                                            ${expandedModules.includes(module.level)
                                                ? 'bg-cyber-purple/10 border-cyber-purple/20 text-white'
                                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.05]'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${expandedModules.includes(module.level) ? 'bg-cyber-purple text-white' : 'bg-white/5 text-white/40'}`}>
                                                <Award size={14} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{module.level} Sector</span>
                                        </div>
                                        {expandedModules.includes(module.level) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>

                                    <AnimatePresence>
                                        {expandedModules.includes(module.level) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden space-y-2"
                                            >
                                                {module.videos?.map((video, vIdx) => (
                                                    <button
                                                        key={`v-${vIdx}`}
                                                        onClick={() => setActiveVideo(video)}
                                                        className={`
                                                            w-full flex items-center gap-4 p-4 rounded-2xl transition-all border group
                                                            ${activeVideo?.title === video.title
                                                                ? 'bg-white/10 border-cyber-cyan/40 text-cyber-cyan shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                                                                : 'bg-transparent border-transparent text-white/40 hover:bg-white/[0.03] hover:text-white'
                                                            }
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-10 h-10 rounded-xl flex items-center justify-center transition-all
                                                            ${activeVideo?.title === video.title ? 'bg-cyber-cyan text-cyber-black' : 'bg-white/5 text-white/20 group-hover:bg-white/10'}
                                                        `}>
                                                            {activeVideo?.title === video.title ? <PlayCircle size={18} fill="currentColor" /> : <PlayCircle size={18} />}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="text-[11px] font-black truncate leading-tight">{video.title}</p>
                                                            <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">{video.duration} Sec • Video</p>
                                                        </div>
                                                    </button>
                                                ))}

                                                {module.labs?.map((lab, lIdx) => (
                                                    <button
                                                        key={`l-${lIdx}`}
                                                        onClick={() => navigate(`/labs/${lab._id}`)}
                                                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent bg-emerald-500/5 text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                            <Zap size={18} />
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="text-[11px] font-black truncate leading-tight">{lab.title}</p>
                                                            <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">Simulation Lab • {lab.points} PT</p>
                                                        </div>
                                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Final Quiz / Certification CTA */}
                            <div className="pt-8 mt-4 border-t border-white/5">
                                <Button 
                                    className="w-full h-20 rounded-[2rem] bg-gradient-to-r from-cyber-cyan to-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                    onClick={() => navigate('/quizzes')}
                                >
                                    Initialize Final Exam
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

