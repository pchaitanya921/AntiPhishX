import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Award,
    MessageSquare,
    Plus,
    BarChart3,
    Clock,
    Play,
    ChevronRight,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { instructorAPI } from '../services/api';

const SAMPLE_INSTRUCTOR_DATA = {
    stats: {
        totalCourses: 7,
        totalEnrollments: 1209,
        avgPassRate: 87,
        engagementRate: 74,
        pendingLabs: 12,
    },
    myCourses: [
        { _id: 'c1', title: 'Email Phishing Detection Fundamentals', level: 'Beginner', chapters: Array(8), enrollmentsCount: 342, published: true },
        { _id: 'c2', title: 'Social Engineering & Vishing Tactics', level: 'Intermediate', chapters: Array(6), enrollmentsCount: 218, published: true },
        { _id: 'c3', title: 'Advanced Malware & Ransomware Analysis', level: 'Advanced', chapters: Array(10), enrollmentsCount: 127, published: true },
        { _id: 'c4', title: 'QR Code & Smishing Attack Scenarios', level: 'Intermediate', chapters: Array(5), enrollmentsCount: 189, published: true },
        { _id: 'c5', title: 'Business Email Compromise (BEC)', level: 'Advanced', chapters: Array(7), enrollmentsCount: 94, published: false },
    ]
};

export default function InstructorDashboard() {
    const { user } = useAuth();
    const [data] = useState(SAMPLE_INSTRUCTOR_DATA);
    const [loading] = useState(false);



    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Instructor Node...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Instructor Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Instructor <span className="text-cyber-purple">Portal</span>: Lead {user?.firstName}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Lead Cyber Security Training Operations
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="primary" className="h-12 px-6 flex items-center gap-2">
                        <Plus size={18} /> Create Course
                    </Button>
                </div>
            </div>

            {/* Content & Learner Stats */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* My Courses Widget */}
                <Card className="lg:col-span-8 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic flex items-center gap-3">
                            <BookOpen size={20} className="text-cyber-purple" />
                            Curriculum Overview
                        </h3>
                        <Badge variant="info">{data?.stats?.totalCourses || 0} Total Courses</Badge>
                    </div>

                    <div className="space-y-4">
                        {(data?.myCourses || []).slice(0, 3).map((course) => (
                            <div key={course._id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 rounded-xl bg-cyber-purple/10 text-cyber-purple">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black italic uppercase tracking-tight text-sm mb-1">{course.title}</h4>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span>{course.level} Target</span>
                                            <span>{course.chapters?.length || 0} Modules</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs font-black italic">{course.enrollmentsCount || 0} enrolled</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-green-400">
                                            {course.published ? 'Live' : 'Draft'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `/instructor/courses/${course._id}`}
                                        className="p-2 rounded-lg bg-white/5 text-white/20 group-hover:bg-cyber-purple group-hover:text-white transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {(data?.myCourses || []).length > 0 && (
                            <Button
                                variant="outline"
                                className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em]"
                                onClick={() => window.location.href = '/instructor/courses'}
                            >
                                View All High-Value Curriculum
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Learner Performance Widget */}
                <Card className="lg:col-span-4 p-8">
                    <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                        <BarChart3 size={20} className="text-green-400" />
                        Lead Metrics
                    </h3>
                    <div className="space-y-8">
                        <div className="text-center p-6 rounded-3xl bg-green-400/5 border border-green-400/10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-green-400/60 mb-2">Average Pass Rate</div>
                            <div className="text-5xl font-black italic text-green-400">{data?.stats?.avgPassRate || 0}%</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Engagement Rate</span>
                                <span className="text-green-400">+{data?.stats?.engagementRate || 0}%</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Pending Reviews</span>
                                <span className="text-white">{data?.stats?.pendingLabs || 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Total Enrollments</span>
                                <span className="text-cyber-purple">{data?.stats?.totalEnrollments || 0}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
