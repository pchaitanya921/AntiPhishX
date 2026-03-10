import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    PlayCircle,
    BookOpen,
    BarChart3,
    Clock,
    Shield,
    Video,
    Plus,
    Edit,
    Trash2,
    Activity,
    Layers,
    FileText,
    Link as LinkIcon,
    Sparkles,
    X,
    Save,
    RefreshCcw
} from 'lucide-react';
import { Card, Button, Badge, Input, Spinner, VideoPlayer } from '../components/ui';
import { adminAPI, courseAPI } from '../services/api';
import { AnimatePresence } from 'framer-motion';

export default function AdminCourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLevel, setActiveLevel] = useState('beginner');

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getById(id);
            setCourse(response.data.data);
        } catch (err) {
            console.error('Failed to fetch course details:', err);
        } finally {
            setLoading(false);
        }
    };

    // Modal States
    const [isEditTopicOpen, setEditTopicOpen] = useState(false);
    const [isAddVideoOpen, setAddVideoOpen] = useState(false);
    const [isEditVideoOpen, setEditVideoOpen] = useState(false);
    const [selectedVideoIdx, setSelectedVideoIdx] = useState(null);
    const [previewVideoIdx, setPreviewVideoIdx] = useState(null);
    const [activeLang, setActiveLang] = useState('en');
    const [saving, setSaving] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

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

    // Form States
    const [topicForm, setTopicForm] = useState({
        title: '',
        description: '',
        category: ''
    });

    const [videoForm, setVideoForm] = useState({
        title: '',
        source: 'SECURE_NODE',
        url: '',
        duration: 0,
        summary: '',
        transcripts: [{ language: 'en', content: '' }],
        materials: []
    });

    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(Math.round(video.duration));
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            setUploadProgress(10);

            const formData = new FormData();
            formData.append('video', file);

            const response = await adminAPI.uploadVideo(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });

            if (response.data.success) {
                const duration = await getVideoDuration(file);
                setVideoForm(prev => ({
                    ...prev,
                    url: response.data.url,
                    source: 'SECURE_NODE',
                    duration: duration || prev.duration
                }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Uplink Interrupted: Unable to transmit media stream. ' + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        if (course) {
            setTopicForm({
                title: course.title,
                description: course.description,
                category: course.category
            });
        }
    }, [course]);

    const handleUpdateTopic = async () => {
        try {
            setSaving(true);
            await adminAPI.updateCourse(id, topicForm);
            await fetchCourseDetails();
            setEditTopicOpen(false);
        } catch (err) {
            console.error('Update topic failed:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddVideo = async () => {
        if (saving) return;
        try {
            setSaving(true);
            const updatedModules = [...course.modules];
            let modIdx = updatedModules.findIndex(m => m.level === activeLevel);

            if (modIdx === -1) {
                // If module doesn't exist, create it
                updatedModules.push({
                    level: activeLevel,
                    title: `${activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1)} Sector`,
                    videos: []
                });
                modIdx = updatedModules.length - 1;
            }

            if (modIdx > -1) {
                if (!updatedModules[modIdx].videos) updatedModules[modIdx].videos = [];
                updatedModules[modIdx].videos.push(videoForm);
                await adminAPI.updateCourse(id, { modules: updatedModules });
                await fetchCourseDetails();
                setAddVideoOpen(false);
                resetVideoForm();
            }
        } catch (err) {
            console.error('Add video failed:', err);
            alert('Security Protocol Failure: Unable to deploy video unit. ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const resetVideoForm = () => {
        setVideoForm({
            title: '',
            source: 'SECURE_NODE',
            url: '',
            duration: 0,
            summary: '',
            transcripts: [{ language: 'en', content: '' }],
            materials: []
        });
    };

    const handleEditVideo = (idx, e) => {
        if (e) e.stopPropagation();
        const video = currentModule?.videos?.[idx];
        if (!video) return;

        setVideoForm({
            ...video,
            transcripts: video.transcripts?.length > 0 ? video.transcripts : [{ language: 'en', content: '' }],
            materials: video.materials?.length > 0 ? video.materials : []
        });
        setSelectedVideoIdx(idx);
        setEditVideoOpen(true);
    };

    const handleUpdateVideo = async () => {
        if (saving) return;
        try {
            setSaving(true);
            const updatedModules = [...course.modules];
            const modIdx = updatedModules.findIndex(m => m.level === activeLevel);

            if (modIdx > -1) {
                if (!updatedModules[modIdx].videos) updatedModules[modIdx].videos = [];
                updatedModules[modIdx].videos[selectedVideoIdx] = videoForm;
                await adminAPI.updateCourse(id, { modules: updatedModules });
                await fetchCourseDetails();
                setEditVideoOpen(false);
            }
        } catch (err) {
            console.error('Update video failed:', err);
            alert('Security Protocol Failure: Unable to update curriculum node. ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleAutoTranslate = () => {
        const sourceTranscript = videoForm.transcripts.find(t => t.language === 'en') || videoForm.transcripts[0];
        const sourceContent = sourceTranscript?.content || '';

        if (!sourceContent) {
            alert('No source transcript content found to translate.');
            return;
        }

        if (!window.confirm(`This will copy the English transcript to ALL ${languages.length} languages. Continue?`)) {
            return;
        }

        const newTranscripts = languages.map(lang => {
            if (lang.code === sourceTranscript.language) {
                return sourceTranscript;
            }
            return {
                language: lang.code,
                content: sourceContent
            };
        });

        setVideoForm(prev => ({
            ...prev,
            transcripts: newTranscripts
        }));
    };

    const handleDeleteVideo = async (idx, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this video unit?')) return;

        try {
            const updatedModules = [...course.modules];
            const modIdx = updatedModules.findIndex(m => m.level === activeLevel);

            if (modIdx > -1) {
                updatedModules[modIdx].videos.splice(idx, 1);
                await adminAPI.updateCourse(id, { modules: updatedModules });
                await fetchCourseDetails();
            }
        } catch (err) {
            console.error('Delete video failed:', err);
        }
    };



    const handleAddTranscriptLang = () => {
        const unusedLang = languages.find(l => !videoForm.transcripts.some(t => t.language === l.code));
        if (unusedLang) {
            setVideoForm({
                ...videoForm,
                transcripts: [...videoForm.transcripts, { language: unusedLang.code, content: '' }]
            });
        }
    };

    const updateTranscript = (idx, content) => {
        const newTranscripts = [...videoForm.transcripts];
        newTranscripts[idx].content = content;
        setVideoForm({ ...videoForm, transcripts: newTranscripts });
    };

    const updateTranscriptLang = (idx, lang) => {
        const newTranscripts = [...videoForm.transcripts];
        newTranscripts[idx].language = lang;
        setVideoForm({ ...videoForm, transcripts: newTranscripts });
    };

    const removeTranscript = (idx) => {
        const newTranscripts = videoForm.transcripts.filter((_, i) => i !== idx);
        setVideoForm({ ...videoForm, transcripts: newTranscripts });
    };

    // AI Transcript generation removed per user request

    const handleAddMaterial = () => {
        setVideoForm({
            ...videoForm,
            materials: [...videoForm.materials, { title: '', url: '', type: 'link' }]
        });
    };

    const updateMaterial = (idx, field, value) => {
        const newMaterials = [...videoForm.materials];
        newMaterials[idx][field] = value;
        setVideoForm({ ...videoForm, materials: newMaterials });
    };

    const removeMaterial = (idx) => {
        const newMaterials = videoForm.materials.filter((_, i) => i !== idx);
        setVideoForm({ ...videoForm, materials: newMaterials });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-12 text-center">
                <Shield size={64} className="mx-auto mb-4 text-red-500/40" />
                <h2 className="text-2xl font-black text-white">Course Not Found</h2>
                <Button
                    onClick={() => navigate('/admin/courses')}
                    className="mt-6 bg-white/5"
                >
                    <ChevronLeft size={18} className="mr-2" />
                    Back to Course Management
                </Button>
            </div>
        );
    }

    const currentModule = course.modules?.find(m => m.level === activeLevel);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="flex items-center gap-2 text-cyber-purple hover:text-cyber-cyan transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <ChevronLeft size={14} />
                        Back to Management
                    </button>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter italic">
                            {course.title.split(' ')[0]} <span className="cyber-gradient-text">{course.title.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">
                            Topic Content Management Core
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate('/admin/analytics')}
                        className="bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                        <BarChart3 size={18} className="mr-2" />
                        Metrics
                    </Button>
                    <Button
                        onClick={() => setEditTopicOpen(true)}
                        className="bg-gradient-to-r from-cyber-purple to-cyber-cyan shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                    >
                        <Edit size={18} className="mr-2" />
                        Modify Setup
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Level Selection Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 px-4">Topic Courses</h3>
                    {['beginner', 'intermediate', 'advanced'].map((level) => {
                        const moduleExists = course.modules?.some(m => m.level === level);
                        return (
                            <button
                                key={level}
                                onClick={() => setActiveLevel(level)}
                                disabled={!moduleExists}
                                className={`
                                    w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden
                                    ${activeLevel === level
                                        ? 'bg-cyber-purple/10 border-cyber-purple/50 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                    }
                                    ${!moduleExists ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                                `}
                            >
                                <div className="flex flex-col gap-1 relative z-10">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeLevel === level ? 'text-cyber-purple' : 'text-white/40'}`}>
                                        Course Node
                                    </span>
                                    <span className="text-lg font-black text-white capitalize">{level}</span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Video size={12} className="text-white/40" />
                                        <span className="text-xs text-white/40 font-bold">
                                            {course.modules?.find(m => m.level === level)?.videos?.length || 0} Units
                                        </span>
                                    </div>
                                </div>
                                {activeLevel === level && (
                                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyber-purple/20 to-transparent blur-xl" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Video List */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl -z-10" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyber-purple/20 rounded-xl flex items-center justify-center">
                                    <PlayCircle size={24} className="text-cyber-purple" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white capitalize">{activeLevel} Course Stream</h2>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{currentModule?.description || 'Active data stream'}</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                className="bg-white/5"
                                onClick={() => {
                                    resetVideoForm();
                                    setAddVideoOpen(true);
                                }}
                            >
                                <Plus size={16} className="mr-2" />
                                Deploy Video Unit
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {currentModule?.videos?.length > 0 ? (
                                currentModule.videos.map((video, idx) => (
                                    <React.Fragment key={idx}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => setPreviewVideoIdx(previewVideoIdx === idx ? null : idx)}
                                            className={`
                                                group p-4 bg-white/[0.03] hover:bg-white/[0.08] border rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer
                                                ${previewVideoIdx === idx ? 'border-cyber-purple/50 bg-cyber-purple/5 shadow-[0_0_20px_rgba(124,58,237,0.05)]' : 'border-white/5 hover:border-cyber-purple/30'}
                                            `}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 flex items-center justify-center font-black text-white/20 group-hover:text-cyber-purple transition-colors italic">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-cyber-cyan transition-colors">{video.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 px-2 py-0.5 border border-white/10 rounded-md">
                                                            {video.source || 'External Node'}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-white/20 italic">
                                                            <Clock size={10} />
                                                            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => handleEditVideo(idx, e)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-cyber-cyan transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteVideo(idx, e)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* Expanded Preview Section */}
                                        <AnimatePresence>
                                            {previewVideoIdx === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 bg-white/[0.02] border-x border-b border-white/5 rounded-b-2xl mb-4 mt-[-1rem] pt-8 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {/* Video Embed */}
                                                            <div className="aspect-video w-full">
                                                                <VideoPlayer
                                                                    url={video.url}
                                                                    className="h-full w-full"
                                                                />
                                                            </div>

                                                            {/* Transcripts */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Activity size={16} className="text-cyber-cyan" />
                                                                    <h5 className="text-sm font-black uppercase tracking-widest text-white/60 italic">Transcripts</h5>
                                                                </div>

                                                                <div className="bg-cyber-black/50 border border-white/5 rounded-xl p-6 min-h-[150px] max-h-[250px] overflow-y-auto custom-scrollbar">
                                                                    {(() => {
                                                                        const trans = video.transcripts?.find(t => t.language === activeLang);
                                                                        return trans?.content ? (
                                                                            <p className="text-sm leading-relaxed text-white/70 italic">
                                                                                {trans.content}
                                                                            </p>
                                                                        ) : (
                                                                            <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
                                                                                <RefreshCcw size={32} className="mb-2" />
                                                                                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Neural Translation</p>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>

                                                                {/* Materials Section */}
                                                                <div className="space-y-3 pt-4 border-t border-white/5">
                                                                    <div className="flex items-center gap-2">
                                                                        <Layers size={16} className="text-cyber-purple" />
                                                                        <h5 className="text-sm font-black uppercase tracking-widest text-white/60 italic">Unit Materials</h5>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                        {video.materials?.length > 0 ? (
                                                                            video.materials.map((material, mIdx) => (
                                                                                <a
                                                                                    key={mIdx}
                                                                                    href={material.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-cyber-purple/40 transition-all group/mat"
                                                                                >
                                                                                    <div className="p-2 bg-cyber-purple/10 rounded-lg text-cyber-purple group-hover/mat:bg-cyber-purple group-hover/mat:text-white transition-colors">
                                                                                        {material.type === 'pdf' ? <FileText size={14} /> : <LinkIcon size={14} />}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-[11px] font-bold text-white truncate">{material.title}</p>
                                                                                        <p className="text-[9px] font-black uppercase tracking-tighter text-white/30 truncate">{material.type}</p>
                                                                                    </div>
                                                                                </a>
                                                                            ))
                                                                        ) : (
                                                                            <p className="text-[10px] font-bold text-white/20 italic col-span-2 py-2">No additional materials available for this unit.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="p-20 text-center opacity-30">
                                    <Video size={48} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-[0.2em]">No Data Units Detected</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {/* Edit Topic Modal */}
                {isEditTopicOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-cyber-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-xl bg-cyber-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Modify <span className="text-cyber-purple">Setup</span></h2>
                                <button onClick={() => setEditTopicOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <Input
                                    label="Topic Title"
                                    value={topicForm.title}
                                    onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">Description</label>
                                    <textarea
                                        className="w-full px-5 py-3 rounded-xl bg-cyber-black border border-white/10 text-white focus:border-cyber-purple outline-none min-h-[120px]"
                                        value={topicForm.description}
                                        onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">Category</label>
                                    <select
                                        className="w-full px-5 py-3 rounded-xl bg-cyber-black border border-white/10 text-white focus:border-cyber-purple outline-none"
                                        value={topicForm.category}
                                        onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
                                    >
                                        <option value="phishing">Phishing</option>
                                        <option value="smishing">Smishing</option>
                                        <option value="vishing">Vishing</option>
                                        <option value="qr">QR Code</option>
                                        <option value="social_engineering">Social Engineering</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setEditTopicOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateTopic} loading={saving}>
                                    <Save size={18} className="mr-2" /> Commit Setup
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Add/Edit Video Modal */}
                {(isAddVideoOpen || isEditVideoOpen) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-cyber-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-xl bg-cyber-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                    {isAddVideoOpen ? 'Deploy' : 'Refine'} <span className="text-cyber-cyan">Video Unit</span>
                                </h2>
                                <button onClick={() => { setAddVideoOpen(false); setEditVideoOpen(false); }} className="text-white/40 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <Input
                                    label="Unit Title"
                                    value={videoForm.title}
                                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Secure Node (Provider)"
                                        placeholder="Internal Station, CISA, etc."
                                        value={videoForm.source}
                                        onChange={(e) => setVideoForm({ ...videoForm, source: e.target.value })}
                                    />
                                    <Input
                                        label="Duration (Calculated Seconds)"
                                        type="number"
                                        value={videoForm.duration}
                                        readOnly
                                        className="bg-white/5 opacity-70"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">Video Summary</label>
                                    <textarea
                                        className="w-full px-5 py-3 rounded-xl bg-cyber-black border border-white/10 text-white focus:border-cyber-purple outline-none min-h-[80px]"
                                        value={videoForm.summary}
                                        placeholder="Enter a brief summary of the video content..."
                                        onChange={(e) => setVideoForm({ ...videoForm, summary: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">Uplink Media (Max 1GB)</label>
                                        {uploading && <span className="text-[10px] font-black text-cyber-purple animate-pulse">UPLOADING: {uploadProgress}%</span>}
                                    </div>
                                    <div
                                        className="relative group/upload"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-cyber-purple', 'bg-cyber-purple/10');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-cyber-purple', 'bg-cyber-purple/10');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-cyber-purple', 'bg-cyber-purple/10');
                                            const file = e.dataTransfer.files[0];
                                            if (file && file.type.startsWith('video/')) {
                                                const event = { target: { files: [file] } };
                                                handleVideoUpload(event);
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                            id="video-upload-input"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="video-upload-input"
                                            className={`
                                                w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                                ${uploading ? 'bg-cyber-purple/5 border-cyber-purple/30' : 'bg-white/[0.02] border-white/10 hover:border-cyber-purple/40 hover:bg-white/[0.04]'}
                                            `}
                                        >
                                            <Video size={32} className={`mb-3 ${uploading ? 'text-cyber-purple animate-spin' : 'text-white/20'}`} />
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                                                {uploading ? 'Processing Data Stream...' : 'Drop Video File or Click to Browse'}
                                            </span>
                                            <span className="text-[10px] text-white/30 mt-1 font-mono">Supports MP4, WebM, Ogg (Max 1GB)</span>
                                        </label>

                                        {uploadProgress > 0 && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-cyber-purple shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Input
                                    label="Direct Access URL / Pointer"
                                    value={videoForm.url}
                                    placeholder="/uploads/videos/myfile.mp4"
                                    onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                                />

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Neural Transcripts</h5>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleAutoTranslate}
                                                className="text-[10px] font-black uppercase tracking-widest text-cyber-purple hover:text-white transition-colors flex items-center gap-2"
                                                title="Copy English transcript to all languages"
                                            >
                                                <Sparkles size={12} /> Auto-Translate All
                                            </button>
                                            <div className="h-3 w-px bg-white/10"></div>
                                            <button
                                                onClick={handleAddTranscriptLang}
                                                className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Plus size={12} /> Add Language
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {videoForm.transcripts.map((t, idx) => (
                                            <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 relative group/transcript">
                                                <div className="flex items-center justify-between gap-4">
                                                    <select
                                                        className="bg-cyber-black text-xs font-bold text-white border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-cyber-purple"
                                                        value={t.language}
                                                        onChange={(e) => updateTranscriptLang(idx, e.target.value)}
                                                    >
                                                        {languages?.map(l => (
                                                            <option key={l.code} value={l.code}>{l.icon} {l.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => removeTranscript(idx)}
                                                        className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover/transcript:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <textarea
                                                    className="w-full bg-cyber-black/50 border border-white/10 rounded-xl p-3 text-xs text-white/70 outline-none focus:border-cyber-purple min-h-[80px]"
                                                    placeholder={`Neural data in ${languages.find(l => l.code === t.language)?.name}...`}
                                                    value={t.content}
                                                    onChange={(e) => updateTranscript(idx, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Materials Management */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Unit Materials</h5>
                                        <button
                                            onClick={handleAddMaterial}
                                            className="text-[10px] font-black uppercase tracking-widest text-cyber-purple hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={12} /> Add Material
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {videoForm.materials.map((m, idx) => (
                                            <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 gap-4 relative group/material">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex flex-1 gap-4">
                                                        <div className="w-1/3">
                                                            <Input
                                                                placeholder="Material Title"
                                                                value={m.title}
                                                                onChange={(e) => updateMaterial(idx, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Input
                                                                placeholder="Resource URL"
                                                                value={m.url}
                                                                onChange={(e) => updateMaterial(idx, 'url', e.target.value)}
                                                            />
                                                        </div>
                                                        <select
                                                            className="bg-cyber-black text-xs font-bold text-white border border-white/10 rounded-lg px-2 outline-none focus:border-cyber-purple h-[42px]"
                                                            value={m.type}
                                                            onChange={(e) => updateMaterial(idx, 'type', e.target.value)}
                                                        >
                                                            <option value="link">Link</option>
                                                            <option value="pdf">PDF Document</option>
                                                            <option value="document">Office Doc</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => removeMaterial(idx)}
                                                        className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover/material:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => { setAddVideoOpen(false); setEditVideoOpen(false); }}>Discard</Button>
                                <Button
                                    onClick={isAddVideoOpen ? handleAddVideo : handleUpdateVideo}
                                    loading={saving}
                                    variant="cyan"
                                >
                                    <Save size={18} className="mr-2" /> {isAddVideoOpen ? 'Initialize Unit' : 'Update Unit'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
