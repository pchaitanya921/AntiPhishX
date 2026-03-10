import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, Spinner } from '../components/ui';
import { BookOpen, Search, Filter, Shield, Clock, Award, AlertCircle, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';

export default function CoursesPage() {
    const navigate = useNavigate();
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
            setError('Failed to connect to Command Core. Please verify your uplink.');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        (course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCourseIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'phishing': return '🛡️';
            case 'smishing': return '📱';
            case 'vishing': return '📞';
            case 'qr': return '🏁';
            case 'social_engineering': return '🧠';
            default: return '📚';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tighter italic text-white">Course <span className="text-cyber-purple">Archive</span></h1>
                    <p className="text-white/60 font-bold tracking-tight uppercase text-xs">Access authorized training modules</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                    <Input
                        icon={Search}
                        placeholder="Search training node..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="secondary" className="flex items-center gap-2" onClick={fetchCourses}>
                    <Filter size={18} />
                    Refresh Node
                </Button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Spinner size="lg" variant="purple" />
                    <p className="text-cyber-purple font-black uppercase text-[10px] animate-pulse">Syncing Archive Database...</p>
                </div>
            ) : error ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-red-500">
                    <AlertCircle size={48} />
                    <p className="font-black uppercase text-xs tracking-widest">{error}</p>
                    <Button variant="danger" onClick={fetchCourses} className="h-10 px-6 uppercase text-[10px]">Retry Uplink</Button>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-40">
                    <Shield size={48} className="text-cyber-gray" />
                    <p className="font-black uppercase text-xs tracking-widest text-cyber-gray">No training nodes found in current sector</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card
                            key={course._id}
                            hover
                            className="overflow-hidden flex flex-col group border border-white/10 hover:border-cyber-purple/50 bg-[#0f0c29]"
                            style={{
                                background: 'linear-gradient(145deg, #2a0845 0%, #0f0c29 100%)',
                                boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
                            }}
                        >
                            <div className="h-48 flex items-center justify-center relative overflow-hidden p-4">
                                {course.thumbnail && (course.thumbnail.startsWith('/') || course.thumbnail.startsWith('http')) ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                    />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
                                        <span className="relative z-10 text-6xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{getCourseIcon(course.category)}</span>
                                    </>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Badge variant="cyan" className="bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30">
                                        Multi-Level
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-black mb-2 group-hover:text-cyber-purple transition-colors text-white uppercase tracking-wider drop-shadow-md">
                                    {course.title}
                                </h3>
                                <p className="text-xs text-white/70 mb-6 line-clamp-2 px-2">
                                    {course.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} className="text-cyber-purple" />
                                        {course.estimatedDuration || 0}m
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BookOpen size={12} className="text-cyber-cyan" />
                                        {course.modules?.length || 0} Levels
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Video size={12} className="text-cyber-purple" />
                                        {course.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0} Videos
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full h-10 mt-4 uppercase text-[10px] tracking-[0.2em] bg-cyber-purple hover:bg-cyber-purple/80 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                    onClick={() => navigate(`/courses/${course._id}`)}
                                >
                                    Initialize Course
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
