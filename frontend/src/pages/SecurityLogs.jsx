import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Search,
    Filter,
    Shield,
    AlertCircle,
    Info,
    AlertTriangle,
    Clock,
    User,
    Globe,
    ExternalLink,
    ChevronDown,
    X
} from 'lucide-react';
import { Card, Button, Badge, Input, Spinner } from '../components/ui';
import { adminAPI } from '../services/api';

const SEVERITY_COLORS = {
    info: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    warning: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    error: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
};

const SEVERITY_ICONS = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: Shield
};

export default function SecurityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, [severityFilter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = {};
            if (severityFilter !== 'all') params.severity = severityFilter;

            const response = await adminAPI.getSecurityLogs(params);
            setLogs(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch security logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress?.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Security <span className="cyber-gradient-text">Logs</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Real-time forensic audit & security event stream
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest">
                        Export Dataset
                    </Button>
                    <Badge variant="danger" className="h-12 px-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        Live Monitoring Active
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-purple group-hover:text-cyber-cyan transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by action, email, or IP address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:border-cyber-purple focus:bg-white/[0.05] transition-all outline-none font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'info', 'warning', 'critical'].map((sev) => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`
                                px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
                                ${severityFilter === sev
                                    ? 'bg-cyber-purple text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                                    : 'bg-white/[0.03] text-white/40 border border-white/5 hover:border-white/20'
                                }
                            `}
                        >
                            {sev}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Table */}
            <Card className="overflow-hidden border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Timestamp</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Action</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Severity</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User / Agent</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Address</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/30"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <Spinner size="lg" className="mx-auto mb-4 text-cyber-purple" />
                                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">Querying Audit Database...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <motion.tr
                                        key={log._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-white/60 font-mono text-[11px]">
                                                <Clock size={12} className="text-cyber-purple" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-sm text-white tracking-tight uppercase italic">{log.action}</div>
                                            <div className="text-[10px] text-white/30 font-bold uppercase truncate max-w-xs">{log.resource}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`
                                                inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest
                                                ${SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.info}
                                            `}>
                                                {React.createElement(SEVERITY_ICONS[log.severity] || SEVERITY_ICONS.info, { size: 10 })}
                                                {log.severity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <User size={14} className="text-white/40" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">{log.userId?.firstName} {log.userId?.lastName}</div>
                                                    <div className="text-[10px] text-white/30 font-mono">{log.userId?.email || 'SYSTEM_NODE'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-white/40 font-mono text-[11px]">
                                                <Globe size={12} />
                                                {log.ipAddress || '0.0.0.0'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 group-hover:text-cyber-cyan transition-all">
                                                <ExternalLink size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center opacity-30">
                                        <History size={48} className="mx-auto mb-4" />
                                        <p className="font-black uppercase tracking-[0.2em]">No logs found matching criteria</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Log Detail Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-cyber-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${SEVERITY_COLORS[selectedLog.severity]}`}>
                                        {React.createElement(SEVERITY_ICONS[selectedLog.severity], { size: 24 })}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{selectedLog.action}</h2>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{selectedLog._id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6 font-mono text-xs">
                                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                        <div className="text-cyber-purple mb-1 font-black uppercase tracking-widest text-[9px]">Timestamp</div>
                                        <div className="text-white">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                        <div className="text-cyber-cyan mb-1 font-black uppercase tracking-widest text-[9px]">IP Address</div>
                                        <div className="text-white">{selectedLog.ipAddress || 'Not Captured'}</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Event Metadata</h4>
                                    <div className="p-6 bg-[#000] rounded-2xl border border-white/5 font-mono text-[11px] text-green-400 overflow-x-auto">
                                        <pre>{JSON.stringify(selectedLog.details || selectedLog.metadata, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-white/[0.01] border-t border-white/5 flex justify-end">
                                <Button onClick={() => setSelectedLog(null)} className="px-8 bg-cyber-purple/10 border border-cyber-purple/20">
                                    Close Trace
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
