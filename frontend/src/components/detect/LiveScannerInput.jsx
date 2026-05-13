import React, { useState, useEffect, useRef } from 'react';
import { phishingAPI } from '../../services/api';
import LiveRiskMeter from '../ui/LiveRiskMeter';

const LiveScannerInput = () => {
    const [content, setContent] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [analysis, setAnalysis] = useState({
        score: 0,
        verdict: 'SAFE',
        confidence: 'HIGH',
        indicators: []
    });

    const debounceTimer = useRef(null);

    // Effect to trigger scan after typing stops
    useEffect(() => {
        if (!content.trim()) {
            setAnalysis({ score: 0, verdict: 'SAFE', confidence: 'HIGH', indicators: [] });
            setIsScanning(false);
            return;
        }

        setIsScanning(true);
        
        // Debounce for 800ms to avoid spamming the API
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await phishingAPI.liveDetect(content);
                if (response.success) {
                    setAnalysis(response.data);
                }
            } catch (error) {
                console.error("Live scan failed:", error);
            } finally {
                setIsScanning(false);
            }
        }, 800);

        return () => clearTimeout(debounceTimer.current);
    }, [content]);

    return (
        <div className="flex flex-col gap-6">
            <LiveRiskMeter score={analysis.score} isScanning={isScanning} />

            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type or paste an email, message, or URL here to see real-time detection..."
                    className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all shadow-inner"
                />
            </div>

            {/* Inline Warnings */}
            {analysis.indicators && analysis.indicators.length > 0 && (
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Detected Indicators</h4>
                    <div className="space-y-3">
                        {analysis.indicators.map((ind, idx) => (
                            <div key={idx} className="flex flex-col gap-1 border-l-2 border-yellow-500 pl-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded uppercase font-mono">
                                        {ind.type}
                                    </span>
                                    <span className="text-sm font-medium text-red-400">"{ind.match}"</span>
                                </div>
                                <span className="text-xs text-slate-400">{ind.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveScannerInput;

