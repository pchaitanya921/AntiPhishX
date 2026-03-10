import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, Menu, X } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModeSelector from './ModeSelector';
import ChatSidebar from './ChatSidebar';
import aiService from '../../services/ai.service';

/**
 * ChatInterface Component
 * Main AI chat interface with multi-mode support and history
 */
const ChatInterface = ({ initialMode = 'cyber', labContext = null, isCompact = false }) => {
    const [mode, setMode] = useState(isCompact ? 'lab' : initialMode);
    const [sessionId, setSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isCompact);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Set mode to lab if compact and initial mode is default
    useEffect(() => {
        if (isCompact) {
            setMode('lab');
        }
    }, [isCompact]);

    // Load sessions on mount or mode change
    useEffect(() => {
        if (!isCompact) {
            loadSessions();
        }
    }, [mode, isCompact]);

    const loadSessions = async () => {
        try {
            const data = await aiService.getSessions(mode);
            setSessions(data);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        }
    };

    const handleNewChat = () => {
        const welcomeMessages = {
            lab: labContext
                ? `Hello! I see you're working on the "${labContext.topic}" lab (Level: ${labContext.level}). I'm here to help you analyze indicators without giving away the answer. What are you looking at right now?`
                : 'Hello! I\'m your Lab Assistant. I\'ll guide you through this lab using questions and hints. Let\'s analyze the indicators together!',
            cyber: 'Hi! I\'m your Cyber Security mentor. Ask me anything about phishing, malware, SOC operations, or defensive security.',
            instructor: 'Welcome, Administrator. I can help you generate labs, create scenarios, and analyze content. What would you like to create?'
        };

        setMessages([{
            role: 'assistant',
            content: welcomeMessages[mode],
            createdAt: new Date().toISOString()
        }]);
        setSessionId(null);
        setError(null);
    };

    const handleSessionSelect = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aiService.getSession(id);
            setSessionId(id);
            setMessages(data.messages);
            setMode(data.session.mode);
        } catch (err) {
            setError('Failed to load chat history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async (id) => {
        try {
            await aiService.deleteSession(id);
            setSessions(prev => prev.filter(s => s._id !== id));
            if (sessionId === id) {
                handleNewChat();
            }
        } catch (err) {
            setError('Failed to delete session');
        }
    };

    const handleRenameSession = async (id, title) => {
        try {
            await aiService.updateSession(id, title);
            setSessions(prev => prev.map(s => s._id === id ? { ...s, title } : s));
        } catch (err) {
            setError('Failed to rename session');
        }
    };

    // Add welcome message when mode changes (only if no session selected)
    useEffect(() => {
        if (!sessionId) {
            handleNewChat();
        }
    }, [mode, labContext]);

    const handleSend = async (message) => {
        if (!message.trim() || isLoading) return;

        // Add user message immediately
        const userMessage = {
            role: 'user',
            content: message,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Build context
            const context = { ...labContext };

            // Send to API
            const response = await aiService.chat(sessionId, message, mode, context);

            // Update session ID if new
            if (!sessionId && response.data.sessionId) {
                setSessionId(response.data.sessionId);
                if (!isCompact) loadSessions(); // Refresh list to show new session
            }

            // Add AI response
            setMessages(prev => [...prev, {
                ...response.data.message,
                role: 'assistant'
            }]);
        } catch (err) {
            // Handle violations
            if (err.type === 'ANTI_CHEAT_VIOLATION' || err.type === 'TOPIC_RESTRICTION') {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: err.message,
                    createdAt: new Date().toISOString(),
                    isWarning: true
                }]);
            } else {
                setError(err.message || 'Failed to send message');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-1 bg-[#0d1117] overflow-hidden ${isCompact ? 'text-xs' : ''}`}>
            {/* Sidebar (Hidden in Compact Mode) */}
            {!isCompact && (
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block h-full border-r border-white/5`}>
                    <ChatSidebar
                        sessions={sessions}
                        currentSessionId={sessionId}
                        onSessionSelect={handleSessionSelect}
                        onNewChat={handleNewChat}
                        onDeleteSession={handleDeleteSession}
                        onRenameSession={handleRenameSession}
                    />
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Sidebar Toggle (Hidden in Compact Mode) */}
                {!isCompact && (
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                )}

                {/* Header */}
                <div className={`p-4 border-b border-white/10 ${isCompact ? 'py-3' : 'py-6 bg-white/[0.02]'}`}>
                    <div className={`${isCompact ? 'max-w-4xl' : 'max-w-6xl'} mx-auto flex flex-col md:flex-row md:items-center gap-4 ${isCompact ? 'gap-2' : ''}`}>
                        <div className="flex items-center gap-3">
                            <Sparkles size={isCompact ? 16 : 24} className="text-cyber-cyan" />
                            <h2 className={`${isCompact ? 'text-sm' : 'text-2xl'} font-black text-white italic uppercase tracking-tighter`}>AI COPILOT</h2>
                        </div>
                        {/* Mode Selector (Hidden in Compact Mode to prevent mode switching within labs) */}
                        {!isCompact && (
                            <div className="flex-1">
                                <ModeSelector currentMode={mode} onModeChange={setMode} />
                            </div>
                        )}
                        {isCompact && (
                            <div className="text-[10px] font-black text-cyber-cyan/60 uppercase tracking-widest ml-auto">
                                Lab Assistant Active
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar">
                    <div className={`${isCompact ? 'max-w-4xl' : 'max-w-6xl'} mx-auto`}>
                        <AnimatePresence initial={false}>
                            {messages.map((message, i) => (
                                <MessageBubble
                                    key={message.id || i}
                                    message={message}
                                    isUser={message.role === 'user'}
                                />
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4 mb-6"
                            >
                                <div className={`w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center ${isCompact ? 'w-6 h-6' : ''}`}>
                                    <Sparkles size={isCompact ? 12 : 16} className="text-cyber-cyan animate-pulse" />
                                </div>
                                <div className={`flex gap-2 items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl ${isCompact ? 'py-2 px-3' : ''}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                            >
                                <AlertTriangle size={isCompact ? 16 : 20} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm font-bold text-red-400">Error</div>
                                    <div className="text-sm text-red-300">{error}</div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <ChatInput
                    onSend={handleSend}
                    isLoading={isLoading}
                    disabled={false}
                />
            </div>
        </div>
    );
};

export default ChatInterface;
