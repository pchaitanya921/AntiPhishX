import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Award,
    ChevronRight,
    Plus,
    Filter,
    Search,
    Edit3,
    Eye
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { instructorAPI } from '../../services/api';

export default function InstructorCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await instructorAPI.getMyCourses();
                setCourses(response.data.courses || []);
            } catch (err) {
                console.error('Failed to fetch instructor curriculum:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Accessing Curriculum Node...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Curriculum <span className="text-cyber-purple">Control</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Manage your deployed training sub-systems
                    </p>
                </div>

                <Button variant="primary" className="h-12 px-6 flex items-center gap-2">
                    <Plus size={18} /> Deploy New Course
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH CURRICULUM..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-cyber-purple/50 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="h-12 px-4 flex items-center gap-2 cursor-pointer hover:bg-white/5">
                        <Filter size={14} /> FILTER: ALL
                    </Badge>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Card key={course._id} className="p-0 overflow-hidden group border-white/5 hover:border-cyber-purple/30 transition-all">
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Side Accent */}
                                <div className={`w-2 h-full ${course.published ? 'bg-green-400' : 'bg-cyber-purple/30'}`} />

                                <div className="flex-1 p-8 flex flex-col md:flex-row items-center gap-8">
                                    {/* Icon & Title */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant={course.published ? 'success' : 'outline'}>
                                                {course.published ? 'NODE ONLINE' : 'DRAFT STATE'}
                                            </Badge>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                ID: {course._id.substring(0, 8)}...
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase mb-2 group-hover:text-cyber-purple transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span className="flex items-center gap-2">
                                                <BookOpen size={12} /> {course.chapters?.length || 0} Modules
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Award size={12} /> {course.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats Summary */}
                                    <div className="flex gap-12 text-center">
                                        <div>
                                            <div className="text-2xl font-black italic">{course.enrollmentsCount || 0}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Enrolled</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black italic text-green-400">0</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Completed</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-white/5 hover:bg-cyber-purple hover:text-white"
                                            onClick={() => window.location.href = `/instructor/courses/${course._id}`}
                                        >
                                            <Eye size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-white/5 hover:bg-white/10"
                                        >
                                            <Edit3 size={18} />
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="h-12 px-6 flex items-center gap-2 rounded-xl"
                                            onClick={() => window.location.href = `/instructor/courses/${course._id}`}
                                        >
                                            Manage Node <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="p-20 text-center glass-panel border-white/5 bg-cyber-dark/20 uppercase">
                        <h1 className="text-2xl font-black mb-4">No Curriculum Detected</h1>
                        <p className="text-cyber-gray font-bold tracking-[0.3em] text-[10px]">Your training database is currently empty.</p>
                        <Button variant="primary" className="mt-8 flex items-center gap-2 mx-auto">
                            <Plus size={18} /> Initialize First Node
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
