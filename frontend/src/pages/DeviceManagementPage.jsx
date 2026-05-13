import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Monitor, 
    Smartphone, 
    Globe, 
    Clock, 
    Trash2, 
    ShieldAlert, 
    CheckCircle2, 
    MapPin, 
    Fingerprint,
    Cpu,
    ArrowLeft
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { load } from '@fingerprintjs/fingerprintjs';

export default function DeviceManagementPage() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const fp = await load();
            const result = await fp.get();
            setCurrentDeviceId(result.visitorId);
            fetchDevices();
        };
        init();
    }, []);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await authAPI.getDevices();
            if (res.data.success) {
                setDevices(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to synchronize device nodes');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDevice = async (deviceId) => {
        try {
            const res = await authAPI.removeDevice(deviceId);
            if (res.data.success) {
                toast.success('Device node de-authorized');
                setDevices(devices.filter(d => d.deviceId !== deviceId));
                if (deviceId === currentDeviceId) {
                    // If user removes their own device, logout
                    window.location.href = '/login';
                }
            }
        } catch (err) {
            toast.error('Failed to revoke device access');
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
                <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Scanning Active Nodes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 gap-2">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Button>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none mb-4">
                        Device <span className="text-emerald-400">Inventory</span>
                    </h1>
                    <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Active License Allocation · Global Node Topology
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Fingerprint size={20} />
                    </div>
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Your Local Node ID</div>
                        <div className="text-xs font-black text-emerald-400 truncate w-32">{currentDeviceId}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {devices.map((device) => (
                        <motion.div
                            key={device.deviceId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            layout
                        >
                            <Card className={`p-8 bg-[#0c0c0e] border-white/5 relative overflow-hidden group ${device.deviceId === currentDeviceId ? 'ring-1 ring-emerald-500/30 bg-emerald-500/[0.02]' : ''}`}>
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                                    <Cpu size={120} />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border transition-all duration-500 ${device.deviceId === currentDeviceId ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-white/40'}`}>
                                            {device.os?.toLowerCase().includes('windows') || device.os?.toLowerCase().includes('mac') ? <Monitor size={28} /> : <Smartphone size={28} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                                                    {device.browser || 'Unknown Client'}
                                                </h3>
                                                {device.deviceId === currentDeviceId && (
                                                    <Badge variant="primary" className="text-[8px] bg-emerald-500/10 border-emerald-500/20 text-emerald-400 uppercase">This Device</Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20">
                                                        <Cpu size={10} /> Architecture
                                                    </div>
                                                    <div className="text-xs font-bold text-white/60">{device.os || 'CyberOS Core'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20">
                                                        <MapPin size={10} /> Uplink Origin
                                                    </div>
                                                    <div className="text-xs font-bold text-white/60">{device.location}, {device.ip}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20">
                                                        <Clock size={10} /> Last Active
                                                    </div>
                                                    <div className="text-xs font-bold text-white/60">{new Date(device.lastActiveAt).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleRemoveDevice(device.deviceId)}
                                        className="h-14 px-8 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300"
                                    >
                                        <Trash2 size={18} className="mr-2" />
                                        Revoke Node
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {devices.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                        <ShieldAlert size={64} className="mb-6" />
                        <h3 className="text-2xl font-black italic uppercase">No active nodes detected</h3>
                        <p className="text-sm font-bold uppercase tracking-widest mt-2">Initialize a new session to begin tracking</p>
                    </div>
                )}
            </div>

            <Card className="p-8 bg-amber-500/[0.02] border border-amber-500/10 rounded-[2.5rem]">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-2">Device Security Protocol</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                            AntiPhishX employs cryptographic node-locking to ensure your license is only active on authorized hardware. Revoking a device node will immediately terminate all active sessions on that specific terminal. Unauthorized device sprawl may result in temporary account lockout.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
