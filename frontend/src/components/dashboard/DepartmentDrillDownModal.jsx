import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, AlertTriangle, ShieldAlert, Crosshair, TrendingUp } from 'lucide-react';
import { Card, Badge, Spinner } from '../ui';
import { enterpriseAPI } from '../../services/api';

const DepartmentDrillDownModal = ({ isOpen, onClose, department }) => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrilldown = async () => {
            if (!isOpen || !department) return;
            try {
                setLoading(true);
                const res = await enterpriseAPI.getDepartmentDrilldown(department);
                if (res.data.success) {
                    setUsers(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch drilldown data:', err);
                setError('Failed to retrieve granular telemetry for this sector.');
            } finally {
                setLoading(false);
            }
        };

        fetchDrilldown();
    }, [isOpen, department]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-start justify-between shrink-0">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <Crosshair size={20} />
                                    </div>
                                    <Badge variant="primary" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400 h-6">
                                        Sector Deep Dive
                                    </Badge>
                                </div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                    {department} <span className="text-white/20">Node</span>
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                    Granular Cognitive Vulnerability Analysis
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                    <Spinner className="w-12 h-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 animate-pulse">
                                        Extracting Telemetry...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 text-red-400 text-sm font-bold bg-red-500/10 rounded-2xl border border-red-500/20">
                                    <AlertTriangle className="mx-auto mb-2" size={24} />
                                    {error}
                                </div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-20 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <Users className="mx-auto mb-4 opacity-50" size={32} />
                                    No user telemetry found for this sector.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((user, idx) => (
                                        <Card key={user._id} className="p-6 border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors flex flex-col md:flex-row items-center gap-6">
                                            {/* User Info */}
                                            <div className="flex-1 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-white/50 text-sm shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-white leading-tight">{user.name}</h4>
                                                    <p className="text-xs text-white/40 mb-2">{user.email}</p>
                                                    <Badge variant={user.riskScore > 70 ? 'danger' : user.riskScore > 40 ? 'warning' : 'success'} className="h-5 text-[9px]">
                                                        {Math.round(user.riskScore)} Risk Score
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Vector Micro-charts */}
                                            <div className="flex-1 w-full grid grid-cols-5 gap-2">
                                                {[
                                                    { label: 'URG', val: user.urgency, color: 'bg-red-500' },
                                                    { label: 'AUT', val: user.authority, color: 'bg-orange-500' },
                                                    { label: 'RWD', val: user.reward, color: 'bg-yellow-500' },
                                                    { label: 'CUR', val: user.curiosity, color: 'bg-cyan-500' },
                                                    { label: 'FER', val: user.fear, color: 'bg-purple-500' }
                                                ].map((vec, i) => (
                                                    <div key={i} className="flex flex-col gap-1 items-center">
                                                        <div className="h-16 w-3 bg-black/50 rounded-full overflow-hidden flex flex-col justify-end">
                                                            <div 
                                                                className={`w-full rounded-full transition-all duration-1000 ${vec.color}`} 
                                                                style={{ height: `${vec.val}%`, opacity: vec.val > 60 ? 1 : 0.3 }}
                                                            />
                                                        </div>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{vec.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action / Stats */}
                                            <div className="shrink-0 flex items-center justify-end md:w-32">
                                                {user.failureVelocity > 50 && (
                                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                                        <TrendingUp size={10} />
                                                        Velocity Alert
                                                    </div>
                                                )}
                                                {user.failureVelocity <= 50 && user.riskScore > 70 && (
                                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                                                        <ShieldAlert size={10} />
                                                        High Risk
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DepartmentDrillDownModal;
