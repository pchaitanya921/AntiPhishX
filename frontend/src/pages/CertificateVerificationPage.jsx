import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    ShieldAlert, 
    Fingerprint, 
    Calendar, 
    User, 
    Award, 
    CheckCircle2, 
    Globe,
    Cpu,
    ExternalLink,
    Search,
    QrCode
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { certificatesAPI } from '../services/api';

export default function CertificateVerificationPage() {
    const { certId } = useParams();
    const [loading, setLoading] = useState(true);
    const [cert, setCert] = useState(null);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (certId) {
            verifyCertificate(certId);
        } else {
            setLoading(false);
        }
    }, [certId]);

    const verifyCertificate = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const res = await certificatesAPI.verify(id);
            if (res.data.success) {
                setCert(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Certificate validation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            verifyCertificate(searchQuery.trim());
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10  rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Branding */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <ShieldCheck className="text-emerald-400 w-10 h-10" />
                        <span className="text-3xl font-black italic tracking-tighter uppercase">AntiPhish<span className="text-emerald-400">X</span></span>
                    </motion.div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
                        Credential <span className="text-emerald-400">Verification</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px]">
                        Enterprise Integrity Validation Protocol
                    </p>
                </div>

                {!certId && !cert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto"
                    >
                        <Card className="p-10 rounded-[3rem] bg-white/[0.02] border-white/5  shadow-2xl">
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Credential ID</label>
                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="APX-EXE-XXXXXXXX"
                                            className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-emerald-500/50 focus:outline-none transition-all font-mono tracking-widest text-emerald-400"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-16 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest italic rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    Validate Credential
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
                        <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px]">Initializing Validation Sequence...</p>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto text-center"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
                            <ShieldAlert size={40} />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase text-white mb-4">Verification <span className="text-red-500">Failed</span></h2>
                        <p className="text-white/40 font-medium mb-10">{error}</p>
                        <Button onClick={() => setCert(null) || setError(null)} variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-white/60 hover:text-white uppercase tracking-widest font-black italic">
                            New Search
                        </Button>
                    </motion.div>
                ) : cert && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="p-1 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/10 border-white/5  shadow-2xl relative overflow-hidden group">
                            <div className="bg-[#0a0a0a] rounded-[3.4rem] p-12 relative overflow-hidden">
                                {/* Success Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10  -mr-32 -mt-32" />
                                
                                <div className="grid md:grid-cols-12 gap-12">
                                    {/* Left: Recipient Info */}
                                    <div className="md:col-span-4 flex flex-col items-center text-center border-r border-white/5 pr-12">
                                        <div className="relative mb-8">
                                            <div className="w-32 h-32 rounded-full border-2 border-emerald-500/30 p-2">
                                                <div className="w-full h-full rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                                                    {cert.recipientAvatar ? (
                                                        <img src={cert.recipientAvatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={60} className="text-emerald-400/20" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg">
                                                <CheckCircle2 size={24} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">{cert.recipient}</h3>
                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{cert.department} Division</p>
                                        
                                        <div className="mt-10 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 w-full">
                                            <QrCode size={120} className="mx-auto text-white/10" />
                                            <p className="text-[8px] text-white/20 uppercase tracking-widest mt-4">Verified Hash Signature</p>
                                        </div>
                                    </div>

                                    {/* Right: Certificate Details */}
                                    <div className="md:col-span-8 space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Badge variant="emerald" className="px-4 py-2 text-[10px] uppercase italic tracking-[0.2em]">VERIFIED CREDENTIAL</Badge>
                                            </div>
                                            <div className="text-white/20 text-[10px] font-black tracking-widest uppercase">
                                                ID: <span className="text-emerald-400/60 font-mono">{cert.certificateId}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-4xl font-black italic text-white uppercase tracking-tight leading-none mb-4">
                                                {cert.domain.replace(/_/g, ' ')} <span className="text-emerald-400">Expertise</span>
                                            </h2>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline" className="border-white/10 text-white/40 uppercase tracking-widest text-[9px]">{cert.level} tier</Badge>
                                                <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                                                    <Calendar size={14} className="text-emerald-400" />
                                                    Issued {new Date(cert.issueDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Achievement Stats */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/20 transition-all">
                                                <div className="flex items-center gap-3 mb-4 text-white/30">
                                                    <Fingerprint size={18} className="text-emerald-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Resilience Index</span>
                                                </div>
                                                <div className="text-2xl font-black italic text-white">{cert.metadata.resilienceScore}%</div>
                                                <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${cert.metadata.resilienceScore}%` }} />
                                                </div>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/20 transition-all">
                                                <div className="flex items-center gap-3 mb-4 text-white/30">
                                                    <Cpu size={18} className="text-emerald-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Accuracy Rating</span>
                                                </div>
                                                <div className="text-2xl font-black italic text-white">{cert.metadata.neutralizationAccuracy}%</div>
                                                <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${cert.metadata.neutralizationAccuracy}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-white/20">
                                                <Globe size={16} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Publicly Authenticated on Enterprise Ledger</span>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-black italic flex items-center gap-2 rounded-xl"
                                                onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                                            >
                                                <ExternalLink size={14} /> Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="mt-12 text-center">
                            <Link to="/login" className="text-white/20 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                                ← Return to Command Center
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

