import React, { useState, useEffect, useRef } from 'react';
import {
    Phone, MicOff, Video, Volume2, Signal, Wifi, Battery,
    AlertTriangle, Clock, Shield, User, PhoneOff, ChevronRight
} from 'lucide-react';

/**
 * VishingEnvironment
 * Renders a vishing lab as an iPhone-style incoming call screen with a
 * live scrolling transcript panel. Reads from content.callTranscript,
 * content.callerID, content.callDuration.
 */
const VishingEnvironment = ({ content, level, onComplete }) => {
    const callerID = content?.callerID || content?.caller || 'Unknown / Spoofed';
    const duration = content?.callDuration || content?.duration || '3–5 minutes';
    const indicators = content?.indicators || [];

    // Parse transcript: support both string (callTranscript) and array (transcript)
    const rawTranscript = content?.callTranscript || '';
    const transcriptLines = parseTranscript(rawTranscript, content?.transcript);

    const [callStatus, setCallStatus] = useState('incoming'); // incoming | connected | ended | declined
    const [elapsed, setElapsed] = useState(0);
    const [revealIdx, setRevealIdx] = useState(0);
    const scrollRef = useRef(null);
    const timerRef = useRef(null);

    const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    // Drive transcript reveal by elapsed seconds
    useEffect(() => {
        if (callStatus !== 'connected') return;
        timerRef.current = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [callStatus]);

    // Reveal one new transcript line every ~4 seconds
    useEffect(() => {
        if (transcriptLines.length === 0) return;
        const idx = Math.min(Math.floor(elapsed / 4), transcriptLines.length - 1);
        setRevealIdx(idx);
    }, [elapsed, transcriptLines.length]);

    // Auto-scroll transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [revealIdx]);

    const handleAnswer = () => {
        const hesitation = elapsed; // Time from incoming to answer
        window.dispatchEvent(new CustomEvent('labTelemetryUpdate', {
            detail: {
                hesitationPatterns: [hesitation],
                urgencySusceptibility: hesitation < 2 ? 1 : 0 // Faster answer might indicate high urgency susceptibility
            }
        }));
        setCallStatus('connected');
    };
    const handleDecline = () => { setCallStatus('declined'); clearInterval(timerRef.current); };
    const handleEnd = () => {
        setCallStatus('ended');
        clearInterval(timerRef.current);
        if (onComplete) onComplete();
    };

    const isExpert = level === 'expert';

    return (
        <div className="flex h-full w-full items-center justify-center gap-8 p-6">

            {/* ─── Phone Device ─── */}
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

                {/* Call Screen */}
                <div className="flex-1 bg-gradient-to-b from-slate-800 via-slate-900 to-black flex flex-col items-center relative overflow-hidden">

                    {/* Blurred radial glow */}
                    <div className={`absolute top-8 w-48 h-48 rounded-full  transition-all duration-1000 ${callStatus === 'connected' ? 'bg-green-900/40' : callStatus === 'incoming' ? 'bg-indigo-900/40 animate-pulse' : 'bg-red-900/30'}`} />

                    {/* Caller Info */}
                    <div className="z-10 flex flex-col items-center mt-10 space-y-3">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${callStatus === 'incoming' ? 'bg-slate-700 animate-pulse' : callStatus === 'connected' ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-slate-800'}`}>
                            <User size={40} className="text-white/80" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-white tracking-wide">{callerID}</h2>
                            <p className="text-slate-400 text-xs mt-1">
                                {callStatus === 'incoming' ? 'Incoming Call…'
                                    : callStatus === 'connected' ? `🔴 ${fmt(elapsed)}`
                                        : callStatus === 'declined' ? 'Call Declined'
                                            : 'Call Ended'}
                            </p>
                            {callStatus === 'incoming' && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-medium border border-yellow-500/30">
                                    <AlertTriangle size={9} /> Unknown / Spoofed Number
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Duration estimate badge */}
                    {callStatus === 'incoming' && (
                        <div className="mt-4 flex items-center gap-1.5 text-slate-400 text-xs">
                            <Clock size={12} />
                            <span>Estimated call: {duration}</span>
                        </div>
                    )}

                    {/* Call Controls */}
                    <div className="mt-auto mb-10 w-full px-8 z-10">
                        {callStatus === 'incoming' && (
                            <div className="flex justify-between items-center px-2">
                                <div className="flex flex-col items-center gap-2">
                                    <button onClick={handleDecline}
                                        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all active:scale-95">
                                        <PhoneOff size={26} className="text-white" />
                                    </button>
                                    <span className="text-white/60 text-[11px]">Decline</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <button onClick={handleAnswer}
                                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-all active:scale-95 animate-[bounce_1.5s_infinite]">
                                        <Phone size={26} className="text-white fill-white" />
                                    </button>
                                    <span className="text-white/60 text-[11px]">Answer</span>
                                </div>
                            </div>
                        )}

                        {callStatus === 'connected' && (
                            <div className="flex flex-col items-center gap-5">
                                <div className="grid grid-cols-3 gap-4">
                                    {[['Mute', MicOff], ['Keypad', Video], ['Speaker', Volume2]].map(([label, Icon]) => (
                                        <div key={label} className="flex flex-col items-center gap-1 opacity-50">
                                            <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-slate-700 flex items-center justify-center">
                                                <Icon size={20} className="text-white" />
                                            </div>
                                            <span className="text-white/50 text-[10px]">{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleEnd}
                                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all active:scale-95">
                                    <PhoneOff size={26} className="text-white" />
                                </button>
                            </div>
                        )}

                        {(callStatus === 'ended' || callStatus === 'declined') && (
                            <div className="flex justify-center">
                                <button onClick={handleEnd}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all border border-white/10 flex items-center gap-2">
                                    Proceed to Analysis <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Home Indicator */}
                <div className="h-1 w-1/3 bg-white/20 rounded-full mx-auto my-2 absolute bottom-1 left-1/3" />
            </div>

            {/* ─── Transcript Panel (desktop) ─── */}
            <div className="hidden lg:flex flex-col w-[360px] h-[580px] bg-slate-900/60  rounded-2xl border border-white/5 overflow-hidden shadow-2xl self-center">
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">Call Transcript</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{callStatus === 'connected' ? fmt(elapsed) : callStatus}</span>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
                    {callStatus === 'incoming' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm italic animate-pulse">
                            Answer the call to view the transcript…
                        </div>
                    )}

                    {(callStatus === 'connected' || callStatus === 'ended') && transcriptLines.length > 0 && (
                        transcriptLines.slice(0, revealIdx + 1).map((line, idx) => (
                            <div key={idx} className="space-y-1">
                                {line.speaker !== 'INFO' && (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${line.speaker === 'EMPLOYEE' || line.speaker === 'You' ? 'text-blue-400' : 'text-purple-400'}`}>
                                        {line.speaker}
                                    </span>
                                )}
                                <p className={`text-sm text-slate-200 leading-relaxed ${line.speaker === 'INFO' ? 'italic text-slate-400' : ''}`}>
                                    {line.text}
                                </p>
                            </div>
                        ))
                    )}

                    {callStatus === 'connected' && transcriptLines.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-300 text-sm italic">
                            No detailed transcript available. Review the scenario panel.
                        </div>
                    )}

                    {(callStatus === 'declined') && (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
                            Call was declined — no transcript to display.
                        </div>
                    )}

                    <div className="h-6" />
                </div>

                {/* Indicators panel */}
                {indicators.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/5 bg-slate-900/40">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-1">
                            <Shield size={10} /> Artifacts / Indicators
                        </p>
                        <ul className="space-y-1">
                            {indicators.slice(0, 4).map((ind, i) => (
                                <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    <span className="leading-relaxed">{ind}</span>
                                </li>
                            ))}
                            {indicators.length > 4 && (
                                <li className="text-[10px] text-slate-600 italic">+{indicators.length - 4} more in Scenario panel</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Transcript Parser ────────────────────────────────────────────────────────
// Handles string format "CALLER: \"...\"\n\nEMPLOYEE: \"...\"" OR array format
function parseTranscript(rawString, arrayTranscript) {
    // If array form is already provided, use it
    if (Array.isArray(arrayTranscript) && arrayTranscript.length > 0) {
        return arrayTranscript.map(l => ({ speaker: l.speaker || 'Unknown', text: l.text || '' }));
    }
    if (!rawString || typeof rawString !== 'string') return [];

    const lines = [];
    const blocks = rawString.split(/\n\n+/);
    
    for (const block of blocks) {
        if (!block.trim()) continue;
        
        // Find if this block has a colon in the first line
        const firstLineEnd = block.indexOf('\n') === -1 ? block.length : block.indexOf('\n');
        const firstLine = block.substring(0, firstLineEnd);
        const colonIndex = firstLine.indexOf(':');
        
        if (colonIndex !== -1 && colonIndex < 80) { // Limit length to avoid matching long sentences
            const speaker = firstLine.substring(0, colonIndex).trim().toUpperCase();
            let text = block.substring(colonIndex + 1).trim();
            // clean up quotes
            text = text.replace(/^"|"$/g, '').trim();
            text = text.replace(/\\"/g, '"');
            lines.push({ speaker, text });
        } else {
            lines.push({ speaker: 'INFO', text: block.trim() });
        }
    }

    return lines;
}

export default VishingEnvironment;

