import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Award,
    Clock,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Mail,
    ChevronRight
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { instructorAPI, courseAPI } from '../../services/api';

export default function InstructorCourseDetailsPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [learners, setLearners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [courseRes, learnersRes] = await Promise.all([
                    courseAPI.getById(id),
                    instructorAPI.getCourseLearners(id)
                ]);
                setCourse(courseRes.data.course);
                setLearners(learnersRes.data.learners || []);
            } catch (err) {
                console.error('Failed to fetch node telemetry:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Filtering Learner Data Stream...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Nav */}
            <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
                <ArrowLeft size={14} /> Back to Curriculum
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant="info">NODE SECTOR: {course?.category?.toUpperCase()}</Badge>
                        <Badge variant="outline">{course?.level?.toUpperCase()}</Badge>
                    </div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic uppercase">
                        {course?.title}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs max-w-2xl">
                        {course?.description}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Card className="p-4 bg-white/[0.02] border-white/5 text-center px-8">
                        <div className="text-2xl font-black italic">{learners.length}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Population</div>
                    </Card>
                    <Card className="p-4 bg-white/[0.02] border-white/5 text-center px-8">
                        <div className="text-2xl font-black italic text-green-400">
                            {learners.filter(l => l.isCompleted).length}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Success Rate</div>
                    </Card>
                </div>
            </div>

            {/* Learners Table/List */}
            <div className="space-y-6">
                <h3 className="text-xl font-black italic flex items-center gap-3 mb-6">
                    <Users size={20} className="text-cyber-purple" />
                    Personnel Progress Tracking
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {learners.length > 0 ? (
                        learners.map((progress) => (
                            <Card key={progress._id} className="p-6 bg-white/[0.01] border-white/5 hover:border-white/10 transition-all">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-12 w-12 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-purple font-black">
                                            {progress.userId?.firstName?.[0]}{progress.userId?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black italic uppercase tracking-tight">
                                                {progress.userId?.firstName} {progress.userId?.lastName}
                                            </h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                                                <Mail size={10} /> {progress.userId?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full md:w-64">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Progress</span>
                                            <span className="text-[10px] font-black tracking-widest">{progress.overallProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-cyber-purple transition-all duration-1000"
                                                style={{ width: `${progress.overallProgress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-8 text-center min-w-[200px]">
                                        <div>
                                            <div className="text-sm font-black italic">{progress.completedQuizzes?.length || 0}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Quizzes</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-black italic">{progress.completedLabs?.length || 0}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Labs</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm font-black italic ${progress.isCompleted ? 'text-green-400' : 'text-cyber-purple'}`}>
                                                {progress.isCompleted ? 'RANK S' : 'ACTIVE'}
                                            </div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Status</div>
                                        </div>
                                    </div>

                                    <Button variant="outline" size="icon" className="h-12 w-12 border-white/5">
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 opacity-30">
                            <Users size={48} className="mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">No Active Personnel Registered in Node</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

