import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Shield, Building2, Mail, Users, 
    MessageSquare, ArrowRight, CheckCircle2, 
    ShieldCheck, Zap, Briefcase, Globe, Cpu, 
    Settings, Database, Network
} from 'lucide-react';
import { Button } from '../ui';
import { enterpriseRequestAPI } from '../../services/api';

export default function EnterpriseModal({ isOpen, onClose, type = 'pilot' }) {
    const isPilot = type === 'pilot';
    const isDemo = type === 'demo';
    const isArchitecture = type === 'architecture' || type === 'consultation';
    
    const [formData, setFormData] = useState({
        type,
        fullName: '',
        companyName: '',
        workEmail: '',
        teamSize: '',
        industry: '',
        deploymentInterest: '',
        securityChallenges: [],
        currentStack: '',
        requirements: '',
        siemSsoInterest: false,
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await enterpriseRequestAPI.create(formData);
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 "
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#111111] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] flex flex-col lg:flex-row max-h-[95vh]"
                    >
                        {/* Sidebar */}
                        <div className={`lg:w-1/3 p-12 hidden lg:flex flex-col justify-between border-r border-white/5 ${
                            isPilot ? 'bg-emerald-500/[0.03]' : isDemo ? 'bg-amber-500/[0.03]' : 'bg-blue-500/[0.03]'
                        }`}>
                            <div className="space-y-12">
                                <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center ${
                                    isPilot ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                    isDemo ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                }`}>
                                    {isPilot ? <Zap size={32} /> : isDemo ? <Globe size={32} /> : <Network size={32} />}
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
                                        {isPilot ? 'Free' : isDemo ? 'Product' : 'Architecture'} <br/> 
                                        <span className={isPilot ? 'text-emerald-400' : isDemo ? 'text-amber-400' : 'text-blue-400'}>
                                            {isPilot ? 'Pilot' : isDemo ? 'Demonstration' : 'Consultation'}
                                        </span>
                                    </h2>
                                    <p className="text-white/30 text-sm font-medium leading-relaxed italic">
                                        {isPilot 
                                            ? 'Experience the full resilience matrix. Initialize your free pilot deployment and audit your organizational risk surface.'
                                            : isDemo
                                            ? 'Experience a live walkthrough of the AntiPhishX neural node. See how adaptive AI neutralizes human-risk vectors in real-time.'
                                            : 'Strategic alignment for global security infrastructure. Discuss SIEM integration, SSO provisioning, and custom lattice deployments.'
                                        }
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {(isPilot ? [
                                        { icon: Target, text: 'Live Simulations' },
                                        { icon: ShieldCheck, text: 'Vulnerability Audit' },
                                        { icon: Users, text: 'Risk Profiling' }
                                    ] : isDemo ? [
                                        { icon: Globe, text: 'UI/UX Walkthrough' },
                                        { icon: Cpu, text: 'AI Feature Demo' },
                                        { icon: MessageSquare, text: 'Q&A Session' }
                                    ] : [
                                        { icon: Database, text: 'SIEM Integration' },
                                        { icon: Cpu, text: 'SSO Provisioning' },
                                        { icon: Settings, text: 'Lattice Config' }
                                    ]).map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-white/40 group">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-emerald-400 transition-colors">
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                                © 2026 AntiPhishX Enterprise
                            </div>
                        </div>

                        {/* Form Area */}
                        <div className="flex-1 p-8 md:p-12 lg:p-16 relative bg-grid-white/[0.01] overflow-y-auto custom-scrollbar">
                            {!submitted ? (
                                <>
                                    <button 
                                        onClick={onClose}
                                        className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all z-10"
                                    >
                                        <X size={24} />
                                    </button>

                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="space-y-8">
                                            <h3 className="text-xl font-black italic uppercase tracking-widest text-white/40">Organizational Profile</h3>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <EnterpriseInput 
                                                    icon={Shield} 
                                                    label="Full Legal Name" 
                                                    placeholder="John Constantine" 
                                                    value={formData.fullName}
                                                    onChange={v => setFormData({...formData, fullName: v})}
                                                    required
                                                />
                                                <EnterpriseInput 
                                                    icon={Building2} 
                                                    label={isPilot ? "Enterprise Entity" : isDemo ? "Company Name" : "Organization"} 
                                                    placeholder="TechCorp Global" 
                                                    value={formData.companyName}
                                                    onChange={v => setFormData({...formData, companyName: v})}
                                                    required
                                                />
                                                <EnterpriseInput 
                                                    icon={Mail} 
                                                    label="Work Node (Email)" 
                                                    placeholder="john@techcorp.com" 
                                                    type="email"
                                                    value={formData.workEmail}
                                                    onChange={v => setFormData({...formData, workEmail: v})}
                                                    required
                                                />
                                                { (isPilot || isDemo) ? (
                                                    <EnterpriseInput 
                                                        icon={Users} 
                                                        label="Organization Size" 
                                                        placeholder="500+ Nodes" 
                                                        value={formData.teamSize}
                                                        onChange={v => setFormData({...formData, teamSize: v})}
                                                        required
                                                    />
                                                ) : (
                                                    <EnterpriseInput 
                                                        icon={Cpu} 
                                                        label="Security Stack" 
                                                        placeholder="Azure AD / CrowdStrike / SentinelOne" 
                                                        value={formData.currentStack}
                                                        onChange={v => setFormData({...formData, currentStack: v})}
                                                    />
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <EnterpriseInput 
                                                    icon={ (isPilot || isDemo) ? Globe : Briefcase} 
                                                    label={ (isPilot || isDemo) ? "Industry Sector" : "Deployment Window"} 
                                                    placeholder={ (isPilot || isDemo) ? "FinTech / Healthcare" : "Q3 2026 / Immediate"} 
                                                    value={ (isPilot || isDemo) ? formData.industry : formData.deploymentInterest}
                                                    onChange={v => setFormData({...formData, [(isPilot || isDemo) ? 'industry' : 'deploymentInterest']: v})}
                                                />
                                                {!isPilot && (
                                                    <div className="flex items-center gap-4 h-full pt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({...formData, siemSsoInterest: !formData.siemSsoInterest})}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${formData.siemSsoInterest ? 'bg-blue-500' : 'bg-white/10'}`}
                                                        >
                                                            <motion.div 
                                                                animate={{ x: formData.siemSsoInterest ? 24 : 4 }}
                                                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                                                            />
                                                        </button>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">SIEM / SSO Interest</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 flex items-center gap-2">
                                                <MessageSquare size={12} /> {isPilot ? "Security Challenges / Objectives" : "Architectural Requirements / Message"}
                                            </label>
                                            <textarea 
                                                className="w-full min-h-[120px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 text-sm text-white/80 focus:border-emerald-500/30 focus:bg-emerald-500/[0.02] outline-none transition-all custom-scrollbar"
                                                placeholder={isPilot ? "Describe your current risk profile or pilot objectives..." : isDemo ? "What are your specific security goals or interests?" : "Describe your enterprise deployment requirements..."}
                                                value={ (isPilot || isDemo) ? formData.message : formData.requirements}
                                                onChange={e => setFormData({...formData, [(isPilot || isDemo) ? 'message' : 'requirements']: e.target.value})}
                                            />
                                        </div>

                                        {error && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
                                                {error}
                                            </motion.div>
                                        )}

                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 ${
                                                isPilot 
                                                ? 'bg-emerald-500 text-black hover:bg-white shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
                                                : isDemo
                                                ? 'bg-amber-500 text-black hover:bg-white shadow-[0_0_50px_rgba(245,158,11,0.2)]'
                                                : 'bg-blue-500 text-white hover:bg-white hover:text-black shadow-[0_0_50px_rgba(59,130,246,0.2)]'
                                            }`}
                                        >
                                            {loading ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <>Initialize {isPilot ? 'Pilot' : isDemo ? 'Demonstration' : 'Consultation'} <ArrowRight size={18} /></>}
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} className={`w-32 h-32 rounded-[2.5rem] border flex items-center justify-center ${isPilot ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                        <CheckCircle2 size={64} />
                                    </motion.div>
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                                            Mission <span className={isPilot ? 'text-emerald-400' : isDemo ? 'text-amber-400' : 'text-blue-400'}>Initialized.</span>
                                        </h2>
                                        <p className="text-white/40 text-lg font-medium max-w-md mx-auto italic">
                                            {isPilot 
                                                ? "Your AntiPhishX pilot request has been transmitted. An onboarding architect will contact you shortly to synchronize deployment."
                                                : isDemo
                                                ? "Your demonstration request has been queued. A product specialist will contact you within 12 hours to schedule your live walkthrough."
                                                : "Architectural consultation requested. Our enterprise team will contact you within 12 hours to discuss your infrastructure."
                                            }
                                        </p>
                                    </div>
                                    <Button onClick={onClose} variant="outline" className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-[10px]">
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

function EnterpriseInput({ icon: Icon, label, placeholder, type = "text", value, onChange, required }) {
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

// Reuse existing lucide icons not imported
const Target = ({ size, className }) => <Shield size={size} className={className} />;

