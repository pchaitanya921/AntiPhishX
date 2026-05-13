import React, { useState, useEffect } from 'react';
import { 
    Scroll, 
    Award, 
    Download, 
    Share2, 
    ExternalLink, 
    Calendar, 
    ShieldCheck, 
    Lock,
    Cpu,
    Fingerprint,
    Zap,
    ChevronRight,
    Search
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { certificatesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const TRACKS = [
    { id: 'executive_intelligence', title: 'Executive Intelligence', icon: Zap },
    { id: 'tactical_defense', title: 'Tactical Defense', icon: ShieldCheck },
    { id: 'cognitive_security', title: 'Cognitive Security', icon: Fingerprint },
    { id: 'advanced_ai_adaptive', title: 'Advanced AI Adaptive', icon: Cpu },
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function CertificatesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [checkingTrack, setCheckingTrack] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const res = await certificatesAPI.getMyCertificates();
            if (res.data.success) {
                setCertificates(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch certificates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckEligibility = async (domain, level) => {
        const trackId = `${domain}_${level}`;
        try {
            setCheckingTrack(trackId);
            const res = await certificatesAPI.check({ domain, level });
            if (res.data.success && res.data.issued) {
                // Refresh list if a new certificate was issued
                fetchCertificates();
            } else {
                // Show progress stats (implement a modal or toast)
                console.log('Eligibility Stats:', res.data.data);
                alert(`Not yet eligible. Required Labs: ${res.data.data.requiredLabs}, Resilience: ${res.data.data.requiredResilience}%`);
            }
        } catch (err) {
            console.error('Eligibility Check Failed:', err);
        } finally {
            setCheckingTrack(null);
        }
    };

    const handleDownload = async (cert) => {
        try {
            const res = await certificatesAPI.download(cert._id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `AntiPhishX_${cert.certificateId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                        <Scroll className="text-emerald-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                            Enterprise <span className="text-emerald-400">Certifications</span>
                        </h1>
                        <p className="text-emerald-400/80 text-xs font-black uppercase tracking-widest mt-1">
                            Immutable Professional Credentials
                        </p>
                    </div>
                </div>
            </div>

            {/* Certification Tracks Grid */}
            <div className="space-y-20">
                {TRACKS.map((track) => (
                    <div key={track.id} className="space-y-10">
                        <div className="flex items-center gap-5 border-l-4 border-emerald-500 pl-8">
                            <track.icon className="text-emerald-500 w-8 h-8" />
                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">{track.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {LEVELS.map((level) => {
                                const cert = certificates.find(c => c.domain === track.id && c.level === level);
                                const isChecking = checkingTrack === `${track.id}_${level}`;

                                return (
                                    <motion.div
                                        key={level}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className={`p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5  relative overflow-hidden flex flex-col h-full ${cert ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : ''}`}>
                                            {cert && (
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5  -mr-16 -mt-16" />
                                            )}
                                            
                                            <div className="flex justify-between items-start mb-8">
                                                <Badge variant={cert ? "emerald" : "outline"} className="px-4 py-1.5 uppercase italic text-[9px] tracking-widest">
                                                    {level} tier
                                                </Badge>
                                                {cert && <CheckCircle2 className="text-emerald-400" size={24} />}
                                            </div>

                                            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-2">{track.title}</h3>
                                            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mb-10">APX {level} Certification</p>

                                            {cert ? (
                                                <div className="space-y-6 mt-auto">
                                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Issued Date</p>
                                                        <p className="text-xs font-black text-white">{format(new Date(cert.issueDate), 'dd MMM yyyy')}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={() => handleDownload(cert)}
                                                            className="flex-1 h-12 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest text-[9px] italic rounded-xl gap-2"
                                                        >
                                                            <Download size={14} /> Download
                                                        </Button>
                                                        <button 
                                                            onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-auto">
                                                    <div className="flex items-center gap-3 text-white/10 mb-8">
                                                        <Lock size={16} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Requires {level === 'beginner' ? '25' : level === 'intermediate' ? '50' : '75'} Nodes</span>
                                                    </div>
                                                    <Button 
                                                        disabled={isChecking}
                                                        onClick={() => handleCheckEligibility(track.id, level)}
                                                        className="w-full h-12 border border-white/10 bg-transparent text-white/40 hover:text-white hover:border-emerald-500/40 font-black uppercase tracking-widest text-[9px] italic rounded-xl flex items-center justify-center gap-2"
                                                    >
                                                        {isChecking ? (
                                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>Sync Progress <ChevronRight size={14} /></>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State / Bottom CTA */}
            <div className="mt-32 p-16 rounded-[4rem] bg-emerald-500/5 border border-emerald-500/10 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10  rounded-full" />
                <div className="relative z-10">
                    <Award className="w-16 h-16 text-emerald-500 mx-auto mb-8 animate-pulse" />
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Advance Your Career</h3>
                    <p className="text-white/40 max-w-xl mx-auto text-sm font-medium mb-10">
                        AntiPhishX certifications are industry-recognized proof of your behavioral resilience and tactical cybersecurity expertise. Share your credentials on LinkedIn to showcase your verified skill set.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Button className="h-14 px-10 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl italic">Explore Labs</Button>
                        <Button variant="outline" className="h-14 px-10 border-white/10 text-white/60 rounded-2xl font-black uppercase tracking-widest italic">Verification Portal</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

