import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';
import { 
    Shield, Target, Award, Lock, CheckCircle2, Globe, Cpu, 
    Zap, Activity, ShieldCheck, BrainCircuit, BarChart3, 
    Network, Users, ArrowRight, MousePointer2, Briefcase,
    Mail, Terminal, Fingerprint, LockKeyhole, Eye, Layers,
    Search, Server, Activity as ActivityIcon, HardDrive,
    MessageSquare, AlertTriangle, ShieldAlert, KeyRound, 
    Database, Radio, Gauge, Boxes, Sparkles, Hexagon,
    BookOpen, Video, GraduationCap, Clock
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import BriefingModal from '../components/enterprise/BriefingModal';
import EnterpriseModal from '../components/enterprise/EnterpriseModal';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

// --- Visual Assets ---
const DASHBOARD_MOCKUP = '/dashboard_mockup_v2.png';

// --- Animated Components ---

const Container = ({ children, className = "" }) => (
    <div className={`max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 ${className}`}>
        {children}
    </div>
);

const MouseFollower = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
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
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    style={{ marginRight: "0.25em", marginBottom: "0.1em" }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const FloatingShard = ({ delay = 0, x = "0%", y = "0%", size = "100px", color = "emerald", rotateStart = 0 }) => {
    const colorMap = {
        emerald: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        lime: "bg-lime-500/10 border-lime-500/20 shadow-[0_0_20px_rgba(163,230,53,0.1)]",
        silver: "bg-slate-400/10 border-slate-400/20 shadow-[0_0_20px_rgba(148,163,184,0.1)]",
        gold: "bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: rotateStart }}
            animate={{ 
                opacity: [0.08, 0.2, 0.08],
                scale: [1, 1.1, 1],
                y: ["0px", "-50px", "0px"],
                rotate: [rotateStart, rotateStart + 45, rotateStart]
            }}
            transition={{ 
                duration: 15 + Math.random() * 10, 
                repeat: Infinity, 
                delay: delay,
                ease: "easeInOut"
            }}
            className={`absolute ${colorMap[color]} border  rounded-[2.5rem] z-0 pointer-events-none`}
            style={{ left: x, top: y, width: size, height: size }}
        />
    );
};

const LightOrb = ({ x = "50%", y = "50%", color = "emerald", size = "600px", delay = 0 }) => {
    const colors = {
        emerald: "bg-emerald-500/15",
        lime: "bg-lime-500/10",
        silver: "bg-slate-500/10",
        aqua: "bg-aqua-500/10",
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

export default function HomePage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isBriefingOpen, setIsBriefingOpen] = useState(false);
    const [enterpriseModal, setEnterpriseModal] = useState({ isOpen: false, type: 'pilot' });
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');

    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.3]);
    const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (planId, planName, cycle = 'monthly') => {
        if (!isAuthenticated) {
            toast.error('Identity required. Please initialize session.');
            navigate('/login');
            return;
        }

        setLoadingPlan(planId);
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Check uplink.');
                return;
            }

            const orderRes = await paymentAPI.createOrder(planId, cycle);
            if (!orderRes.data.success) throw new Error('Order synthesis failed');

            const { order } = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: "AntiPhishX Intelligence",
                description: `${planName} (${cycle.toUpperCase()}) Subscription Activation`,
                image: "/logo.png",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await paymentAPI.verifyPayment({
                            ...response,
                            planId,
                            billingCycle: cycle
                        });

                        if (verifyRes.data.success) {
                            toast.success(`${planName} Node Activated`);
                            navigate('/payment-success', { state: { invoiceNumber: verifyRes.data.invoiceNumber } });
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: `${user?.firstName || 'User'} ${user?.lastName || ''}`,
                    email: user?.email || '',
                },
                theme: {
                    color: "#10b981",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Subscription Error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to initialize secure checkout';
            const errorDetail = error.response?.data?.details ? ` (${error.response.data.details})` : '';
            toast.error(`${errorMsg}${errorDetail}`);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500 selection:text-black overflow-x-hidden font-sans">
            <MouseFollower />
            
            {/* --- GRAPHITE obsidian BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#0A0A0A] to-[#1C1C1C]" />
                
                {/* Emerald & Silver Light Orbs */}
                <LightOrb x="15%" y="15%" color="emerald" size="800px" delay={0} />
                <LightOrb x="85%" y="25%" color="lime" size="600px" delay={3} />
                <LightOrb x="50%" y="65%" color="silver" size="900px" delay={5} />
                <LightOrb x="75%" y="85%" color="emerald" size="700px" delay={8} />
                <LightOrb x="25%" y="75%" color="lime" size="600px" delay={4} />

                {/* Cyber Grid */}
                <motion.div 
                    animate={{ 
                        opacity: [0.01, 0.02, 0.01],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" 
                />

                {/* Floating Metallic Shards */}
                <FloatingShard x="8%" y="18%" size="180px" color="emerald" delay={0} rotateStart={10} />
                <FloatingShard x="90%" y="12%" size="140px" color="silver" delay={3} rotateStart={-15} />
                <FloatingShard x="80%" y="75%" size="220px" color="lime" delay={6} rotateStart={45} />
                <FloatingShard x="12%" y="82%" size="160px" color="emerald" delay={2} rotateStart={-30} />
                <FloatingShard x="48%" y="42%" size="100px" color="gold" delay={9} rotateStart={60} />
            </div>

            <div className="relative z-10">
                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
                    <Container>
                        <motion.div 
                            style={{ scale, opacity, y }}
                            className="flex flex-col items-center text-center space-y-12 lg:space-y-16"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, type: "spring" }}
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.02] border border-white/5  mb-10 shadow-2xl group hover:border-emerald-500/40 transition-colors cursor-default">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-emerald-400 transition-colors">Neural Defense Protocol v4.2 Active</span>
                                </div>
                                
                                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black italic tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl flex flex-col items-center">
                                    <RevealText text="HUMAN-RISK" className="text-white" />
                                    <motion.span 
                                        initial={{ opacity: 0, x: -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 1, delay: 0.5, type: "spring" }}
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                                    >
                                        INTELLIGENCE.
                                    </motion.span>
                                </h1>
                                
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="max-w-3xl mx-auto text-xl md:text-2xl text-white/40 font-medium leading-relaxed mb-16 px-4"
                                >
                                    Move beyond passive training. AntiPhishX deploys <span className="text-emerald-400 font-bold">Autonomous Intelligence</span> to map, predict, and neutralize multi-vector vulnerabilities—<span className="text-white/60">Phishing, Vishing, and Smishing</span>—across your enterprise.
                                </motion.p>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-8"
                                >
                                    <div className="w-full sm:w-auto">
                                        <Button 
                                            onClick={() => setEnterpriseModal({ isOpen: true, type: 'pilot' })}
                                            className="h-18 px-14 bg-gradient-to-r from-emerald-500 to-lime-400 text-black hover:scale-105 transition-all duration-500 font-black uppercase tracking-widest text-xs rounded-full group shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden relative w-full"
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                Start Free Pilot
                                                <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                                            </span>
                                            <motion.div 
                                                className="absolute inset-0 bg-white/20"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: "100%" }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </Button>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <Button 
                                            onClick={() => setEnterpriseModal({ isOpen: true, type: 'architecture' })}
                                            variant="secondary" 
                                            className="h-18 px-14 bg-[#111111] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 font-black uppercase tracking-widest text-xs rounded-full group text-emerald-400 transition-all w-full"
                                        >
                                            Talk to an Architect
                                            <Sparkles size={16} className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* --- GRAPHITE DASHBOARD PREVIEW --- */}
                            <motion.div 
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: 1.4, type: "spring" }}
                                className="w-full max-w-6xl relative mt-24 px-4"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#111111]  group cursor-crosshair"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="absolute top-0 left-0 right-0 h-16 bg-white/[0.02] border-b border-white/5 flex items-center px-10 gap-4">
                                        <div className="flex gap-2.5">
                                            <div className="w-3 h-3 rounded-full bg-white/10" />
                                            <div className="w-3 h-3 rounded-full bg-white/10" />
                                            <div className="w-3 h-3 rounded-full bg-white/10" />
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
                                                antiphishx.intelligence.v4
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-16 relative aspect-[16/9] bg-[#0A0A0A] overflow-hidden">
                                        <motion.img 
                                            src={DASHBOARD_MOCKUP} 
                                            alt="Executive Dashboard Preview" 
                                            className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=2070';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 pointer-events-none" />
                                    </div>
                                </motion.div>

                                {/* Floating AI Badge */}
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-12 -right-6 lg:-right-12 z-20 flex items-center gap-5 p-6 bg-[#111111]/90  border border-white/10 rounded-[2.5rem] shadow-2xl"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                        <BrainCircuit size={32} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">AI Status</div>
                                        <div className="text-xl font-black text-emerald-400 uppercase tracking-tighter">OPTIMIZING...</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>

                {/* --- ENTERPRISE ECOSYSTEM --- */}
                <section id="enterprise" className="py-24 border-y border-white/5 bg-white/[0.01]  relative overflow-hidden">
                    <Container>
                        <div className="flex flex-col items-center text-center space-y-6 mb-16">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">
                                Built for Modern Security Ecosystems
                            </p>
                            <p className="max-w-2xl text-[12px] font-medium text-white/10 uppercase tracking-widest leading-relaxed">
                                AntiPhishX is designed to operate seamlessly alongside leading enterprise identity, SIEM, and security infrastructure.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
                            {['OKTA', 'AZURE AD', 'SLACK', 'CROWDSTRIKE', 'SENTINELONE', 'SAILPOINT'].map((brand, i) => (
                                <motion.span 
                                    key={brand} 
                                    initial={{ opacity: 0.1 }}
                                    whileInView={{ opacity: 0.15 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ opacity: 0.4, scale: 1.05, color: "#10b981" }}
                                    className="text-xl lg:text-2xl font-black italic tracking-tighter transition-all cursor-default grayscale opacity-50"
                                >
                                    {brand}
                                </motion.span>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* --- BENTO GRID --- */}
                <section id="features" className="py-32 lg:py-56 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/5  rounded-full pointer-events-none" />
                    
                    <Container>
                        <div className="mb-24 space-y-6 text-center lg:text-left">
                            <motion.h2 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 italic"
                            >
                                Architecture of Resilience
                            </motion.h2>
                            <RevealText 
                                text="Beyond Awareness. Integrated Defense." 
                                className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-center lg:text-left justify-start text-white"
                                delay={0.2}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px] md:auto-rows-[350px]">
                            <BentoItem 
                                className="md:col-span-8 md:row-span-2"
                                icon={BrainCircuit}
                                title="Cognitive Adaptive Campaigns"
                                description="Our neural orchestration engine analyzes individual susceptibility patterns—urgency, authority, or curiosity—to generate hyper-contextual phishing simulations that evolve with the user."
                                color="emerald"
                                visual={
                                    <motion.div 
                                        animate={{ opacity: [0.03, 0.08, 0.03] }}
                                        transition={{ duration: 8, repeat: Infinity }}
                                        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none"
                                    >
                                        <div className="flex items-center justify-center h-full">
                                            <Radio size={300} className="text-emerald-500 rotate-45" />
                                        </div>
                                    </motion.div>
                                }
                            />
                            
                            <BentoItem 
                                className="md:col-span-4 md:row-span-1"
                                icon={BarChart3}
                                title="Executive Intelligence"
                                description="Quantify organizational risk reduction for board-level reporting with predictive behavioral modeling."
                                color="silver"
                                delay={0.2}
                                visual={
                                    <motion.div 
                                        animate={{ opacity: [0.03, 0.1, 0.03] }}
                                        transition={{ duration: 10, repeat: Infinity }}
                                        className="absolute bottom-0 right-0 w-full h-1/2 pointer-events-none"
                                    >
                                        <div className="flex items-end justify-end h-full p-4">
                                            <Gauge size={160} className="text-slate-400" />
                                        </div>
                                    </motion.div>
                                }
                            />

                            <BentoItem 
                                className="md:col-span-4 md:row-span-1"
                                icon={Terminal}
                                title="SOC/SIEM Pipeline"
                                description="High-fidelity event streaming to your existing security stack for immediate forensic response."
                                color="lime"
                                delay={0.4}
                                visual={
                                    <motion.div 
                                        animate={{ opacity: [0.03, 0.1, 0.03] }}
                                        transition={{ duration: 6, repeat: Infinity }}
                                        className="absolute bottom-0 right-0 w-full h-1/2 pointer-events-none"
                                    >
                                        <div className="flex items-end justify-end h-full p-4">
                                            <Boxes size={140} className="text-lime-500" />
                                        </div>
                                    </motion.div>
                                }
                            />

                            <BentoItem 
                                className="md:col-span-4 md:row-span-2"
                                icon={Fingerprint}
                                title="Enterprise SCIM/SSO"
                                description="Full SAML 2.0 and SCIM 2.0 support for automated lifecycle management at organizational scale."
                                color="silver"
                                delay={0.3}
                                visual={
                                    <div className="mt-12 px-6 space-y-6 opacity-30 group-hover:opacity-60 transition-opacity">
                                        {[KeyRound, Database, Users].map((Icon, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <Icon size={24} className="text-white/40" />
                                                <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <BentoItem 
                                className="md:col-span-8 md:row-span-1"
                                icon={ShieldAlert}
                                title="Susceptibility Mapping"
                                description="Identify and segment high-risk organizational sectors before the breach happens using our advanced behavioral clustering algorithms."
                                color="emerald"
                                delay={0.5}
                                visual={
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                        className="absolute right-0 top-0 h-full w-1/3 opacity-5 flex items-center justify-center p-8 pointer-events-none"
                                    >
                                        <Globe size={180} className="text-emerald-500" />
                                    </motion.div>
                                }
                            />
                        </div>
                    </Container>
                </section>
                
                {/* --- MULTI-VECTOR SIMULATION NODES --- */}
                <section className="py-24 bg-[#0F0F0F]/50 border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5  rounded-full pointer-events-none" />
                    <Container>
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
                            <div className="max-w-2xl space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 italic">
                                    Adaptive Simulation Nodes
                                </h2>
                                <h3 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-[0.9] text-white uppercase">
                                    Multi-Vector <br/> <span className="text-emerald-400">Resilience.</span>
                                </h3>
                            </div>
                            <p className="text-white/20 text-sm font-medium leading-relaxed max-w-sm italic lg:text-right">
                                Our platform simulates real-world threat vectors across all communication channels to build unbreakable security habits.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { 
                                    title: "PHISHING LABS", 
                                    icon: Mail, 
                                    desc: "Advanced email-based social engineering simulations with hyper-contextual payloads.",
                                    color: "emerald"
                                },
                                { 
                                    title: "VISHING LABS", 
                                    icon: Radio, 
                                    desc: "High-fidelity voice phishing simulations using AI voice synthesis and deepfake audio.",
                                    color: "blue"
                                },
                                { 
                                    title: "SMISHING LABS", 
                                    icon: MessageSquare, 
                                    desc: "SMS-based attack simulations mapping mobile vulnerability and peripheral risk.",
                                    color: "amber"
                                }
                            ].map((lab, i) => (
                                <motion.div
                                    key={lab.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-10 rounded-[3rem] bg-[#111111]/40 border border-white/5 hover:border-emerald-500/30 transition-all duration-700"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${
                                        lab.color === 'emerald' ? 'text-emerald-400' : lab.color === 'blue' ? 'text-blue-400' : 'text-amber-400'
                                    }`}>
                                        <lab.icon size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">{lab.title}</h4>
                                    <p className="text-white/30 text-sm font-medium leading-relaxed italic">{lab.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* --- CURRICULUM SECTION --- */}
                <section id="curriculum" className="py-32 lg:py-56 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5  rounded-full pointer-events-none" />
                    <Container>
                        <div className="flex flex-col items-center text-center space-y-8 mb-24">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 italic">
                                Advanced Learning Tracks
                            </h2>
                            <h3 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase text-white">
                                INTELLIGENCE <br/> <span className="text-emerald-400">CURRICULUM.</span>
                            </h3>
                            <p className="max-w-2xl mx-auto text-white/30 text-xl font-medium leading-relaxed italic">
                                Master the psychology of defense. Our curriculum bridges the gap between technical labs and behavioral resilience.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "EXECUTIVE INTELLIGENCE",
                                    slug: "executive-intelligence",
                                    level: "Advanced",
                                    duration: "4.5 Hours",
                                    icon: GraduationCap,
                                    desc: "Strategic risk management and decision-making for security leadership and C-suite stakeholders.",
                                    modules: 12
                                },
                                {
                                    title: "TACTICAL DEFENSE",
                                    slug: "tactical-defense",
                                    level: "Intermediate",
                                    duration: "6 Hours",
                                    icon: ShieldCheck,
                                    desc: "Hands-on identification and neutralization of multi-vector social engineering attacks in real-time.",
                                    modules: 18
                                },
                                {
                                    title: "COGNITIVE SECURITY",
                                    slug: "cognitive-security",
                                    level: "Beginner",
                                    duration: "3 Hours",
                                    icon: BrainCircuit,
                                    desc: "Fundamental behavioral training focusing on the psychological triggers used by modern threat actors.",
                                    modules: 8
                                }
                            ].map((course, i) => (
                                <motion.div
                                    key={course.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="group relative p-1 px-1 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent hover:from-emerald-500/20 transition-all duration-700 cursor-pointer"
                                    onClick={() => navigate(`/training/${course.slug}`)}
                                >
                                    <div className="relative p-12 h-full rounded-[3.4rem] bg-[#111111] overflow-hidden flex flex-col justify-between group-hover:bg-[#151515] transition-all">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <course.icon size={180} />
                                        </div>
                                        
                                        <div className="space-y-8 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-4 py-1.5">{course.level}</Badge>
                                                <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold">
                                                    <Clock size={12} /> {course.duration}
                                                </div>
                                            </div>
                                            <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none group-hover:text-emerald-400 transition-colors">{course.title}</h4>
                                            <p className="text-white/30 text-sm font-medium leading-relaxed italic">{course.desc}</p>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest">
                                                <Video size={14} /> {course.modules} Units
                                            </div>
                                            <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* --- PRICING SECTION --- */}
                <section id="pricing" className="py-32 lg:py-56 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5  rounded-full pointer-events-none" />
                    <Container>
                        <div className="mb-24 text-center">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 italic mb-6"
                            >
                                Investment in Resilience
                            </motion.h2>
                            <RevealText 
                                text="Enterprise-Grade Protection Tiers." 
                                className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-white mb-12"
                            />

                            {/* Billing Toggle */}
                            <div className="flex flex-col items-center gap-6 pt-8">
                                <div className="relative p-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                                    <button 
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setBillingCycle('annual')}
                                        className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${billingCycle === 'annual' ? 'text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        Annual
                                        <span className="absolute -top-3 -right-3 px-2 py-0.5 rounded-md bg-emerald-500 text-[8px] font-black text-black">BEST VALUE</span>
                                    </button>
                                    
                                    <motion.div 
                                        className="absolute bg-emerald-500 rounded-xl"
                                        initial={false}
                                        animate={{ 
                                            left: billingCycle === 'monthly' ? '6px' : 'calc(50% + 2px)',
                                            width: billingCycle === 'monthly' ? 'calc(50% - 8px)' : 'calc(50% - 8px)',
                                            height: 'calc(100% - 12px)'
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                            {/* Tier 1: Core */}
                            <PricingCard 
                                title="CORE NODE"
                                price={billingCycle === 'monthly' ? '399' : '3999'}
                                label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                                savings={billingCycle === 'annual' ? 'Save ₹789 yearly' : null}
                                description="Essential behavioral protection for emerging security teams."
                                features={[
                                    "Standard Phishing Simulations",
                                    "Baseline Susceptibility Audit",
                                    "Core Awareness Curriculum",
                                    "Basic Reporting Dashboard",
                                    "Community Support Pipeline"
                                ]}
                                cta="Subscribe Now"
                                onAction={() => handleSubscribe('core_node', 'CORE NODE', billingCycle)}
                                loading={loadingPlan === 'core_node'}
                                delay={0.1}
                            />

                            {/* Tier 2: Advanced (Featured) */}
                            <PricingCard 
                                title="NEURAL ADVANCED"
                                price={billingCycle === 'monthly' ? '999' : '9999'}
                                label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                                savings={billingCycle === 'annual' ? 'Save ₹1,989 yearly' : null}
                                description="Adaptive AI-powered defense for established enterprises."
                                featured={true}
                                features={[
                                    "Multi-Vector Simulation Suite (Email, Voice, SMS)",
                                    "Full SIEM/SOC Pipeline Integration",
                                    "Advanced Behavioral Analytics",
                                    "Vishing & Smishing Training Modules",
                                    "Priority Architecture Support"
                                ]}
                                cta="Start Premium Access"
                                onAction={() => handleSubscribe('neural_advanced', 'NEURAL ADVANCED', billingCycle)}
                                loading={loadingPlan === 'neural_advanced'}
                                delay={0.2}
                            />

                            {/* Tier 3: Enterprise */}
                            <PricingCard 
                                id="enterprise-tier"
                                title="ENTERPRISE LATTICE"
                                price={billingCycle === 'monthly' ? '5999' : '59999'}
                                label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                                savings={billingCycle === 'annual' ? 'Save ₹11,989 yearly' : null}
                                description="Unbreakable security infrastructure for global organizations."
                                features={[
                                    "Global SCIM & SSO Provisioning",
                                    "Dedicated Neural Guard Account Manager",
                                    "Unlimited Behavioral Profiles",
                                    "24/7 Rapid Response SOC Access",
                                    "On-Premise Deployment Options"
                                ]}
                                cta="Activate Enterprise"
                                onAction={() => handleSubscribe('enterprise_lattice', 'ENTERPRISE LATTICE', billingCycle)}
                                loading={loadingPlan === 'enterprise_lattice'}
                                delay={0.3}
                            />
                        </div>
                    </Container>
                </section>

                {/* --- CTA --- */}
                <section className="py-40 lg:py-64 relative overflow-hidden">
                    <Container>
                        <motion.div 
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-16 lg:p-32 rounded-[4rem] bg-[#111111] border border-white/5 overflow-hidden text-center group"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000  pointer-events-none" />
                            
                            <motion.div className="relative z-10 space-y-12">
                                <motion.div 
                                    animate={{ rotateY: 360 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    className="w-24 h-24 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto mb-10"
                                >
                                    <Shield className="w-12 h-12 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                                </motion.div>
                                <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase text-white">
                                    SECURE YOUR <br/> <span className="text-emerald-400">HUMAN LAYER.</span>
                                </h2>
                                <p className="max-w-2xl mx-auto text-white/30 text-xl font-medium leading-relaxed">
                                    Join the elite security teams using adaptive human intelligence to build unbreakable, resilient security cultures.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                                    <Button 
                                        onClick={() => setEnterpriseModal({ isOpen: true, type: 'pilot' })}
                                        className="h-18 px-16 bg-gradient-to-r from-emerald-500 to-lime-400 text-black hover:scale-105 transition-all duration-500 font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                                    >
                                        Start Free Pilot
                                    </Button>
                                    <Button 
                                        onClick={() => setEnterpriseModal({ isOpen: true, type: 'architecture' })}
                                        variant="ghost" 
                                        className="h-18 px-16 bg-[#111111]/50 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 font-black uppercase tracking-widest text-xs rounded-full group text-emerald-400 transition-all"
                                    >
                                        Talk to an Architect
                                        <MousePointer2 size={16} className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>

                <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent " />
            </div>

            <BriefingModal 
                isOpen={isBriefingOpen}
                onClose={() => setIsBriefingOpen(false)}
            />

            <EnterpriseModal 
                isOpen={enterpriseModal.isOpen}
                type={enterpriseModal.type}
                onClose={() => setEnterpriseModal({ ...enterpriseModal, isOpen: false })}
            />
        </div>
    );
}

function PricingCard({ title, price, label, savings, description, features, featured = false, delay = 0, id, onAction, cta, loading }) {
    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className={`relative p-10 lg:p-12 rounded-[3.5rem] border ${featured ? 'bg-white/[0.03] border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.1)]' : 'bg-[#111111]/40 border-white/5'} flex flex-col justify-between group transition-all duration-700 hover:y-[-10px]`}
        >
            {featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.3em]">
                    Neural Recommended
                </div>
            )}

            <div className="space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black italic tracking-tighter text-white/90 uppercase">{title}</h3>
                        {savings && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest animate-pulse">
                                {savings}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <motion.span 
                            key={price}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-white italic"
                        >
                            ₹{price}
                        </motion.span>
                        <span className="text-white/30 text-sm font-bold">{label}</span>
                    </div>
                    <p className="text-sm font-medium text-white/30 leading-relaxed">{description}</p>
                    {(import.meta.env.VITE_RAZORPAY_KEY_ID?.startsWith('rzp_test')) && (
                        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">Sandbox Mode Active</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-white/5 w-full" />

                <ul className="space-y-5">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 group/item">
                            <div className={`w-5 h-5 rounded-full ${featured ? 'bg-emerald-500/10' : 'bg-white/5'} flex items-center justify-center`}>
                                <CheckCircle2 size={12} className={featured ? 'text-emerald-400' : 'text-white/20'} />
                            </div>
                            <span className="text-xs font-bold text-white/40 group-hover/item:text-white/70 transition-colors tracking-wide">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
                <Button 
                    onClick={onAction}
                    className={`w-full h-16 rounded-full font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${
                        title === 'CORE NODE' ? 'bg-white text-black hover:bg-emerald-500 hover:text-white' :
                        featured ? 'bg-emerald-500 text-black hover:bg-white shadow-[0_20px_50px_rgba(16,185,129,0.2)]' :
                        'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                >
                    {loading ? 'Processing...' : cta || (title === 'CORE NODE' ? 'Request Demo' : title === 'NEURAL ADVANCED' ? 'Start Free Pilot' : 'Contact Enterprise Team')}
                </Button>
            </div>
        </motion.div>
    );
}

function BentoItem({ title, description, icon: Icon, className = "", color = "emerald", visual, delay = 0 }) {
    const colorConfigs = {
        emerald: {
            border: 'hover:border-emerald-500/40',
            text: 'text-emerald-400',
            glow: 'shadow-emerald-500/5 group-hover:shadow-emerald-500/10'
        },
        lime: {
            border: 'hover:border-lime-500/40',
            text: 'text-lime-400',
            glow: 'shadow-lime-500/5 group-hover:shadow-lime-500/10'
        },
        silver: {
            border: 'hover:border-white/20',
            text: 'text-white/60',
            glow: 'shadow-white/5 group-hover:shadow-white/10'
        }
    };

    const config = colorConfigs[color] || colorConfigs.emerald;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className={`group relative p-10 lg:p-14 rounded-[3.5rem] bg-[#111111]/40 border border-white/5  overflow-hidden transition-all duration-700 ${config.border} ${className} ${config.glow}`}
        >
            <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none"
                initial={{ x: "-100%", y: "-100%" }}
                whileHover={{ x: "100%", y: "100%" }}
                transition={{ duration: 1.5 }}
            />
            
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 group-hover:opacity-20 opacity-10">
                {visual}
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-10">
                    <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-white/5 group-hover:rotate-6`}>
                        <Icon size={26} className={`${config.text} drop-shadow-[0_0_8px_currentColor]`} />
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter leading-none text-white/80 group-hover:text-white transition-colors">
                            {title}
                        </h3>
                        <p className="text-lg font-medium text-white/20 leading-relaxed max-w-md group-hover:text-white/40 transition-colors">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

