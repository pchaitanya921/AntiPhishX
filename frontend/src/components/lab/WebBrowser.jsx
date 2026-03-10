import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, Shield, Lock, Search, X } from 'lucide-react';

const WebBrowser = ({ content }) => {
    const { url } = content || {};
    const [currentUrl, setCurrentUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Robust URL extraction
        if (url?.fullUrl) {
            setCurrentUrl(url.fullUrl);
        } else if (typeof url === 'string') {
            setCurrentUrl(url);
        } else if (content?.fullUrl) {
            setCurrentUrl(content.fullUrl);
        } else if (typeof content === 'string' && content.startsWith('http')) {
            setCurrentUrl(content);
        }
    }, [url, content]);

    const handleNavigate = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <div className="flex flex-col h-full bg-[#35363a] rounded-lg overflow-hidden font-sans border border-[#202124]">
            {/* Tab Bar */}
            <div className="flex items-end px-2 pt-2 gap-2 bg-[#202124]">
                <div className="flex-1 max-w-[240px] h-8 bg-[#35363a] rounded-t-lg flex items-center justify-between px-3 text-xs text-white/90 relative group">
                    <div className="flex items-center gap-2 truncate">
                        <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3 opacity-70" />
                        <span className="truncate">{url?.domain || 'New Tab'}</span>
                    </div>
                    <X size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-white/10 rounded p-0.5" />
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-white/60 hover:bg-white/10 rounded-full mb-0.5 cursor-pointer">
                    <span className="text-xl leading-none">+</span>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-[#35363a] p-2 flex flex-col gap-1 border-b border-[#202124]">
                {/* Visual Label for Analysis */}
                <div className="flex items-center justify-center text-[10px] text-cyber-cyan font-bold tracking-wider uppercase mb-1">
                    🔍 Analyze the URL carefully before proceeding
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white/60">
                        <ArrowLeft size={16} className="cursor-pointer hover:text-white" />
                        <ArrowRight size={16} className="cursor-pointer hover:text-white opacity-50" />
                        <RotateCcw size={16} className={`cursor-pointer hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
                        <Home size={16} className="cursor-pointer hover:text-white ml-1" />
                    </div>

                    {/* Extensions / Menu */}
                    <div className="flex items-center gap-3 text-white/60 ml-auto">
                        <Shield size={16} className="cursor-pointer hover:text-white" />
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold cursor-pointer">
                            S
                        </div>
                        <div className="flex flex-col gap-0.5 cursor-pointer hover:bg-white/10 p-1 rounded">
                            <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                            <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                            <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookmarks Bar (Optional) */}
            <div className="bg-[#35363a] px-3 py-1 flex items-center gap-4 text-xs text-white/70 border-b border-[#202124]">
                <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3 grayscale opacity-70" />
                    <span>Login Page</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm opacity-70"></div>
                    <span>Corporate Portal</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded-sm opacity-70"></div>
                    <span>HR System</span>
                </div>
            </div>

            {/* Main Content Area (IFrame or Mock) */}
            <div className="flex-1 bg-white relative overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col">
                        {/* Mock Page Content based on URL type */}
                        <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
                            <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 min-h-[500px] p-10">
                                {/* Simulated Phishing Page Content */}
                                <div className="flex justify-center mb-8">
                                    <div className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">G</div>
                                        <span>Goggle</span>
                                        {/* Subtle typo for students to spot */}
                                    </div>
                                </div>
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="text-center text-xl text-slate-700">Sign in</div>
                                    <div className="text-center text-slate-600">to continue to GMail</div>

                                    <div className="space-y-4 pt-4">
                                        <input type="email" placeholder="Email or phone" className="w-full px-4 py-3 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                                        <div className="text-sm text-blue-600 font-medium cursor-pointer">Forgot email?</div>
                                    </div>

                                    <div className="text-sm text-slate-500 leading-relaxed">
                                        Not your computer? Use Guest mode to sign in privately. <span className="text-blue-600 font-medium cursor-pointer">Learn more</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-8">
                                        <div className="text-blue-600 font-medium cursor-pointer">Create account</div>
                                        <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">Next</button>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto mt-8 flex justify-between text-xs text-slate-500 px-4">
                                <div className="space-x-4">
                                    <span>English (United States)</span>
                                </div>
                                <div className="space-x-4">
                                    <span>Help</span>
                                    <span>Privacy</span>
                                    <span>Terms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebBrowser;
