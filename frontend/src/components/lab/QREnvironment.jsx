import React, { useState } from 'react';
import { Scan, Smartphone, ExternalLink, ArrowRight, X } from 'lucide-react';
import MobileDevice from './MobileDevice';

const QREnvironment = ({ content, onComplete }) => {
    const [scanning, setScanning] = useState(false);
    const [scannedUrl, setScannedUrl] = useState(null);
    const [showPhone, setShowPhone] = useState(false);
    const [browserOpen, setBrowserOpen] = useState(false);

    // Mock content if missing (fallback)
    const flyerImage = content?.flyer_image || 'https://images.unsplash.com/photo-1595079676339-1534827d2c31?q=80&w=1000&auto=format&fit=crop';
    const qrLink = content?.qr_link || content?.link || 'http://malicious-site.com/login';

    // Simulate Scan Process
    const handleScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setScannedUrl(qrLink);
        }, 2000);
    };

    const handleOpenBrowser = () => {
        setBrowserOpen(true);
    };

    return (
        <div className="flex h-full w-full bg-[#1a1a1a] relative overflow-hidden">
            {/* Split Screen Layout */}

            {/* LEFT: Physical World (Flyer/Poster) */}
            <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-500 ${showPhone ? 'w-1/2 scale-90 opacity-50 ' : 'w-full'}`}>
                <div className="relative max-w-md w-full bg-white rounded-sm shadow-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    {/* Simulated Flyer Content */}
                    <div className="border-4 border-dashed border-slate-300 p-4 flex flex-col items-center text-center space-y-4">
                        <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                            {/* Placeholder for specific flyer image if URL provided, else generic icon */}
                            <img src="/qr-code-placeholder.png" alt="QR Code" className="w-32 h-32 object-contain mix-blend-multiply opacity-80" />
                        </div>
                        <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">URGENT NOTICE</h2>
                        <p className="text-slate-800 font-serif leading-tight">
                            Package delivery attempt failed.
                            Scan below to reschedule immediately or return to sender.
                        </p>

                        {/* The QR Code - Interactive Trigger */}
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => setShowPhone(true)}
                        >
                            <div className="w-40 h-40 bg-white border-2 border-black p-2">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrLink)}`}
                                    alt="Malicious QR"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                    <Smartphone size={14} />
                                    <span>Scan with Phone</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-500">Ref: #883-292-11</p>
                    </div>

                    {/* Tape Effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-200/80 rotate-2 shadow-sm"></div>
                </div>

                {!showPhone && (
                    <p className="mt-8 text-white/50 animate-pulse text-sm">
                        Hover over the QR code and click to scan with your secure device.
                    </p>
                )}
            </div>

            {/* RIGHT: Mobile Device Overlay (Scrollable) */}
            <div className={`
                fixed inset-y-0 right-0 w-[330px] bg-black/90  shadow-2xl border-l border-white/10
                transform transition-transform duration-500 z-50 flex flex-col items-center overflow-y-auto custom-scrollbar
                ${showPhone ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="w-full flex justify-between items-center p-4">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Secure Scanner</span>
                    <button
                        onClick={() => {
                            setShowPhone(false);
                            setBrowserOpen(false);
                        }}
                        className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="my-auto pb-10 flex flex-col items-center">
                    {/* Phone Frame */}
                    <div className="w-[300px] h-[600px] bg-black rounded-[40px] border-[8px] border-slate-800 overflow-hidden relative shadow-2xl shrink-0">
                        {browserOpen ? (
                            /* Simulated Browser View */
                            <div className="absolute inset-0 bg-white flex flex-col">
                                {/* Browser Toolbar */}
                                <div className="h-16 bg-slate-100 border-b flex items-end pb-2 px-4 gap-2">
                                    <div className="flex-1 h-8 bg-slate-200 rounded px-2 flex items-center text-[10px] text-slate-500 truncate">
                                        {qrLink}
                                    </div>
                                </div>
                                {/* Browser Content (Simulated) */}
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                                        <ExternalLink size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">External Link Opened</h3>
                                    <p className="text-sm text-slate-500">
                                        You have successfully navigated to the target URL. Use the artifacts here for your analysis.
                                    </p>
                                    <div className="p-3 bg-yellow-50 text-yellow-800 text-xs border border-yellow-200 rounded">
                                        <strong>Simulation Note:</strong> In a real scenario, this page might act as a credential harvester.
                                    </div>

                                    <button
                                        onClick={() => setBrowserOpen(false)}
                                        className="mt-8 text-blue-500 text-sm font-medium hover:underline"
                                    >
                                        Return to Scanner
                                    </button>
                                </div>
                            </div>
                        ) : !scannedUrl ? (
                            /* Camera Viewfinder UI */
                            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                                {/* Simulated Camera Feed Background */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="w-full h-full bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px]"></div>
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    {scanning ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-48 h-48 border-2 border-cyber-cyan relative animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyber-cyan"></div>
                                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyber-cyan"></div>
                                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyber-cyan"></div>
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyber-cyan"></div>

                                                {/* Scan Line */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan/50 shadow-[0_0_10px_#0ff] animate-scan-line"></div>
                                            </div>
                                            <span className="text-cyber-cyan font-mono text-xs tracking-wider">DECODING...</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleScan}
                                            className="group flex flex-col items-center gap-4"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Scan size={32} className="text-white" />
                                            </div>
                                            <span className="text-white font-medium text-sm">Tap to Scan QR</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Scanned Result UI */
                            <div className="absolute inset-0 bg-slate-900 flex flex-col">
                                <div className="h-16 bg-slate-800 flex items-center justify-center border-b border-white/10">
                                    <span className="text-white font-semibold">QR Code Detected</span>
                                </div>

                                <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 shrink-0">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 block">Decoded Link</span>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                                                <ExternalLink size={20} className="text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-blue-300 font-mono text-sm break-all">{scannedUrl}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 shrink-0">
                                        <button
                                            onClick={handleOpenBrowser}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            Open in Browser
                                            <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setScannedUrl(null);
                                                setScanning(false);
                                            }}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional "Close Phone" button below the device for clarity */}
                    <button
                        onClick={() => setShowPhone(false)}
                        className="mt-6 text-white/50 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <X size={14} /> Close Device
                    </button>
                </div>

                {/* Footer Action - only shows after getting result or interacting */}
                {(scannedUrl || browserOpen) && (
                    <div className="mt-auto mb-8 text-center px-6">
                        <button
                            onClick={onComplete}
                            className="w-full px-6 py-3 bg-cyber-cyan text-black font-bold rounded-full hover:bg-cyber-cyan/80 transition-colors shadow-lg shadow-cyber-cyan/20 animate-bounce-subtle"
                        >
                            Proceed to Analysis
                        </button>
                        <p className="text-xs text-slate-400 mt-2">Finished gathering evidence?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QREnvironment;

