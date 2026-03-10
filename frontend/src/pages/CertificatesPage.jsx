import React, { useState, useEffect } from 'react';
import { Scroll, Award, Download, Share2, ExternalLink, Calendar, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import api from '../services/api';

const SAMPLE_CERTIFICATES = [
    { id: 'cert1', courseName: 'Email Phishing Detection Fundamentals', issueDate: '15 Jan 2026', score: 94, duration: '6 hrs 40 min', credentialId: 'APX-2026-EPD-001847' },
    { id: 'cert2', courseName: 'Social Engineering & Vishing Tactics', issueDate: '2 Feb 2026', score: 88, duration: '4 hrs 15 min', credentialId: 'APX-2026-SEV-002193' },
    { id: 'cert3', courseName: 'QR Code & Smishing Attack Scenarios', issueDate: '28 Feb 2026', score: 91, duration: '3 hrs 50 min', credentialId: 'APX-2026-QRS-003021' },
];

export default function CertificatesPage() {
    const [loading] = useState(false);
    const [certificates] = useState(SAMPLE_CERTIFICATES);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header section */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30">
                        <Scroll className="text-cyber-purple w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                        Digital <span className="text-cyber-purple">Certificates</span>
                    </h1>
                </div>
                <p className="text-white/40 text-lg font-medium max-w-2xl">
                    Your official certifications for completed training modules and cybersecurity specializations.
                </p>
            </div>

            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="flex flex-col md:flex-row overflow-hidden bg-white/[0.02] border-white/10 group hover:border-cyber-purple/40 transition-all duration-500">
                                {/* Left Side: Visual Representation */}
                                <div className="w-full md:w-52 h-64 md:h-auto bg-black/40 relative overflow-hidden flex items-center justify-center p-4 border-r border-white/5">
                                    <div className="relative z-10 w-full aspect-[4/3] bg-gradient-to-br from-cyber-black to-slate-900 border-2 border-white/10 rounded-lg p-3 shadow-2xl flex flex-col items-center justify-center text-center">
                                        <Award className="text-cyber-purple w-10 h-10 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        <div className="text-[6px] font-black uppercase text-cyber-purple tracking-[0.2em] mb-1">AntiPhishX Certified</div>
                                        <div className="text-[8px] font-bold text-white leading-tight px-1 line-clamp-2 uppercase italic">{cert.courseName}</div>
                                        <div className="mt-2 text-[5px] text-white/40">Credential: {cert.credentialId}</div>
                                    </div>
                                    {/* Scanline effect over cert preview */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 w-full -translate-y-full hover:translate-y-full transition-transform duration-[2s] pointer-events-none" />
                                </div>

                                {/* Right Side: Details */}
                                <div className="flex-1 p-8 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-purple mb-1">Training Program</div>
                                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">
                                                {cert.courseName}
                                            </h3>
                                        </div>
                                        <div className="p-3 bg-cyber-purple/10 rounded-xl border border-cyber-purple/20">
                                            <ShieldCheck className="text-cyber-purple w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                                <Calendar size={12} className="text-cyber-purple" /> Issued Date
                                            </div>
                                            <div className="text-white font-bold">{cert.issueDate}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                                <Award size={12} className="text-cyber-purple" /> Final Score
                                            </div>
                                            <div className="text-cyber-cyan font-black">{cert.score}% Pass</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                                <Clock size={12} className="text-cyber-purple" /> Duration
                                            </div>
                                            <div className="text-white font-bold">{cert.duration}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                                <BookOpen size={12} className="text-cyber-purple" /> ID
                                            </div>
                                            <div className="text-white font-medium">{cert.credentialId}</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <Button variant="primary" className="flex-1 gap-2 uppercase tracking-widest text-[10px]">
                                            <Download size={14} /> Download PDF
                                        </Button>
                                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white">
                                            <Share2 size={16} />
                                        </button>
                                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <Award className="w-20 h-20 text-white/5 mx-auto mb-8" />
                    <h2 className="text-3xl font-black italic text-white/20 uppercase tracking-widest mb-4">No Certifications Earned Yet</h2>
                    <p className="text-white/10 max-w-md mx-auto font-medium">Complete your first specialized course to receive an immutable digital certification of your expertise.</p>
                </div>
            )}
        </div>
    );
}
