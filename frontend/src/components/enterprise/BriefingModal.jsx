import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Shield, Briefcase, Building2, Mail, Users, 
    Calendar, MessageSquare, ArrowRight, CheckCircle2, 
    Sparkles, ShieldCheck, Zap
} from 'lucide-react';
import { Button, Input, Card } from '../ui';
import { briefingAPI } from '../../services/api';

const BRIEFING_CHALLENGES = [
    'Spear Phishing Protection',
    'Executive Behavioral Risk',
    'SOC/SIEM Integration',
    'Enterprise Compliance',
    'Cognitive Security Training',
    'Global Awareness Deployment'
];

export default function BriefingModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        workEmail: '',
        companySize: '',
        jobRole: '',
        challenges: [],
        preferredDate: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const toggleChallenge = (challenge) => {
        setFormData(prev => ({
            ...prev,
            challenges: prev.challenges.includes(challenge)
                ? prev.challenges.filter(c => c !== challenge)
                : [...prev.challenges, challenge]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await briefingAPI.create(formData);
            if (res.data.success) {
                setSubmitted(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Synchronization failure. Please verify uplink integrity.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen && !submitted) return null;

    return (
        <AnimatePresence>
            {(isOpen || submitted) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 overflow-hidden">
                    {/* Background Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 "
                    />

                    {/* Premium Glassmorphic Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#111111] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] flex flex-col lg:flex-row"
                    >
                        {/* Sidebar: Executive Context */}
                        <div className="lg:w-1/3 bg-emerald-500/[0.03] border-r border-white/5 p-12 hidden lg:flex flex-col justify-between">
                            <div className="space-y-12">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
                                        Executive <br/> <span className="text-emerald-400">Briefing</span>
                                    </h2>
                                    <p className="text-white/30 text-sm font-medium leading-relaxed italic">
                                        Gain definitive insights into your organizational human-risk surface. Our architects will prepare a custom threat landscape analysis tailored to your sector.
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { icon: Zap, text: 'Predictive Modeling' },
                                        { icon: Users, text: 'Behavioral Analysis' },
                                        { icon: Shield, text: 'Neural Defense' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-white/40 group">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-emerald-400 transition-colors">
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5">
                                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                                    © 2026 AntiPhishX Intelligence Node
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-8 md:p-12 lg:p-16 relative bg-grid-white/[0.01] overflow-y-auto max-h-[90vh] custom-scrollbar">
                            {!submitted ? (
                                <>
                                    <button 
                                        onClick={onClose}
                                        className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>

                                    <form onSubmit={handleSubmit} className="space-y-12">
                                        <div className="space-y-8">
                                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white/40">Request Parameters</h3>
                                            
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <BriefingInput 
                                                    icon={Shield} 
                                                    label="Full Legal Name" 
                                                    placeholder="John Constantine" 
                                                    value={formData.fullName}
                                                    onChange={v => setFormData({...formData, fullName: v})}
                                                    required
                                                />
                                                <BriefingInput 
                                                    icon={Building2} 
                                                    label="Enterprise Entity" 
                                                    placeholder="TechCorp Global" 
                                                    value={formData.companyName}
                                                    onChange={v => setFormData({...formData, companyName: v})}
                                                    required
                                                />
                                                <BriefingInput 
                                                    icon={Mail} 
                                                    label="Work Node (Email)" 
                                                    placeholder="john@techcorp.com" 
                                                    type="email"
                                                    value={formData.workEmail}
                                                    onChange={v => setFormData({...formData, workEmail: v})}
                                                    required
                                                />
                                                <BriefingInput 
                                                    icon={Briefcase} 
                                                    label="Job Descriptor" 
                                                    placeholder="CISO / VP Security" 
                                                    value={formData.jobRole}
                                                    onChange={v => setFormData({...formData, jobRole: v})}
                                                    required
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Node Scale (Size)</label>
                                                    <select 
                                                        className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white/80 focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] outline-none transition-all appearance-none"
                                                        value={formData.companySize}
                                                        onChange={e => setFormData({...formData, companySize: e.target.value})}
                                                        required
                                                    >
                                                        <option value="" className="bg-[#111111]">Select Cluster Size</option>
                                                        {['1-50', '51-200', '201-500', '501-1000', '1000+'].map(s => (
                                                            <option key={s} value={s} className="bg-[#111111]">{s} Seats</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <BriefingInput 
                                                    icon={Calendar} 
                                                    label="Preferred Window" 
                                                    type="date"
                                                    value={formData.preferredDate}
                                                    onChange={v => setFormData({...formData, preferredDate: v})}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white/40">Sector Challenges</h3>
                                            <div className="flex flex-wrap gap-4">
                                                {BRIEFING_CHALLENGES.map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => toggleChallenge(c)}
                                                        className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            formData.challenges.includes(c)
                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                                : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20'
                                                        }`}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 flex items-center gap-2">
                                                <MessageSquare size={12} /> Message / Custom Requirements
                                            </label>
                                            <textarea 
                                                className="w-full min-h-[120px] bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-sm text-white/80 focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] outline-none transition-all custom-scrollbar"
                                                placeholder="Describe your current security posture or specific demo requirements..."
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                            />
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full h-20 rounded-[2rem] bg-emerald-500 text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center justify-center gap-4"
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Transmit Request <ArrowRight size={18} />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"
                                    >
                                        <CheckCircle2 size={64} />
                                    </motion.div>
                                    
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                                            Briefing <span className="text-emerald-400">Initiated.</span>
                                        </h2>
                                        <p className="text-white/40 text-lg font-medium max-w-md mx-auto">
                                            Your executive intelligence request has been transmitted. Our security architects will contact you shortly.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-sm p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-white/20">Transmission Status</span>
                                            <span className="text-emerald-400">Verified</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={onClose}
                                        variant="outline"
                                        className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Return to Terminal
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function BriefingInput({ icon: Icon, label, placeholder, type = "text", value, onChange, required }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 flex items-center gap-2">
                <Icon size={12} /> {label}
            </label>
            <input 
                type={type}
                required={required}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl px-8 text-sm text-white/80 placeholder:text-white/5 focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] outline-none transition-all"
            />
        </div>
    );
}

