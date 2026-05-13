import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, Zap, User, Sparkles, MessageSquare, AlertTriangle, ChevronRight } from 'lucide-react';

const ChatEnvironment = ({ content, level, onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const initialMessages = [
        {
            role: 'system',
            content: `SECURE CHANNEL ESTABLISHED - ${level?.toUpperCase()} CLEARANCE`,
            timestamp: new Date()
        },
        {
            role: 'attacker',
            content: content?.initialMessage || "Hello, I'm from the IT department. We're performing an emergency system audit. I need you to confirm your secondary authentication token for the migration.",
            timestamp: new Date()
        }
    ];

    useEffect(() => {
        setMessages(initialMessages);
    }, [content]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Attacker Response
        setTimeout(() => {
            setIsTyping(false);
            const response = content?.responses?.[messages.length] || "That's not what I expected. Please follow the protocol strictly to avoid system lockout.";
            setMessages(prev => [...prev, {
                role: 'attacker',
                content: response,
                timestamp: new Date()
            }]);
            
            // Emit telemetry for curiosity/hesitation
            window.dispatchEvent(new CustomEvent('labTelemetryUpdate', {
                detail: { curiositySusceptibility: 1 }
            }));
        }, 2000);
    };

    return (
        <div className="flex h-full w-full items-center justify-center p-6 bg-[#0d1117]">
            <div className="w-full max-w-2xl h-[600px] bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                {/* Header */}
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <User className="text-red-400" size={20} />
                        </div>
                        <div>
                            <div className="text-white font-black italic uppercase text-xs tracking-widest">EXTERNAL_CONTACT</div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] text-white/20 font-mono">ENCRYPTED_UPLINK</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Shield size={18} />
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'system' ? (
                                    <div className="w-full text-center py-2">
                                        <span className="text-[9px] font-mono text-white/20 bg-white/5 px-4 py-1 rounded-full uppercase tracking-[0.2em]">
                                            {msg.content}
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                                        msg.role === 'user' 
                                            ? 'bg-emerald-500 text-black font-medium rounded-tr-none' 
                                            : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <div className={`mt-2 text-[8px] uppercase tracking-widest font-black ${
                                            msg.role === 'user' ? 'text-black/40' : 'text-white/20'
                                        }`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2 p-4 bg-white/5 border border-white/5 rounded-2xl w-20"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]" />
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your response..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="absolute right-3 p-3 bg-emerald-500 text-black rounded-xl hover:bg-white transition-all disabled:opacity-20 disabled:grayscale"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Warning Banner */}
                <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 flex items-center gap-3">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className="text-[9px] font-black uppercase text-red-400/60 tracking-widest">
                        Warning: This interaction is part of a high-fidelity simulation.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatEnvironment;

