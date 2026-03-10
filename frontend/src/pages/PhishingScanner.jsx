import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, Loader, Copy, ChevronDown, ChevronUp, Link, Mail, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SEVERITY_COLOR = { LOW: 'text-yellow-400', MEDIUM: 'text-orange-400', HIGH: 'text-red-400' };
const VERDICT_CONFIG = {
    SAFE: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle, label: 'SAFE' },
    SUSPICIOUS: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: AlertTriangle, label: 'SUSPICIOUS' },
    PHISHING: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle, label: 'PHISHING' },
};

const TYPE_OPTIONS = [
    { id: 'url', label: 'URL / Link', icon: Link, placeholder: 'https://paypal-security-update.tk/verify...' },
    { id: 'email', label: 'Email', icon: Mail, placeholder: 'Paste full email content (headers + body)...' },
    { id: 'sms', label: 'SMS', icon: Smartphone, placeholder: 'Paste suspicious SMS text message...' },
];

const DEMO_URL = 'http://paypa1-secure-verify.tk/account/login?ref=urgent';

const DEMO_RESULT = {
    type: 'url',
    content: DEMO_URL,
    analyzedAt: new Date().toISOString(),
    analysis: {
        score: 91,
        verdict: 'PHISHING',
        confidence: 'HIGH',
        explanation: 'This URL exhibits multiple high-confidence phishing indicators including typosquatting of the PayPal domain (paypa1 vs paypal), use of a suspicious .tk TLD commonly associated with phishing, and urgency-inducing query parameters designed to pressure users into entering credentials.',
        indicators: [
            { type: 'typosquatting', description: 'Domain "paypa1-secure-verify.tk" mimics "paypal.com" using character substitution (l→1)', severity: 'HIGH' },
            { type: 'suspicious_link', description: 'Uses .tk (Tokelau) TLD — statistically one of the most phishing-associated top-level domains', severity: 'HIGH' },
            { type: 'urgency_language', description: 'Query parameter "ref=urgent" is a social engineering trigger designed to create pressure', severity: 'MEDIUM' },
            { type: 'lookalike_domain', description: 'Subdomain pattern "secure-verify" mimics legitimate security pages to appear trustworthy', severity: 'HIGH' },
            { type: 'credential_request', description: '/account/login path indicates credential harvesting page', severity: 'HIGH' },
        ],
        recommendations: [
            'Do not click or visit this URL under any circumstances',
            'Report to PhishTank: https://phishtank.org/add_web_phish.php',
            'If you received this via email, mark it as phishing and report to your IT team',
            'Verify account status directly through the official paypal.com website',
        ]
    }
};

export default function PhishingScanner() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const [type, setType] = useState('url');
    const [content, setContent] = useState(DEMO_URL);
    const [result, setResult] = useState(DEMO_RESULT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showIndicators, setShowIndicators] = useState(true);


    const handleScan = async () => {
        if (!content.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/phishing/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type, content }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Analysis failed');
            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentType = TYPE_OPTIONS.find(t => t.id === type);
    const verdict = result ? VERDICT_CONFIG[result.analysis?.verdict] || VERDICT_CONFIG.SUSPICIOUS : null;
    const score = result?.analysis?.score || 0;

    const scoreColor = score >= 70 ? '#ef4444' : score >= 31 ? '#f59e0b' : '#10b981';

    return (
        <div className={`min-h-screen pt-28 pb-16 px-8 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyber-purple/30 bg-cyber-purple/10 mb-6">
                        <Shield size={16} className="text-cyber-purple" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyber-purple">AI Phishing Detection</span>
                    </div>
                    <h1 className="text-4xl font-black mb-3">
                        Phishing <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">Scanner</span>
                    </h1>
                    <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        Analyze URLs, emails, and SMS messages for phishing indicators using Groq AI
                    </p>
                </motion.div>

                {/* Type Selector */}
                <div className="flex gap-3 mb-6 justify-center">
                    {TYPE_OPTIONS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => { setType(t.id); setResult(null); setContent(''); setError(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${type === t.id
                                ? 'bg-cyber-purple text-white border-cyber-purple shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                                : isLight
                                    ? 'border-slate-200 text-slate-500 hover:border-cyber-purple/40'
                                    : 'border-white/10 text-white/40 hover:border-cyber-purple/40'
                                }`}
                        >
                            <t.icon size={15} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Input Card */}
                <motion.div
                    className={`rounded-2xl border p-6 mb-6 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'
                        }`}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                    <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                        Paste {currentType.label} Content
                    </label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder={currentType.placeholder}
                        rows={type === 'url' ? 2 : 6}
                        className={`w-full rounded-xl px-4 py-3 text-sm font-mono resize-none outline-none border transition-all ${isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-300 focus:border-cyber-purple/50'
                            : 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-cyber-purple/50'
                            }`}
                    />
                    {error && (
                        <p className="mt-2 text-red-400 text-xs font-bold">{error}</p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{content.length} characters</span>
                        <button
                            onClick={handleScan}
                            disabled={!content.trim() || loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-black text-sm rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader size={15} className="animate-spin" /> : <Search size={15} />}
                            {loading ? 'Scanning...' : 'Scan Now'}
                        </button>
                    </div>
                </motion.div>

                {/* Results - shown immediately when result is set */}
                {result && verdict && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Verdict Banner */}
                        <div className={`rounded-2xl border p-6 flex items-center gap-6 ${verdict.bg}`}>
                            {/* Score Gauge */}
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                                    <circle
                                        cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                                        strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black" style={{ color: scoreColor }}>{score}</span>
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider">risk</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <verdict.icon size={22} className={verdict.color} />
                                    <span className={`text-2xl font-black ${verdict.color}`}>{verdict.label}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${verdict.bg} ${verdict.color} font-bold`}>
                                        {result.analysis?.confidence} CONFIDENCE
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                                    {result.analysis?.explanation}
                                </p>
                            </div>
                        </div>

                        {/* Indicators */}
                        {result.analysis?.indicators?.length > 0 && (
                            <div className={`rounded-2xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                                <button
                                    onClick={() => setShowIndicators(!showIndicators)}
                                    className="w-full flex items-center justify-between p-5"
                                >
                                    <span className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                                        Threat Indicators ({result.analysis.indicators.length})
                                    </span>
                                    {showIndicators ? <ChevronUp size={16} className="text-cyber-purple" /> : <ChevronDown size={16} className="text-cyber-purple" />}
                                </button>
                                {showIndicators && (
                                    <div className="px-5 pb-5 grid gap-3">
                                        {result.analysis.indicators.map((ind, i) => (
                                            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                                                <span className={`text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 ${SEVERITY_COLOR[ind.severity]}`}>
                                                    {ind.severity}
                                                </span>
                                                <div>
                                                    <p className={`text-xs font-black uppercase tracking-wider mb-0.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{ind.type?.replace(/_/g, ' ')}</p>
                                                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>{ind.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recommendations */}
                        {result.analysis?.recommendations?.length > 0 && (
                            <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Recommendations</p>
                                <ul className="space-y-2">
                                    {result.analysis.recommendations.map((rec, i) => (
                                        <li key={i} className={`flex items-start gap-2 text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                                            <span className="text-cyber-cyan mt-0.5">›</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Research Note */}
                <div className={`mt-10 rounded-2xl border p-5 ${isLight ? 'bg-blue-50/60 border-blue-100' : 'bg-cyber-purple/5 border-cyber-purple/20'}`}>
                    <p className="text-xs font-black uppercase tracking-widest text-cyber-purple mb-1">Research Reference</p>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        Detection powered by Groq LLaMA-3.3-70B. Reference: Sahingoz et al., "Machine learning based phishing detection from URLs," Applied Soft Computing, 2019. Typical research accuracy: RF 92-96%, XGBoost 95-97%, BERT 96-98%.
                    </p>
                </div>
            </div>
        </div>
    );
}
