import React, { useState, useEffect, useRef } from 'react';
import { Signal, Wifi, Battery, ChevronLeft, Phone, Video, Info, Send, User, Mic, MicOff, Volume2 } from 'lucide-react';

const MobileDevice = ({ content, level, onComplete }) => {
    const { sms, call } = content || {};
    const type = sms ? 'sms' : 'call';

    // --- Call State Machine ---
    const [callStatus, setCallStatus] = useState('incoming'); // 'incoming', 'connected', 'ended', 'declined'
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const scrollRef = useRef(null);

    // Call Metadata
    const totalDuration = call?.duration || 60;
    const isExpert = level === 'expert';

    // --- Audio & Timer Logic ---
    useEffect(() => {
        let interval;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setDuration(prev => {
                    if (prev >= totalDuration) {
                        endCall();
                        return totalDuration;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus, totalDuration]);

    // Auto-scroll transcript
    useEffect(() => {
        if (scrollRef.current && callStatus === 'connected') {
            const activeElement = scrollRef.current.querySelector('[data-active="true"]');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [duration, callStatus]);

    const handleAnswer = async () => {
        setCallStatus('connected');
        if (audioRef.current) {
            try {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1.0;
                audioRef.current.muted = false;
                await audioRef.current.play();
            } catch (err) {
                console.error("Audio autoplay prevention caught:", err);
                // In a real app, we might show a fallback "Click to Unmute" here, 
                // but purely relying on the click gesture should work 99% of time.
            }
        }
    };

    const handleDecline = () => {
        setCallStatus('declined');
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const endCall = () => {
        setCallStatus('ended');
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (onComplete) onComplete();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Render Helpers ---

    // 1. Phone Screen Component
    const PhoneScreen = () => (
        <div className="w-[320px] h-[640px] bg-black rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden relative flex flex-col shrink-0">
            {/* Notch / Status Bar */}
            <div className="h-8 bg-black w-full flex items-center justify-between px-6 text-white text-xs z-20 select-none">
                <span className="font-medium">9:41</span>
                <div className="flex items-center gap-1.5 opacity-90">
                    <Signal size={12} fill="currentColor" />
                    <Wifi size={12} />
                    <Battery size={12} fill="currentColor" />
                </div>
            </div>

            {/* Helper to sync audio time state with react state for transcript */}
            {call?.audioUrl && (
                <audio
                    ref={audioRef}
                    src={call.audioUrl}
                    preload="auto"
                    onTimeUpdate={() => {
                        if (audioRef.current && Math.abs(audioRef.current.currentTime - duration) > 1) {
                            // Sync state if drift occurs (though we mostly drive by timer for simulation UI)
                            // Actually better to drive UI by audio time if audio exists
                            setDuration(audioRef.current.currentTime);
                        }
                    }}
                    onEnded={endCall}
                />
            )}

            {/* In-Call Interface */}
            {type === 'call' && (
                <div className="flex-1 bg-slate-900 flex flex-col relative pt-12 items-center text-white">
                    {/* Background Gradient/Image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0 opacity-50" />

                    {/* Caller Info */}
                    <div className="z-10 flex flex-col items-center mt-8 space-y-4">
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-1000 ${callStatus === 'incoming' ? 'animate-pulse bg-slate-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                            <span className="text-4xl font-light">{(call?.caller || 'U')[0]}</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold tracking-wide">{call?.caller || 'Unknown Caller'}</h2>
                            <p className="text-slate-400 text-sm mt-1">{callStatus === 'incoming' ? 'Incoming Call...' : callStatus === 'connected' ? formatTime(duration) : 'Call Ended'}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-auto mb-16 w-full px-8 z-10">
                        {callStatus === 'incoming' && (
                            <div className="flex justify-between items-center px-4">
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleDecline}
                                        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                                    >
                                        <Phone size={28} className="fill-current rotate-[135deg]" />
                                    </button>
                                    <span className="text-xs font-medium tracking-wide">Decline</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleAnswer}
                                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 active:scale-95 transition-all animate-bounce-subtle"
                                    >
                                        <Phone size={28} className="fill-current" />
                                    </button>
                                    <span className="text-xs font-medium tracking-wide">Answer</span>
                                </div>
                            </div>
                        )}

                        {callStatus === 'connected' && (
                            <div className="flex flex-col items-center space-y-8">
                                <div className="grid grid-cols-3 gap-6 w-full max-w-[240px]">
                                    {/* Fake Mute/Keypad/Speaker buttons for realism */}
                                    <div className="flex flex-col items-center gap-1 opacity-50">
                                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center"><MicOff size={24} /></div>
                                        <span className="text-[10px]">Mute</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 opacity-50">
                                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center"><Video size={24} /></div>
                                        <span className="text-[10px]">Video</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 opacity-100">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center"><Volume2 size={24} /></div>
                                        <span className="text-[10px]">Speaker</span>
                                    </div>
                                </div>

                                <button
                                    onClick={endCall}
                                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                                >
                                    <Phone size={28} className="fill-current rotate-[135deg]" />
                                </button>
                            </div>
                        )}

                        {(callStatus === 'ended' || callStatus === 'declined') && (
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={onComplete}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-medium transition-colors border border-slate-700"
                                >
                                    Proceed to Analysis
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SMS Interface (Existing Logic preserved accurately) */}
            {type === 'sms' && (
                <div className="flex-1 bg-white relative overflow-hidden flex flex-col font-sans">
                    {/* App Header */}
                    <div className="bg-[#f5f5f5] border-b border-slate-200 p-3 flex items-center gap-3">
                        <ChevronLeft size={24} className="text-blue-500 cursor-pointer" />
                        <div className="flex-1 flex flex-col items-center pr-8">
                            <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                                <User size={16} />
                            </div>
                            <span className="text-xs font-semibold text-slate-800">{sms?.sender || 'Unknown'}</span>
                        </div>
                        <Info size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4">
                        <div className="text-center text-[10px] text-slate-400 font-medium">{sms?.timestamp || 'Today 9:41 AM'}</div>
                        <div className="flex justify-start">
                            <div className="max-w-[80%] bg-[#e9e9eb] text-black px-4 py-2 rounded-2xl rounded-bl-sm text-sm p-2">
                                <p className="whitespace-pre-wrap">{sms?.message}</p>
                                {sms?.links && sms.links.length > 0 && (
                                    <div className="mt-2 bg-white rounded-xl p-2 border border-slate-200 cursor-pointer hover:bg-slate-50">
                                        <div className="text-xs font-semibold truncate text-slate-800">Verify Account</div>
                                        <div className="text-[10px] text-slate-400 truncate">{sms.links[0]}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><span className="text-xl leading-none font-light mb-0.5">+</span></div>
                        <div className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-sm text-slate-400 cursor-not-allowed">Text Message</div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white opacity-50"><Send size={14} fill="currentColor" className="ml-0.5" /></div>
                    </div>
                </div>
            )}

            {/* Home Indicator */}
            <div className="h-1 w-1/3 bg-white/20 rounded-full mx-auto my-2 absolute bottom-1 left-1/3 z-30 mix-blend-difference"></div>
        </div>
    );

    return (
        <div className="flex h-full w-full justify-center gap-8 p-4 bg-transparent">
            {/* Left: Phone Simulator */}
            <div className="flex items-center justify-center">
                <PhoneScreen />
            </div>

            {/* Right: Live Transcript (Desktop Only) */}
            {type === 'call' && callStatus === 'connected' && (
                <div className="hidden lg:flex flex-col w-[300px] xl:w-[350px] h-[600px] bg-slate-900/40  rounded-2xl border border-white/5 overflow-hidden shadow-2xl animate-fade-in-right self-center">
                    <div className="p-4 border-b border-white/5 bg-slate-900/60 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Live Transcript</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{formatTime(duration)}</span>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth">
                        {Array.isArray(call?.transcript) ? (
                            call.transcript.map((line, idx) => {
                                const nextLineTime = call.transcript[idx + 1]?.time || totalDuration;
                                const isActive = duration >= line.time && duration < nextLineTime;

                                return (
                                    <div
                                        key={idx}
                                        data-active={isActive}
                                        className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
                                    >
                                        <div className="flex items-baseline justify-between mb-1">
                                            <span className={`text-xs font-bold uppercase ${line.speaker === 'You' ? 'text-blue-400' : 'text-purple-400'}`}>
                                                {line.speaker}
                                            </span>
                                            <span className="text-[10px] text-slate-600 font-mono">{formatTime(line.time)}</span>
                                        </div>
                                        <p className={`text-sm leading-relaxed text-slate-200 ${isExpert ? ' hover: transition-all cursor-crosshair' : ''}`}>
                                            {line.text}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-500 text-sm italic">
                                Detailed transcript unavailable for this simulation.
                            </div>
                        )}

                        {/* Spacer for bottom scrolling */}
                        <div className="h-10" />
                    </div>
                </div>
            )}
            {type === 'call' && callStatus === 'incoming' && (
                <div className="hidden lg:flex flex-col w-[300px] xl:w-[350px] h-[200px] justify-center text-slate-400 text-sm italic self-center text-center animate-pulse">
                    Waiting for call to connect...
                </div>
            )}
            {type === 'call' && (callStatus === 'ended' || callStatus === 'declined') && (
                <div className="hidden lg:flex flex-col w-[300px] xl:w-[350px] h-[600px] bg-slate-900/20  rounded-2xl border border-white/5 items-center justify-center self-center">
                    <div className="text-slate-500 text-lg font-light">Call Session Ended</div>
                </div>
            )}
        </div>
    );
};

export default MobileDevice;

