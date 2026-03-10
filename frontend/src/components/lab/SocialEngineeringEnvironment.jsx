import React, { useState } from 'react';
import {
    Shield, User, MapPin, FileText, Lock, Eye, AlertTriangle,
    Briefcase, HelpCircle, ChevronDown, ChevronRight,
    Network, Phone, Mail, Wifi, Database, Key, Camera
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getIconForKey = (key) => {
    const k = key.toLowerCase();
    if (k.includes('person') || k.includes('sender') || k.includes('user') || k.includes('employee') || k.includes('caller')) return <User className="text-blue-400" size={18} />;
    if (k.includes('location') || k.includes('environment') || k.includes('setting')) return <MapPin className="text-green-400" size={18} />;
    if (k.includes('doc') || k.includes('file') || k.includes('message') || k.includes('request') || k.includes('email') || k.includes('invoice')) return <FileText className="text-yellow-400" size={18} />;
    if (k.includes('network') || k.includes('alert') || k.includes('edr')) return <Network className="text-cyan-400" size={18} />;
    if (k.includes('call') || k.includes('vishing') || k.includes('phone')) return <Phone className="text-pink-400" size={18} />;
    if (k.includes('wifi') || k.includes('rogue') || k.includes('mdm')) return <Wifi className="text-orange-400" size={18} />;
    if (k.includes('db') || k.includes('database') || k.includes('crm')) return <Database className="text-violet-400" size={18} />;
    if (k.includes('key') || k.includes('cred') || k.includes('password') || k.includes('sim')) return <Key className="text-red-400" size={18} />;
    if (k.includes('cctv') || k.includes('camera') || k.includes('video')) return <Camera className="text-slate-300" size={18} />;
    if (k.includes('security') || k.includes('lock')) return <Lock className="text-red-400" size={18} />;
    if (k.includes('observation') || k.includes('visual')) return <Eye className="text-purple-400" size={18} />;
    if (k.includes('risk') || k.includes('alert') || k.includes('threat')) return <AlertTriangle className="text-orange-400" size={18} />;
    if (k.includes('mail') || k.includes('phishing')) return <Mail className="text-amber-400" size={18} />;
    return <Briefcase className="text-slate-400" size={18} />;
};

const formatKey = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ─── Recursive value renderer ─────────────────────────────────────────────

const ValueRenderer = ({ value, depth = 0 }) => {
    const [expanded, setExpanded] = useState(depth < 2);

    if (value === null || value === undefined) return <span className="text-slate-500 italic">—</span>;

    if (typeof value === 'boolean') {
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {value ? 'YES' : 'NO'}
            </span>
        );
    }

    if (typeof value === 'number') {
        return <span className="text-cyan-300 font-mono">{value}</span>;
    }

    if (typeof value === 'string') {
        // Pretty print long strings
        if (value.length < 120) {
            return <span className="text-slate-100 leading-relaxed">{value}</span>;
        }
        return <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{value}</p>;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-slate-500 italic">[ empty ]</span>;

        // Simple string arrays → tag chips
        if (value.every(v => typeof v === 'string')) {
            return (
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {value.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200 leading-relaxed">
                            {item}
                        </span>
                    ))}
                </div>
            );
        }

        // Object arrays → collapsible list
        return (
            <div className="mt-1 space-y-2">
                {value.map((item, i) => (
                    <div key={i} className="border border-white/10 rounded-lg bg-white/3 overflow-hidden">
                        {typeof item === 'object' && item !== null ? (
                            <ObjectCard data={item} depth={depth + 1} />
                        ) : (
                            <div className="px-3 py-2 text-sm text-slate-200">
                                <ValueRenderer value={item} depth={depth + 1} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value).filter(([k]) => k !== 'artifacts');
        if (entries.length === 0) return null;

        return (
            <div className="mt-1">
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-1"
                >
                    {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {expanded ? 'Collapse' : `Expand (${entries.length} fields)`}
                </button>
                {expanded && <ObjectCard data={value} depth={depth + 1} />}
            </div>
        );
    }

    return <span className="text-slate-300">{String(value)}</span>;
};

const ObjectCard = ({ data, depth = 0 }) => {
    const entries = Object.entries(data).filter(([k]) => !['artifacts', '__v'].includes(k));
    return (
        <div className={`space-y-2 ${depth > 0 ? 'pl-3 border-l border-white/10' : ''}`}>
            {entries.map(([key, val]) => (
                <div key={key} className="text-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{formatKey(key)}</span>
                    <div className="mt-0.5 ml-1">
                        <ValueRenderer value={val} depth={depth} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Main component ─────────────────────────────────────────────────────────

const SocialEngineeringEnvironment = ({ content, onComplete }) => {
    // Fields to skip in the top-level grid (internal or rendered elsewhere)
    const SKIP_KEYS = new Set(['quiz', 'analysis_hint', 'artifacts', '__v', 'socAnalysis', 'impact']);

    const displayEntries = Object.entries(content || {}).filter(([k]) => !SKIP_KEYS.has(k));

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto p-6 text-white space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-4 bg-purple-500/20 rounded-full mb-4 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Shield size={32} className="text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Social Engineering Scenario</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                    Analyze the artifacts, indicators, and evidence below. Identify the attack type, threat actor TTPs,
                    and select the correct verdict using the Lab Manual on the left.
                </p>
            </div>

            {/* Artifact Grid */}
            <div className="grid gap-5 md:grid-cols-2">
                {displayEntries.map(([key, value], idx) => (
                    <div
                        key={idx}
                        className="bg-slate-800/50 border border-white/10 rounded-xl p-5 hover:bg-slate-800/80 transition-colors group relative overflow-hidden"
                    >
                        {/* Section label */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/8">
                            <div className="p-1.5 bg-slate-950 rounded-lg border border-white/5">
                                {getIconForKey(key)}
                            </div>
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                {formatKey(key)}
                            </h3>
                        </div>

                        {/* Value */}
                        <div className="text-sm">
                            <ValueRenderer value={value} depth={0} />
                        </div>
                    </div>
                ))}

                {displayEntries.length === 0 && (
                    <div className="col-span-full text-center p-8 text-slate-500 text-sm">
                        No specific artifacts provided for this scenario. Refer to the scenario description in the Lab Manual.
                    </div>
                )}
            </div>

            {/* SOC Analysis Tasks (if present) */}
            {content?.socAnalysis?.tasks?.length > 0 && (
                <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-sm uppercase tracking-widest">
                        <AlertTriangle size={16} />
                        SOC Analysis Tasks
                    </div>
                    <ol className="space-y-2">
                        {content.socAnalysis.tasks.map((task, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-200">
                                <span className="text-amber-500 font-mono font-bold shrink-0">{i + 1}.</span>
                                <span className="leading-relaxed">{task}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Impact summary (if present) */}
            {content?.impact && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-xs uppercase tracking-widest">
                        <AlertTriangle size={14} />
                        Impact Assessment
                    </div>
                    <ObjectCard data={content.impact} depth={0} />
                </div>
            )}

            {/* Analyst Guidance */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
                <HelpCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-200/80 leading-relaxed">
                    <strong>Analyst Guidance:</strong> Social Engineering exploits human psychology — trust, authority,
                    urgency, fear, and reciprocity. Look for deviations from standard security policy and
                    inconsistencies in identity, timing, or channel authenticity. Use the Lab Manual to submit your verdict.
                </div>
            </div>
        </div>
    );
};

export default SocialEngineeringEnvironment;
