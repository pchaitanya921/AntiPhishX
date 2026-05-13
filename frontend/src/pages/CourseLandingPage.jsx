import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Target, BrainCircuit, Zap, 
    ArrowRight, CheckCircle2, Lock, 
    ShieldCheck, Activity, BarChart3, 
    Users, MessageSquare, Play, 
    ChevronRight, Sparkles, Database,
    Network, Layout, Globe, Award
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const COURSE_CONTENT = {
    'executive-intelligence': {
        title: "EXECUTIVE INTELLIGENCE",
        subtitle: "Strategic Risk Orchestration",
        desc: "Master the art of organizational resilience. This module provides C-level stakeholders with the tools to map, predict, and neutralize human-risk surface through behavioral intelligence.",
        level: "Advanced",
        duration: "15 Hours",
        color: "emerald",
        features: [
            "Executive Risk Dashboards",
            "Board-Level Intelligence Reporting",
            "Predictive Behavioral Modeling",
            "CISO Incident Workflows",
            "Enterprise Compliance Mapping"
        ],
        visual: "analytics",
        realCourseId: "6a03fbece5d062b7423d176e"
    },
    'tactical-defense': {
        title: "TACTICAL DEFENSE",
        subtitle: "Multi-Vector Neutralization",
        desc: "High-intensity technical labs focused on identifying and disrupting spear-phishing, vishing, and smishing campaigns in real-time environments.",
        level: "Intermediate",
        duration: "18 Hours",
        color: "blue",
        features: [
            "Spear-Phishing Identification Labs",
            "Deepfake Audio (Vishing) Analysis",
            "Multi-Vector Attack Simulations",
            "Live Incident Response Scenarios",
            "SOC Pipeline Integration"
        ],
        visual: "labs",
        realCourseId: "6a03fbece5d062b7423d189e"
    },
    'cognitive-security': {
        title: "COGNITIVE SECURITY",
        subtitle: "The Psychology of Phishing",
        desc: "Explore the psychological triggers used by modern threat actors. Learn how to identify urgency, authority, and emotional manipulation patterns.",
        level: "Beginner",
        duration: "12 Hours",
        color: "amber",
        features: [
            "Psychology of Social Engineering",
            "Emotional Manipulation Detection",
            "Behavioral Attack Patterns",
            "Guided Awareness Quizzes",
            "Adaptive Learning Paths"
        ],
        visual: "learning",
        realCourseId: "6a03fbece5d062b7423d19ce"
    },
    'advanced-ai-adaptive': {
        title: "ADVANCED AI ADAPTIVE",
        subtitle: "Neural Threat Neutralization",
        desc: "Master the intersection of AI and Cybersecurity. Defend against autonomous threats and utilize neural networks for predictive defense.",
        level: "Advanced",
        duration: "20 Hours",
        color: "emerald",
        features: [
            "Autonomous Phishing Detection",
            "Neural Behavioral Telemetry",
            "AI-Driven Attack Mapping",
            "Adaptive Threat Orchestration",
            "Neural Roadmap Integration"
        ],
        visual: "ai",
        realCourseId: "6a03fbece5d062b7423d1afe"
    }
};

export default function CourseLandingPage() {
    const { courseSlug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const content = COURSE_CONTENT[courseSlug];

    if (!content) {
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Node Not Found</div>;
    }

    const handleStart = () => {
        if (isAuthenticated) {
            navigate(`/courses/${content.realCourseId}`);
        } else {
            navigate(`/register?plan=core&redirect=/courses/${content.realCourseId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500 selection:text-black overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] opacity-10  rounded-full ${
                    content.color === 'emerald' ? 'bg-emerald-500' : content.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]" />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-20 lg:pt-48 lg:pb-32">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <Badge className={`${
                                        content.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : content.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                                    } border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full`}>
                                        {content.level} Certification Track
                                    </Badge>
                                    <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase">
                                        {content.title.split(' ')[0]} <br/> 
                                        <span className={
                                            content.color === 'emerald' ? 'text-emerald-400' : content.color === 'blue' ? 'text-blue-400' : 'text-amber-400'
                                        }>{content.title.split(' ')[1]}</span>
                                    </h1>
                                    <p className="text-white/40 text-xl font-medium leading-relaxed italic max-w-xl">
                                        {content.desc}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-white/20">
                                    <div className="flex items-center gap-3">
                                        <Play size={16} className="text-white/40" /> {content.duration} CONTENT
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Layout size={16} className="text-white/40" /> 12+ MODULES
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award size={16} className="text-white/40" /> VERIFIED BADGE
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                    <Button 
                                        onClick={handleStart}
                                        className={`h-20 px-12 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${
                                            content.color === 'emerald' ? 'bg-emerald-500 text-black hover:bg-white' : content.color === 'blue' ? 'bg-blue-500 text-white hover:bg-white hover:text-black' : 'bg-amber-500 text-black hover:bg-white'
                                        }`}
                                    >
                                        Initialize Training Sequence <ArrowRight className="ml-4" />
                                    </Button>
                                    <Button variant="outline" className="h-20 px-12 rounded-full border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs">
                                        Download Syllabus
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative"
                            >
                                <div className={`absolute inset-0  opacity-20 rounded-full ${
                                    content.color === 'emerald' ? 'bg-emerald-500' : content.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />
                                <div className="relative p-12 rounded-[4rem] bg-[#111111]/40 border border-white/10  overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ShieldCheck size={300} />
                                    </div>
                                    
                                    <div className="relative z-10 space-y-12">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
                                                content.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : content.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            }`}>
                                                <Zap size={32} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Status</div>
                                                <div className="text-xl font-black italic uppercase text-white">Live Environments Ready</div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Module Coverage</h3>
                                            <div className="grid gap-4">
                                                {content.features.map((feature, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                                        className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                                                    >
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                                            content.color === 'emerald' ? 'border-emerald-500/30 text-emerald-400' : content.color === 'blue' ? 'border-blue-500/30 text-blue-400' : 'border-amber-500/30 text-amber-400'
                                                        }`}>
                                                            <CheckCircle2 size={12} />
                                                        </div>
                                                        <span className="text-sm font-bold text-white/60">{feature}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Interactive Preview Section */}
                <section className="py-32 border-y border-white/5 bg-white/[0.01]">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/2 space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                                        The <span className={
                                            content.color === 'emerald' ? 'text-emerald-400' : content.color === 'blue' ? 'text-blue-400' : 'text-amber-400'
                                        }>Experience.</span>
                                    </h2>
                                    <p className="text-white/30 text-lg font-medium leading-relaxed italic">
                                        AntiPhishX training modules are not passive video courses. They are interactive, narrative-driven experiences that put you inside real attack scenarios.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <ExperienceCard 
                                        icon={Activity} 
                                        title="Live Telemetry" 
                                        desc="Real-time feedback on your simulation performance." 
                                        color={content.color}
                                    />
                                    <ExperienceCard 
                                        icon={Globe} 
                                        title="Global Scenarios" 
                                        desc="Deploy simulations based on global threat patterns." 
                                        color={content.color}
                                    />
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full aspect-video rounded-[3rem] bg-[#111111] border border-white/10 overflow-hidden relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
                                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000"
                                    alt="Learning Interface"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                                            content.color === 'emerald' ? 'bg-emerald-500 text-black shadow-emerald-500/20' : content.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-amber-500 text-black shadow-amber-500/20'
                                        }`}
                                    >
                                        <Play size={32} fill="currentColor" />
                                    </motion.button>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60  border border-white/10 rounded-2xl">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Module Trailer</div>
                                    <div className="text-sm font-bold text-white uppercase italic">Initializing Behavioral Mapping...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-40 text-center">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
                            Ready to Initialize <br/> <span className={
                                content.color === 'emerald' ? 'text-emerald-400' : content.color === 'blue' ? 'text-blue-400' : 'text-amber-400'
                            }>Your Resilience?</span>
                        </h2>
                        <Button 
                            onClick={handleStart}
                            className={`h-24 px-16 rounded-full font-black uppercase tracking-[0.4em] text-xs transition-all shadow-[0_0_80px_rgba(16,185,129,0.2)] ${
                                content.color === 'emerald' ? 'bg-emerald-500 text-black' : content.color === 'blue' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-black'
                            }`}
                        >
                            Provision This Module Now
                        </Button>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest pt-8">
                            Join 12,000+ Agents Building a Safer Human-Layer.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function ExperienceCard({ icon: Icon, title, desc, color }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
                <Icon size={24} />
            </div>
            <h4 className="text-lg font-black italic uppercase tracking-tighter text-white mb-2 group-hover:text-emerald-400 transition-colors">{title}</h4>
            <p className="text-white/30 text-xs font-medium leading-relaxed">{desc}</p>
        </div>
    );
}

