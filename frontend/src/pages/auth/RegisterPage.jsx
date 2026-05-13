import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input, Badge } from '../../components/ui';
import { Mail, Lock, User, AlertCircle, ShieldPlus, CheckCircle, Fingerprint, Shield, Cpu, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Animated Components (Matching HomePage) ---

const MouseFollower = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <motion.div 
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
            animate={{ x: mousePos.x, y: mousePos.y }}
            transition={{ type: "spring", damping: 35, stiffness: 150, mass: 0.5 }}
        >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10  rounded-full opacity-60" />
        </motion.div>
    );
};

const RevealText = ({ text, className = "", delay = 0 }) => {
    const words = text.split(" ");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay + 0.04 * i },
        }),
    };
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };
    return (
        <motion.div
            style={{ display: "flex", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} style={{ marginRight: "0.25em" }}>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const LightOrb = ({ x = "50%", y = "50%", color = "emerald", size = "600px", delay = 0 }) => {
    const colors = {
        emerald: "bg-emerald-500/15",
        lime: "bg-lime-500/10",
        silver: "bg-slate-500/10",
    };
    return (
        <motion.div
            animate={{ 
                x: ["-10%", "10%", "-10%"],
                y: ["-5%", "5%", "-5%"],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, delay, ease: "easeInOut" }}
            className={`absolute ${colors[color] || colors.emerald} rounded-full  pointer-events-none z-0`}
            style={{ left: x, top: y, width: size, height: size, transform: "translate(-50%, -50%)" }}
        />
    );
};

const FloatingShard = ({ delay = 0, x = "0%", y = "0%", size = "100px", color = "emerald", rotateStart = 0 }) => {
    const colorMap = {
        emerald: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        lime: "bg-lime-500/10 border-lime-500/20 shadow-[0_0_20px_rgba(163,230,53,0.1)]",
        silver: "bg-slate-400/10 border-slate-400/20 shadow-[0_0_20px_rgba(148,163,184,0.1)]",
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: rotateStart }}
            animate={{ 
                opacity: [0.08, 0.2, 0.08],
                scale: [1, 1.1, 1],
                y: ["0px", "-40px", "0px"],
                rotate: [rotateStart, rotateStart + 45, rotateStart]
            }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay, ease: "easeInOut" }}
            className={`absolute ${colorMap[color]} border  rounded-[2.5rem] z-0 pointer-events-none`}
            style={{ left: x, top: y, width: size, height: size }}
        />
    );
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedPlan = queryParams.get('plan');
    const { register, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner',
    });

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            navigate('/login', {
                state: { message: 'Registration successful! Node initialized.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-black overflow-hidden font-sans">
            <MouseFollower />
            
            {/* --- GRAPHITE obsidian BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#0A0A0A] to-[#1C1C1C]" />
                
                <LightOrb x="10%" y="15%" color="emerald" size="800px" delay={0} />
                <LightOrb x="90%" y="25%" color="lime" size="600px" delay={3} />
                <LightOrb x="40%" y="80%" color="silver" size="900px" delay={5} />

                <motion.div 
                    animate={{ opacity: [0.01, 0.02, 0.01] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" 
                />

                <FloatingShard x="5%" y="20%" size="200px" color="emerald" delay={0} rotateStart={15} />
                <FloatingShard x="88%" y="15%" size="160px" color="silver" delay={3} rotateStart={-20} />
                <FloatingShard x="15%" y="75%" size="180px" color="lime" delay={6} rotateStart={45} />
            </div>

            {/* Header / Logo */}
            <div className="fixed top-12 left-12 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all duration-500">
                        <Shield className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">
                        AntiPhish<span className="text-emerald-400">X</span>
                    </span>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-[1200px] grid lg:grid-cols-2 gap-20 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block space-y-12"
                >
                    <div className="space-y-8">
                        <Badge className="bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-full">Identity Provisioning</Badge>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] uppercase">
                            <RevealText text="CREATE YOUR" />
                            <motion.span 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 pb-2 block"
                            >
                                IDENTITY NODE.
                            </motion.span>
                        </h1>
                        <p className="text-white/30 text-xl font-medium leading-relaxed max-w-md">
                            Join the global resilience network. Provision your account to access enterprise-grade simulations and intelligence.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <FeatureBox icon={Fingerprint} label="ARGON2ID HASHING" />
                        <FeatureBox icon={Cpu} label="SCIM COMPLIANT" />
                    </div>
                </motion.div>

                {/* Register Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <div className="p-10 lg:p-14 rounded-[4rem] bg-[#111111]/40 border border-white/5  shadow-2xl relative overflow-hidden group">
                        <motion.div 
                            className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 10, repeat: Infinity }}
                        />
                        
                        <div className="relative z-10">
                            <div className="mb-10 space-y-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white/90">
                                        Initialize Node
                                    </h2>
                                    {selectedPlan && (
                                        <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1">
                                            {selectedPlan} PLAN SELECTED
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-white/20 text-sm font-medium">
                                    {selectedPlan 
                                        ? `You are provisioning a ${selectedPlan.toUpperCase()} level node. Define your credentials to begin.`
                                        : "Define your credentials to begin identity provisioning."
                                    }
                                </p>
                            </div>

                            {error && (
                                <div className="mb-8 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-4">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-emerald-400 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First"
                                            className="w-full h-16 pl-14 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last"
                                            className="w-full h-16 px-6 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative group/input">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-emerald-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="identity@enterprise.com"
                                        className="w-full h-16 pl-14 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04] transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-lime-400 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="w-full h-16 pl-14 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-lime-500/30 focus:bg-white/[0.04] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm"
                                            className="w-full h-16 px-6 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-lime-500/30 focus:bg-white/[0.04] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">
                                        Identity Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full h-16 px-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500/30 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="learner">Learner (Agent)</option>
                                        <option value="instructor">Instructor (Lead)</option>
                                        <option value="admin">Admin (Command Core)</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-18 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-black hover:scale-[1.02] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all duration-500 mt-4 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                                    loading={loading}
                                >
                                    Initialize Node Sequence
                                </Button>

                                <div className="text-center pt-6">
                                    <div className="text-[10px] font-bold text-white/10 tracking-[0.2em]">
                                        EXISTING IDENTITY? <Link to="/login" className="text-emerald-400 hover:underline underline-offset-8 ml-2">AUTHENTICATE</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function FeatureBox({ icon: Icon, label }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5  flex flex-col gap-6 items-start group hover:border-emerald-500/30 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-500">
                <Icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{label}</span>
        </div>
    );
}

