import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Users, 
    Search, 
    Filter, 
    Download, 
    ShieldCheck, 
    ShieldAlert, 
    TrendingUp,
    FileText,
    MoreVertical,
    Trash2,
    CheckCircle,
    Mail
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI, certificatesAPI } from '../services/api';

export default function AdminCertificationManager() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        thisMonth: 0,
        revoked: 0,
        topDomain: 'Executive Intelligence'
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            // Assuming we added a getAllCertificates route to adminAPI
            const res = await adminAPI.getAllCertificates();
            if (res.data.success) {
                const data = res.data.data;
                setCertificates(data);
                
                // Calculate basic stats
                setStats({
                    total: data.length,
                    thisMonth: data.filter(c => new Date(c.issueDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
                    revoked: data.filter(c => c.status === 'revoked').length,
                    topDomain: 'Tactical Defense'
                });
            }
        } catch (err) {
            console.error('Failed to fetch certificates:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCertificates = certificates.filter(cert => 
        cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30">
                        <Award className="text-cyber-purple w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                            Certification <span className="text-cyber-purple">Control</span>
                        </h1>
                        <p className="text-cyber-purple/80 text-xs font-black uppercase tracking-widest mt-1">
                            Admin Credential Management & Oversight
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <Card className="p-8 bg-white/[0.02] border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-cyber-purple/10 flex items-center justify-center text-cyber-purple">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Issued Total</span>
                    </div>
                    <div className="text-4xl font-black italic text-white">{stats.total}</div>
                </Card>
                <Card className="p-8 bg-white/[0.02] border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Growth (30d)</span>
                    </div>
                    <div className="text-4xl font-black italic text-emerald-500">+{stats.thisMonth}</div>
                </Card>
                <Card className="p-8 bg-white/[0.02] border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Revoked</span>
                    </div>
                    <div className="text-4xl font-black italic text-red-500">{stats.revoked}</div>
                </Card>
                <Card className="p-8 bg-white/[0.02] border-white/5 border-l-cyber-purple/40">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Top Track</span>
                    </div>
                    <div className="text-xl font-black italic text-white uppercase">{stats.topDomain}</div>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by User, Certificate ID, or Department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-cyber-purple/50 transition-all"
                    />
                </div>
                <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/10 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-black italic gap-2">
                    <Filter size={18} /> Filters
                </Button>
                <Button className="h-16 px-10 bg-cyber-purple text-white font-black uppercase tracking-widest rounded-2xl italic gap-2">
                    <Download size={18} /> Export Registry
                </Button>
            </div>

            {/* Registry Table */}
            <Card className="rounded-[2.5rem] bg-white/[0.02] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Recipient</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Certificate</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">ID / Hash</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Issue Date</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredCertificates.map((cert, idx) => (
                                    <motion.tr 
                                        key={cert._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-white/[0.02] transition-all group"
                                    >
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-cyber-purple/10 flex items-center justify-center text-cyber-purple font-black">
                                                    {cert.user?.firstName?.[0]}{cert.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{cert.user?.firstName} {cert.user?.lastName}</div>
                                                    <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">{cert.user?.department || 'Operations'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="text-white font-black italic uppercase text-sm mb-1">{cert.domain.replace(/_/g, ' ')}</div>
                                            <Badge variant="outline" className="border-white/10 text-white/40 text-[8px] uppercase tracking-widest">{cert.level}</Badge>
                                        </td>
                                        <td className="p-8 font-mono text-[10px] text-emerald-400/60">{cert.certificateId}</td>
                                        <td className="p-8 text-white/40 text-xs">{new Date(cert.issueDate).toLocaleDateString()}</td>
                                        <td className="p-8">
                                            <Badge variant={cert.status === 'active' ? 'emerald' : 'red'} className="uppercase text-[8px] tracking-widest font-black italic">
                                                {cert.status}
                                            </Badge>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                                                    <FileText size={16} />
                                                </button>
                                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

