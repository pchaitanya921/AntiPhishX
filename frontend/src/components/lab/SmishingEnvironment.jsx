import React, { useRef, useEffect } from 'react';
import {
    Signal, Wifi, Battery, ChevronLeft, Info, Send, User,
    AlertTriangle, Shield, ExternalLink
} from 'lucide-react';

/**
 * SmishingEnvironment
 * Renders a smishing lab as an iPhone-style SMS thread.
 * Reads from content.smsThread (array) for the full conversation,
 * or content.sms (legacy single-message format).
 */
const SmishingEnvironment = ({ content, level, onComplete }) => {
    // Support both smsThread (new multi-message format) and sms (legacy single)
    const thread = buildThread(content);
    const senderName = thread[0]?.sender || content?.sender || 'Unknown';
    const indicators = content?.indicators || [];
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [thread]);

    const isExpert = level === 'expert';

    return (
        <div className="flex h-full w-full items-center justify-center gap-8 p-6">

            {/* ─── iPhone Device ─── */}
            <div className="w-[300px] h-[620px] bg-black rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-hidden relative flex flex-col shrink-0">

                {/* Status Bar */}
                <div className="h-7 bg-black flex items-center justify-between px-5 text-white text-[11px] select-none">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1.5">
                        <Signal size={11} fill="currentColor" />
                        <Wifi size={11} />
                        <Battery size={11} fill="currentColor" />
                    </div>
                </div>

                {/* Messages App */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">

                    {/* Header */}
                    <div className="bg-[#f2f2f7] border-b border-slate-200 px-3 py-2 flex items-center gap-2">
                        <ChevronLeft size={22} className="text-blue-500" />
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white mb-0.5">
                                <User size={15} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[160px]">{senderName}</span>
                        </div>
                        <Info size={18} className="text-blue-500" />
                    </div>

                    {/* Thread Body */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-white">

                        {/* Date header */}
                        {thread[0] && (
                            <div className="text-center text-[10px] text-slate-400 font-medium py-1">
                                {thread[0].time || 'Today'}
                            </div>
                        )}

                        {thread.map((msg, idx) => {
                            const isUser = isUserMessage(msg.sender);
                            const isSystem = msg.system;

                            if (isSystem) {
                                return (
                                    <div key={idx} className="text-center text-[10px] text-slate-400 italic py-1">
                                        {msg.message}
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                    {/* Time label for non-first messages */}
                                    {idx > 0 && msg.time && msg.time !== thread[idx - 1]?.time && (
                                        <div className="text-center text-[10px] text-slate-400 font-medium w-full py-1">{msg.time}</div>
                                    )}

                                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-sm
                                        ${isUser
                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                            : 'bg-[#e9e9eb] text-black rounded-bl-sm'
                                        }
                                        ${isExpert ? 'blur-sm hover:blur-none transition-all cursor-crosshair' : ''}
                                    `}>
                                        <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.message}</p>

                                        {/* Inline link preview */}
                                        {msg.link && (
                                            <div className={`mt-2 rounded-xl p-2 border text-[10px] flex items-start gap-1.5 ${isUser ? 'bg-blue-600 border-blue-400' : 'bg-white border-slate-200'}`}>
                                                <ExternalLink size={11} className={isUser ? 'text-blue-200 mt-0.5' : 'text-slate-400 mt-0.5'} />
                                                <div>
                                                    <div className={`font-semibold truncate ${isUser ? 'text-white' : 'text-slate-800'}`}>
                                                        {extractDomain(msg.link)}
                                                    </div>
                                                    <div className={`truncate text-[9px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {msg.link.replace(/\[\.?\]/g, '.').substring(0, 50)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input bar (disabled — read-only simulation) */}
                    <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <span className="text-lg leading-none font-light">+</span>
                        </div>
                        <div className="flex-1 bg-white border border-slate-300 rounded-full px-3 py-1 text-xs text-slate-400 cursor-not-allowed select-none">
                            Text Message
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-400/50 flex items-center justify-center shrink-0">
                            <Send size={12} className="text-white ml-0.5" fill="white" />
                        </div>
                    </div>
                </div>

                {/* Home indicator */}
                <div className="h-1 w-1/3 bg-white/20 rounded-full mx-auto absolute bottom-1 left-1/3" />
            </div>

            {/* ─── Analysis Panel (desktop) ─── */}
            <div className="hidden lg:flex flex-col w-[360px] h-[580px] bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl self-center">

                {/* Panel Header */}
                <div className="px-5 py-3 border-b border-white/5 bg-slate-900/60">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-yellow-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">SMS Analysis</span>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="px-5 py-4 border-b border-white/5 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Sender Identity</p>
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                            <User size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{senderName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Source unknown — no verified business profile</p>
                        </div>
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                        <Shield size={10} /> Smishing Indicators
                    </p>
                    {indicators.length > 0 ? (
                        <ul className="space-y-2.5">
                            {indicators.map((ind, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                                    <span className="text-[12px] text-slate-300 leading-relaxed">{ind}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600 text-xs italic">Analyze the thread to identify smishing indicators.</p>
                    )}
                </div>

                {/* Messages count */}
                <div className="px-5 py-3 border-t border-white/5 bg-slate-900/40">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{thread.filter(m => !m.system).length} messages in thread</span>
                        <span className="text-yellow-500/80 font-medium">{indicators.length} indicators flagged</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUserMessage(sender) {
    if (!sender) return false;
    const s = sender.toLowerCase();
    return s === 'you' || s === 'user' || s === 'me' || s === 'employee' || s === 'victim';
}

function extractDomain(url) {
    if (!url) return '';
    try {
        const cleaned = url.replace(/\[\.?\]/g, '.').replace(/^\[/, '').replace(/\]$/, '');
        const u = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
        return u.hostname;
    } catch {
        return url.substring(0, 40);
    }
}

/**
 * Build a normalized thread array from various content shapes.
 * Supports:
 *   - content.smsThread: [{time, sender, message}]
 *   - content.sms: {sender, message, timestamp, links:[]}
 *   - content.thread (old shape)
 */
function buildThread(content) {
    if (!content) return [];

    // New shape: smsThread array
    if (Array.isArray(content.smsThread) && content.smsThread.length > 0) {
        return content.smsThread.map(msg => ({
            time: msg.time || '',
            sender: msg.sender || 'Unknown',
            message: msg.message || '',
            link: extractFirstUrl(msg.message),
        }));
    }

    // Legacy single-message shape
    if (content.sms) {
        const s = content.sms;
        const msgs = [{
            time: s.timestamp || 'Today',
            sender: s.sender || 'Unknown',
            message: s.message || '',
            link: s.links?.[0] || extractFirstUrl(s.message),
        }];
        return msgs;
    }

    // Old thread array
    if (Array.isArray(content.thread)) {
        return content.thread.map(msg => ({
            time: msg.time || '',
            sender: msg.sender || msg.from || 'Unknown',
            message: msg.message || msg.text || '',
            link: extractFirstUrl(msg.message || msg.text || ''),
        }));
    }

    return [];
}

function extractFirstUrl(text) {
    if (!text) return null;
    const match = text.match(/https?:\/\/[^\s]+/i) || text.match(/[a-z0-9-]+\.[a-z]{2,}\/[^\s]*/i);
    return match ? match[0] : null;
}

export default SmishingEnvironment;
