import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';
import { Shield, Target, Award, Lock, CheckCircle2, Globe, Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Military-grade authentication with MFA and device controls.',
            color: 'purple',
            link: '/dashboard'
        },
        {
            icon: Target,
            title: 'Realistic Simulations',
            description: 'Safe phishing, smishing, and vishing simulations.',
            color: 'cyan',
            link: '/labs'
        },
        {
            icon: Award,
            title: 'Get Certified',
            description: 'Industry-recognized certifications with verification.',
            color: 'purple',
            link: '/achievements'
        },
        {
            icon: Lock,
            title: 'Zero Trust Labs',
            description: 'No real payloads. Fully controlled training environment.',
            color: 'cyan',
            link: '/labs'
        },
    ];

    return (
        <div className="py-24 px-8 flex flex-col items-center">
            <div className="relative z-10 w-full max-w-6xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-24">
                    {/* Floating Branding Image / Shield */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="relative mb-12">
                        <div className="absolute inset-0 bg-cyber-purple/60 blur-[60px] animate-pulse" />
                        <div className="relative p-7 glass-panel border-cyber-purple/40 bg-cyber-purple/20 animate-float">
                            <Shield className="w-20 h-20 text-cyber-purple" />
                        </div>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-black mb-6 italic tracking-tighter text-white">
                        AntiPhish<span className="cyber-gradient-text">X</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.3em] text-white/40 mb-10">
                        AI-Powered Cybersecurity Training Platform
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        <div className="flex items-center gap-2 px-4 py-2 glass-panel border-white/5 bg-white/[0.03]">
                            <div className="w-2 h-2 rounded-full bg-cyber-purple shadow-cyber-glow" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">Phishing</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 glass-panel border-white/5 bg-white/[0.03]">
                            <div className="w-2 h-2 rounded-full bg-[#fcd34d] shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
                            <span className="text-xs font-black uppercase tracking-widest text-[#fcd34d]">Smishing</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 glass-panel border-white/5 bg-white/[0.03]">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            <span className="text-xs font-black uppercase tracking-widest text-cyber-cyan">Vishing</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 glass-panel border-white/5 bg-white/[0.03]">
                            <div className="w-2 h-2 rounded-full bg-[#fca5a5] shadow-[0_0_10px_rgba(252,165,165,0.5)]" />
                            <span className="text-xs font-black uppercase tracking-widest text-[#fca5a5]">Social Engineering</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8">
                        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-80 h-16 text-xs font-black uppercase tracking-[0.3em] bg-gradient-to-r from-cyber-purple to-cyber-purple/80 shadow-cyber-glow flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300"
                            >
                                Get Started
                            </motion.div>
                        </Link>
                        <Link to={isAuthenticated ? "/courses" : "/register"}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-80 h-16 text-xs font-black uppercase tracking-[0.3em] border border-white/10 hover:bg-white/5 bg-white/5 backdrop-blur-md text-white flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300"
                            >
                                Explore Courses
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Row (Matches Image Grid style) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            to={isAuthenticated ? feature.link : "/login"}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <Card
                                    hover
                                    className={`p-10 h-full glass-card border-white/5 flex flex-col items-center text-center group ${feature.color === 'cyan' ? 'hover:border-cyber-cyan/30' : 'hover:border-cyber-purple/30'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 group-hover:bg-white/5 transition-all ${feature.color === 'cyan' ? 'text-cyber-cyan' : 'text-cyber-purple'
                                        }`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-4 text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/40 text-[11px] font-bold leading-relaxed uppercase tracking-wide">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Developed By Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mb-32"
                >
                    {/* Major Project Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Major Project</span>
                        </div>
                    </div>

                    {/* Developed By Title */}
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-white">
                        Developed By
                    </h2>

                    {/* Developer Cards */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="p-8 rounded-2xl backdrop-blur-[25px] bg-white/[0.04] border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-white/[0.08] transition-all group shadow-[0_4px_24px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(34,211,238,0.2)] hover:scale-[1.02]"
                        >
                            <h3 className="text-xl font-bold text-cyan-400 text-center mb-2">
                                LAKSHMI CHAITANYA SAI
                            </h3>
                            <p className="text-slate-400 text-sm text-center">
                                Computer Science & Engineering
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="p-8 rounded-2xl backdrop-blur-[25px] bg-white/[0.04] border border-green-500/30 hover:border-green-500/50 hover:bg-white/[0.08] transition-all group shadow-[0_4px_24px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.2)] hover:scale-[1.02]"
                        >
                            <h3 className="text-xl font-bold text-green-400 text-center mb-2">
                                VENKATA JESHWANTH
                            </h3>
                            <p className="text-slate-400 text-sm text-center">
                                Computer Science & Engineering
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            className="p-8 rounded-2xl backdrop-blur-[25px] bg-white/[0.04] border border-purple-500/30 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all group shadow-[0_4px_24px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] hover:scale-[1.02]"
                        >
                            <h3 className="text-xl font-bold text-purple-400 text-center mb-2">
                                PAVAN KUMAR
                            </h3>
                            <p className="text-slate-400 text-sm text-center">
                                Computer Science & Engineering
                            </p>
                        </motion.div>
                    </div>

                    {/* University Name */}
                    <div className="flex items-center justify-center gap-2 text-white">
                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                        <span className="text-lg font-semibold">Veltech University</span>
                    </div>
                </motion.div>

                {/* Status Ticker Footer */}
                <div className="pt-12 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-8 py-12">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-cyber-purple" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                            System Node: AUTHORIZED ACCESS ONLY
                        </span>
                    </div>
                    <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network: ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure: ENCRYPTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
