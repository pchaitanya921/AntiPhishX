import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    Trophy,
    ChevronRight,
    Search,
    Play,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import api from '../services/api';

export default function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await api.get('/courses/my-courses');
            setCourses(response.data.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Accessing Personal Training Archive...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        My <span className="cyber-gradient-text">Training</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Monitor your progress and active certifications
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <Input
                        placeholder="Search my courses..."
                        className="pl-10 h-10 text-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/5 bg-transparent">
                    <div className="mb-6 p-4 rounded-full bg-white/5">
                        <BookOpen size={48} className="text-white/20" />
                    </div>
                    <h2 className="text-xl font-black italic text-white mb-2 uppercase">No Enrolled Courses Found</h2>
                    <p className="text-white/40 mb-8 max-w-sm">You haven't enrolled in any training paths yet. Explore the available courses to begin your security mission.</p>
                    <Button
                        onClick={() => navigate('/courses')}
                        className="bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-bold px-8 h-12"
                    >
                        Explore Course Catalog
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <EnrollmentCard
                            key={course._id}
                            course={course}
                            onClick={() => navigate(`/courses/${course._id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function EnrollmentCard({ course, onClick }) {
    return (
        <Card
            onClick={onClick}
            className="group relative overflow-hidden flex flex-col h-full cursor-pointer hover:border-cyber-cyan/30 transition-all duration-500 hover:-translate-y-1"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={course.thumbnail !== 'no-photo.jpg' ? course.thumbnail : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                    <Badge variant="cyan" className="bg-black/60 ">
                        {course.level}
                    </Badge>
                </div>

                {/* Status Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="p-4 rounded-full bg-cyber-cyan/20  border border-cyber-cyan/40">
                        <Play size={24} className="text-cyber-cyan fill-cyber-cyan" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1 mb-6">
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                        {course.description}
                    </p>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/40">Training Progress</span>
                        <span className={course.progress === 100 ? 'text-green-400' : 'text-cyber-cyan'}>
                            {course.progress || 0}%
                        </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress || 0}%` }}
                            className={`h-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'bg-cyber-cyan shadow-cyber-glow'
                                }`}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {course.duration || 'Auto'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Trophy size={12} /> {course.points || 500}
                            </span>
                        </div>

                        {course.progress === 100 ? (
                            <div className="flex items-center gap-1.5 text-green-400 font-black italic text-[10px] uppercase">
                                <CheckCircle2 size={14} /> Certified
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-cyber-cyan font-black italic text-[10px] uppercase group-hover:translate-x-1 transition-transform">
                                Resume <ChevronRight size={14} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completion Stamp (Optional Aesthetic) */}
            {course.progress === 100 && (
                <div className="absolute -right-8 -top-8 rotate-12 p-8 opacity-10 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                    <CheckCircle2 size={120} className="text-green-400" />
                </div>
            )}
        </Card>
    );
}

