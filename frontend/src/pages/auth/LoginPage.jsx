import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input, Badge } from '../../components/ui';
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    Eye,
    EyeOff,
    BookOpen,
    HelpCircle,
    Award,
    Shield,
    ArrowRight,
    Fingerprint,
    Cpu,
    Sparkles,
    BrainCircuit,
    MousePointer2,
    Terminal,
    Activity,
    LockIcon,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Animated Components ---

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
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10  rounded-full opacity-40" />
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
        emerald: "bg-emerald-500/20",
        lime: "bg-lime-500/15",
        silver: "bg-slate-400/10",
    };
    return (
        <motion.div
            animate={{ 
                x: ["-10%", "10%", "-10%"],
                y: ["-5%", "5%", "-5%"],
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, delay, ease: "easeInOut" }}
            className={`absolute ${colors[color] || colors.emerald} rounded-full  pointer-events-none z-0`}
            style={{ left: x, top: y, width: size, height: size, transform: "translate(-50%, -50%)" }}
        />
    );
};

const FloatingShard = ({ delay = 0, x = "0%", y = "0%", size = "100px", color = "emerald", rotateStart = 0 }) => {
    const colorMap = {
        emerald: "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]",
        lime: "bg-lime-500/10 border-lime-500/30 shadow-[0_0_30px_rgba(163,230,53,0.15)]",
        silver: "bg-slate-400/10 border-slate-400/30 shadow-[0_0_30px_rgba(148,163,184,0.15)]",
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: rotateStart }}
            animate={{ 
                opacity: [0.1, 0.25, 0.1],
                scale: [1, 1.15, 1],
                y: ["0px", "-60px", "0px"],
                rotate: [rotateStart, rotateStart + 90, rotateStart]
            }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, delay, ease: "easeInOut" }}
            className={`absolute ${colorMap[color]} border  rounded-[3rem] z-0 pointer-events-none`}
            style={{ left: x, top: y, width: size, height: size }}
        />
    );
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [ssoMode, setSsoMode] = useState(false);
    const [ssoDomain, setSsoDomain] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [nodeStatus, setNodeStatus] = useState('ACTIVE');

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard', { replace: true });
        const interval = setInterval(() => {
            setNodeStatus(prev => prev === 'ACTIVE' ? 'SYNCHING' : 'ACTIVE');
        }, 8000);
        return () => clearInterval(interval);
    }, [isAuthenticated, navigate]);

    const successMessage = location.state?.message;

    const handleSsoSubmit = async (e) => {
        e.preventDefault();
        if (!ssoDomain) {
            setError('Please enter your corporate domain.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Redirect to backend SSO initiator
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/login?domain=${ssoDomain}`;
        } catch (err) {
            setError('SSO Gateway unreachable.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password, 'learner');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Node authentication failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-black overflow-hidden font-sans">
            <MouseFollower />
            
            {/* --- CINEMATIC obsidian BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#0A0A0A] to-[#121212]" />
                
                <LightOrb x="15%" y="15%" color="emerald" size="1000px" delay={0} />
                <LightOrb x="85%" y="20%" color="lime" size="700px" delay={5} />
                <LightOrb x="50%" y="85%" color="silver" size="1200px" delay={10} />

                {/* Animated Cyber Grid */}
                <motion.div 
                    animate={{ 
                        opacity: [0.01, 0.03, 0.01],
                        y: ["0%", "5%", "0%"]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-cyber-grid opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" 
                />

                <FloatingShard x="2%" y="10%" size="240px" color="emerald" delay={0} rotateStart={15} />
                <FloatingShard x="90%" y="5%" size="180px" color="silver" delay={4} rotateStart={-10} />
                <FloatingShard x="8%" y="70%" size="220px" color="lime" delay={8} rotateStart={-45} />
            </div>

            {/* Header / Brand */}
            <div className="fixed top-12 left-12 z-50">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20  rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all duration-700 relative z-10 ">
                            <Shield className="w-7 h-7 text-white group-hover:text-emerald-400 transition-colors" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                            AntiPhish<span className="text-emerald-400">X</span>
                        </span>
                        <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mt-1">Command Core</span>
                    </div>
                </Link>
            </div>

            {/* Live Telemetry Bar */}
            <div className="fixed bottom-12 left-12 z-50 hidden xl:flex items-center gap-10">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Node Status: <span className="text-emerald-400">{nodeStatus}</span></span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-4">
                    <Globe size={14} className="text-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Latency: <span className="text-white/60">14ms</span></span>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] grid lg:grid-cols-2 gap-32 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:block space-y-16"
                >
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Badge className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase tracking-[0.5em] px-7 py-3 rounded-full  shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                                Secure Protocol 7.2
                            </Badge>
                        </motion.div>
                        
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] uppercase">
                            <RevealText text="ACCESS THE" delay={0.4} />
                            <motion.span 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 pb-4 block filter drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                INTELLIGENCE
                            </motion.span>
                        </h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-white/30 text-2xl font-medium leading-relaxed max-w-lg"
                        >
                            Establish a secure handshake with the organization's human-risk neural node.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <FeatureBox 
                            icon={Fingerprint} 
                            label="BIOMETRIC READY" 
                            status="ACTIVE" 
                            delay={1.2}
                        />
                        <FeatureBox 
                            icon={BrainCircuit} 
                            label="AI ORCHESTRATED" 
                            status="MONITORING" 
                            delay={1.4}
                        />
                    </div>
                </motion.div>

                {/* Login Form Container */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full relative"
                >
                    {/* Background Glow behind the card */}
                    <div className="absolute -inset-10 bg-emerald-500/5  rounded-full opacity-50 pointer-events-none" />
                    
                    <div className="p-12 lg:p-20 rounded-[5rem] bg-[#111111]/60 border border-white/10  shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                        {/* Internal Animated Gradient */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-lime-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                            animate={{ 
                                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                            }}
                            transition={{ duration: 15, repeat: Infinity }}
                        />
                        
                        <div className="relative z-10">
                            <div className="mb-16 space-y-4">
                                <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">
                                    {ssoMode ? 'Enterprise SSO' : 'Initialize Session'}
                                </h2>
                                <p className="text-white/20 text-lg font-medium">
                                    {ssoMode ? 'Establish corporate handshake.' : 'Verify node access credentials.'}
                                </p>
                            </div>

                            {successMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10 p-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-widest flex items-center gap-5"
                                >
                                    <CheckCircle2 size={24} /> {successMessage}
                                </motion.div>
                            )}

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10 p-6 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-black uppercase tracking-widest flex items-center gap-5"
                                >
                                    <AlertCircle size={24} /> {error}
                                </motion.div>
                            )}

                            <form onSubmit={ssoMode ? handleSsoSubmit : handleSubmit} className="space-y-10">
                                <div className="space-y-6">
                                    <div className="relative group/input">
                                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-emerald-400 transition-colors">
                                            <Mail size={24} />
                                        </div>
                                        <input
                                            type="text"
                                            value={ssoMode ? ssoDomain : formData.email}
                                            onChange={(e) => ssoMode ? setSsoDomain(e.target.value) : setFormData({...formData, email: e.target.value})}
                                            placeholder={ssoMode ? "company.com" : "identity@enterprise.com"}
                                            className="w-full h-20 pl-20 pr-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] text-xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
                                        />
                                    </div>

                                    {!ssoMode && (
                                        <div className="relative group/input">
                                            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-lime-400 transition-colors">
                                                <LockIcon size={24} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                placeholder="••••••••"
                                                className="w-full h-20 pl-20 pr-20 bg-white/[0.03] border border-white/5 rounded-[2.5rem] text-xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-lime-500/40 focus:bg-white/[0.06] transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className={`w-full h-20 rounded-full font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl transition-all duration-700 ${ssoMode ? 'bg-emerald-500 text-black hover:bg-white' : 'bg-gradient-to-r from-emerald-500 to-lime-400 text-black hover:scale-[1.03] shadow-[0_20px_50px_rgba(16,185,129,0.3)]'}`}
                                    loading={loading}
                                >
                                    {ssoMode ? 'Establish SSO Handshake' : 'Initialize Secure Session'}
                                </Button>

                                <div className="flex flex-col gap-8 pt-8 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setSsoMode(!ssoMode)}
                                        className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-emerald-400 transition-colors flex items-center gap-3"
                                    >
                                        <Terminal size={14} />
                                        {ssoMode ? 'Switch to Standard Access' : 'Enterprise SSO Gateway'}
                                    </button>
                                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/10">
                                        <span>No Node Identity?</span>
                                        <Link to="/register" className="text-emerald-400 hover:text-lime-300 transition-colors border-b border-emerald-500/30 pb-1">
                                            Register Node
                                        </Link>
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

function FeatureBox({ icon: Icon, label, status, delay = 0 }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5  flex flex-col gap-8 items-start group hover:border-emerald-500/40 transition-all duration-700"
        >
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-700 relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500  animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon size={32} />
            </div>
            <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors block">{label}</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                    <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">{status}</span>
                </div>
            </div>
        </motion.div>
    );
}

