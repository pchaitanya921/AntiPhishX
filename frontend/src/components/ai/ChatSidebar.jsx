import React from 'react';
import { Plus, MessageSquare, Search, Trash2, Edit2, X, History, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ChatSidebar Component
 * Manages chat history and session switching
 */
const ChatSidebar = ({ sessions, currentSessionId, onSessionSelect, onNewChat, onDeleteSession, onRenameSession }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [editingId, setEditingId] = React.useState(null);
    const [editTitle, setEditTitle] = React.useState('');

    const filteredSessions = sessions.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStartEdit = (e, session) => {
        e.stopPropagation();
        setEditingId(session._id);
        setEditTitle(session.title);
    };

    const handleSaveEdit = (e) => {
        e.stopPropagation();
        if (editTitle.trim()) {
            onRenameSession(editingId, editTitle);
        }
        setEditingId(null);
    };

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-r border-white/10 w-64 md:w-80 overflow-hidden">
            {/* New Chat Button */}
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                >
                    <Plus size={18} className="text-cyber-cyan group-hover:rotate-90 transition-transform" />
                    <span className="font-bold text-white text-sm">New Chat</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan/30 placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
                <div className="px-3 mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <History size={10} />
                    <span>Recent History</span>
                </div>

                <AnimatePresence initial={false}>
                    {filteredSessions.map((session) => (
                        <motion.div
                            key={session._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => onSessionSelect(session._id)}
                            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session._id
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <MessageSquare
                                size={16}
                                className={currentSessionId === session._id ? 'text-cyber-cyan' : 'text-white/30'}
                            />

                            {editingId === session._id ? (
                                <input
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(e)}
                                    className="flex-1 bg-white/10 border-none outline-none text-xs text-white p-0"
                                />
                            ) : (
                                <span className="flex-1 text-xs text-white/70 truncate font-medium">
                                    {session.title}
                                </span>
                            )}

                            {/* Actions */}
                            <div className={`flex items-center gap-1 transition-opacity ${currentSessionId === session._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                <button
                                    onClick={(e) => handleStartEdit(e, session)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSession(session._id);
                                    }}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredSessions.length === 0 && (
                    <div className="py-20 text-center">
                        <MessageSquare size={24} className="mx-auto text-white/10 mb-2" />
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">
                            No chats found
                        </p>
                    </div>
                )}
            </div>

            {/* User Profile Summary (Optional) */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 flex items-center justify-center">
                        <GraduationCap size={16} className="text-cyber-purple" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Learning Path</div>
                        <div className="text-xs text-white font-bold italic">Cyber Defender</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;

