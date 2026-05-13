import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    CreditCard, 
    GraduationCap, 
    Building2, 
    Bell, 
    Check, 
    Trash2,
    X,
    ChevronRight,
    Zap,
    AlertTriangle,
    Target,
    Award
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ 
    notifications = [], 
    onMarkAsRead, 
    onMarkAllAsRead, 
    onDelete, 
    onClose 
}) => {
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'security': return <Shield size={14} className="text-red-400" />;
            case 'subscription': return <CreditCard size={14} className="text-emerald-400" />;
            case 'training': return <GraduationCap size={14} className="text-blue-400" />;
            case 'enterprise': return <Building2 size={14} className="text-cyan-400" />;
            case 'achievement': return <Award size={14} className="text-yellow-400" />;
            case 'lab': return <Target size={14} className="text-purple-400" />;
            case 'quiz': return <Zap size={14} className="text-orange-400" />;
            default: return <Bell size={14} className="text-white/40" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'security': return 'bg-red-500/10 border-red-500/20';
            case 'subscription': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'training': return 'bg-blue-500/10 border-blue-500/20';
            case 'enterprise': return 'bg-cyan-500/10 border-cyan-500/20';
            default: return 'bg-white/5 border-white/10';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-[400px] rounded-[2.5rem] bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-[110]"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black italic tracking-tighter uppercase flex items-center gap-2">
                        Intelligence Feed
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black not-italic">
                                {unreadCount} NEW
                            </span>
                        )}
                    </h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mt-1">Real-time threat & node status</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onMarkAllAsRead}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 text-white/20 hover:text-emerald-400 transition-all group"
                        title="Mark all as read"
                    >
                        <Check size={14} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                {notifications.length === 0 ? (
                    <div className="py-12 px-6 text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto opacity-20">
                            <Bell size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">Architecture Silent</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div 
                            key={n._id}
                            className={`group relative p-4 rounded-3xl transition-all duration-300 border ${
                                n.isRead ? 'bg-transparent border-transparent opacity-60' : `${getTypeColor(n.type)}`
                            }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                                    n.isRead ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'
                                }`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0 pr-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white truncate">
                                        {n.title}
                                    </h4>
                                    <p className="text-[10px] text-white/40 leading-relaxed mt-1 line-clamp-2">
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                        {!n.isRead && (
                                            <button 
                                                onClick={() => onMarkAsRead(n._id)}
                                                className="text-[8px] font-black text-emerald-400 uppercase tracking-widest hover:underline"
                                            >
                                                Neutralize
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onDelete(n._id)}
                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={10} />
                                </button>
                                {n.link && (
                                    <button 
                                        className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                                    >
                                        <ChevronRight size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                <button className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
                    View Comprehensive Intel Hub
                </button>
            </div>
        </motion.div>
    );
};

export default NotificationCenter;
