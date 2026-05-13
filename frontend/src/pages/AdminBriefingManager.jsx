import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Building2, Mail, Users, Calendar, 
    Search, Filter, ChevronRight, CheckCircle2, 
    Clock, AlertTriangle, XCircle, MoreVertical,
    FileText, ExternalLink, MailQuestion
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import { briefingAPI } from '../services/api';

export default function AdminBriefingManager() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await briefingAPI.getAll();
            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch briefings', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await briefingAPI.updateStatus(id, status);
            if (res.data.success) {
                setRequests(requests.map(r => r._id === id ? { ...r, status: res.data.data.status } : r));
                if (selectedRequest?._id === id) {
                    setSelectedRequest({ ...selectedRequest, status: res.data.data.status });
                }
            }
        } catch (err) {
            console.error('Status update failed', err);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             req.workEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic uppercase">
                        Executive <span className="text-emerald-400">Briefing</span> Pipeline
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Managing {requests.length} high-fidelity enterprise leads
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={fetchRequests} className="h-12 px-6">
                        Synchronize Data
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Company, Name or Node (Email)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white/80 focus:border-emerald-500/30 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    {['all', 'pending', 'scheduled', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === f 
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                    : 'text-white/20 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pipeline Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
                            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Scanning Pipeline Nodes...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem]">
                            <MailQuestion size={48} className="text-white/10 mx-auto mb-6" />
                            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">No briefing requests found in this sector</p>
                        </div>
                    ) : (
                        filteredRequests.map(req => (
                            <motion.div 
                                layoutId={req._id}
                                key={req._id}
                                onClick={() => setSelectedRequest(req)}
                                className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                                    selectedRequest?._id === req._id 
                                        ? 'bg-emerald-500/[0.03] border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                                        : 'bg-[#111111]/40 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-emerald-400 transition-colors">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black italic uppercase text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                                                {req.companyName}
                                            </h4>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">
                                                {req.fullName} · {req.jobRole}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <div className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-1">Scale</div>
                                            <Badge variant="outline" className="text-[9px]">{req.companySize} Seats</Badge>
                                        </div>
                                        <StatusBadge status={req.status} />
                                        <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-4">
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="sticky top-10 space-y-6"
                            >
                                <Card className="p-10 bg-emerald-500/[0.02] border-emerald-500/20 rounded-[3rem] space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <Shield size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setSelectedRequest(null)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 transition-all"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">
                                            {selectedRequest.companyName}
                                        </h3>
                                        <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.4em]">Intelligence Report</p>
                                    </div>

                                    <div className="space-y-6 border-y border-white/5 py-8">
                                        <DetailItem label="Lead Identity" value={selectedRequest.fullName} sub={selectedRequest.jobRole} />
                                        <DetailItem label="Communication Node" value={selectedRequest.workEmail} sub="Work Email Verified" />
                                        <DetailItem label="Target Cluster" value={`${selectedRequest.companySize} Seats`} sub="Enterprise Scale" />
                                        <DetailItem label="Preferred Window" value={new Date(selectedRequest.preferredDate).toLocaleDateString('en-US', { dateStyle: 'full' })} sub="Requested Schedule" />
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Executive Requirements</p>
                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/40 leading-relaxed italic">
                                            "{selectedRequest.message || 'No custom requirements specified.'}"
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Update Status</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['scheduled', 'completed'].map(s => (
                                                <Button
                                                    key={s}
                                                    onClick={() => updateStatus(selectedRequest._id, s)}
                                                    variant={selectedRequest.status === s ? 'primary' : 'outline'}
                                                    className="h-12 text-[9px] font-black uppercase tracking-widest rounded-xl"
                                                >
                                                    Mark {s}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="sticky top-10 p-12 border border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                                <FileText size={40} className="text-white/5 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Select a request node to inspect metadata</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        pending: { color: 'yellow', icon: Clock },
        scheduled: { color: 'emerald', icon: Calendar },
        completed: { color: 'blue', icon: CheckCircle2 },
        cancelled: { color: 'red', icon: XCircle },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400 text-[9px] font-black uppercase tracking-widest`}>
            <Icon size={12} /> {status}
        </div>
    );
}

function DetailItem({ label, value, sub }) {
    return (
        <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 block">{label}</span>
            <span className="text-sm font-black italic text-white uppercase">{value}</span>
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest block">{sub}</span>
        </div>
    );
}

