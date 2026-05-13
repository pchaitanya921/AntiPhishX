import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, MessageCircle, X, Maximize2, Minimize2, Send, Zap, 
    ShieldQuestion, CreditCard, LifeBuoy, Fingerprint, Award, 
    Settings, AlertCircle, HelpCircle, ArrowRight, ExternalLink 
} from 'lucide-react';
import aiService from '../../services/ai.service';
import { useAuth } from '../../context/AuthContext';

/**
 * FloatingSupportAI Component
 * Intelligent platform-aware customer support system.
 */
const FloatingSupportAI = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [suggestions, setSuggestions] = useState([
        "Why are my labs locked?",
        "How do I earn a certificate?",
        "Manage my devices",
        "Upgrade my plan"
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: `AntiPhishX Support AI Active. Hello ${user?.firstName || 'Learner'}, I've synchronized with your account profile. How can I assist your security operations today?`,
                    createdAt: new Date().toISOString()
                }
            ]);
        }
    }, [isOpen, user]);

    const handleSend = async (text = null) => {
        const messageToSend = text || inputValue;
        if (!messageToSend.trim() || isLoading) return;

        const userMsg = {
            role: 'user',
            content: messageToSend,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Using the specialized 'support' mode
            const response = await aiService.chat(null, messageToSend, 'support', { 
                platformContext: true 
            });
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.message.content,
                createdAt: new Date().toISOString()
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I've encountered a neural link interruption. Please try re-descibing your issue or contact enterprise support directly.",
                createdAt: new Date().toISOString(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    const quickActions = [
        { icon: CreditCard, label: "Subscription", query: "Show my subscription status" },
        { icon: ShieldQuestion, label: "Lab Access", query: "Explain my lab access limits" },
        { icon: Award, label: "Certifications", query: "What are my certification requirements?" },
        { icon: Settings, label: "Account", query: "How do I manage my devices?" }
    ];

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <MessageCircle size={28} className="relative z-10" />
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-ping pointer-events-none" />
                </motion.button>
            )}

            {/* Support Widget */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? '64px' : '650px',
                            width: isMinimized ? '300px' : '420px'
                        }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative group">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-50 animate-pulse" />
                                    <Zap size={18} className="text-emerald-400 relative z-10" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support AI <span className="text-emerald-500">Node</span></h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Platform Aware</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                                <button 
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent)]">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`
                                                max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed font-medium shadow-2xl
                                                ${msg.role === 'user' 
                                                    ? 'bg-emerald-500 text-black rounded-tr-none' 
                                                    : 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'}
                                                ${msg.isError ? 'border-red-500/20 bg-red-500/5 text-red-400' : ''}
                                            `}>
                                                {msg.content.split('\n').map((line, index) => (
                                                    <span key={index}>{line}<br/></span>
                                                ))}
                                                <div className={`text-[8px] mt-2 opacity-40 uppercase tracking-tighter ${msg.role === 'user' ? 'text-black' : 'text-white'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 ml-2">Analyzing Node Context...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Suggestion Chips */}
                                {!isLoading && messages.length > 0 && (
                                    <div className="px-6 pb-2 flex flex-wrap gap-2">
                                        {suggestions.map((suggestion, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-[9px] font-bold text-white/40 hover:text-emerald-400 transition-all uppercase tracking-wider"
                                            >
                                                {suggestion}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Quick Actions Grid */}
                                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestionClick(action.query)}
                                                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left group"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                                                    <action.icon size={14} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                                                </div>
                                                <span className="text-[9px] font-black text-white/20 group-hover:text-white uppercase tracking-widest">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Input Container */}
                                <div className="p-5 bg-white/[0.03] border-t border-white/5">
                                    <div className="relative group">
                                        <input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Sync with Support AI..."
                                            className="w-full h-16 bg-black/40 border border-white/10 rounded-[1.25rem] px-6 pr-14 text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                                        />
                                        <button 
                                            onClick={() => handleSend()}
                                            disabled={isLoading || !inputValue.trim()}
                                            className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all active:scale-90 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 mt-3">
                                        <button className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-white/40 transition-colors flex items-center gap-1.5">
                                            <HelpCircle size={10} /> FAQ Center
                                        </button>
                                        <div className="w-1 h-1 rounded-full bg-white/5" />
                                        <button className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-red-400/60 transition-colors flex items-center gap-1.5">
                                            <AlertCircle size={10} /> Report Bug
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingSupportAI;
