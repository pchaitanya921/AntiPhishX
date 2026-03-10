import React, { useState } from 'react';
import { Sparkles, Mail, Smartphone, Mic, Copy, CheckCircle, ChevronDown, Loader, AlertTriangle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TYPE_OPTIONS = [
    { id: 'email', label: 'Email', icon: Mail, desc: 'Spear Phishing Email with headers' },
    { id: 'sms', label: 'SMS / Smishing', icon: Smartphone, desc: 'Fake SMS with malicious link' },
    { id: 'voice', label: 'Vishing Script', icon: Mic, desc: 'Voice phishing call transcript' },
];

const DIFFICULTY = ['beginner', 'intermediate', 'advanced', 'expert'];

const TARGET_PRESETS = [
    'Finance department employee',
    'HR manager',
    'IT helpdesk staff',
    'CEO / Executive',
    'Healthcare worker',
    'Bank customer',
    'University student',
];

const DEMO_RESULT = {
    generatedAt: new Date().toISOString(),
    generatedBy: 'Admin User',
    scenario: {
        type: 'email',
        scenario: 'TechCorp\'s finance manager receives an urgent email appearing to come from the company\'s trusted vendor "CloudPay Solutions". The email claims that due to a system migration, a payment of $47,500 must be re-authorised through a new payment portal within 2 hours or payroll for 340 employees will be delayed. Time pressure and authority are used as primary social engineering levers.',
        artifact: {
            from: 'payments@cloudpay-solutions.net',
            replyTo: 'billing-secure@cloudpay-update.tk',
            subject: '⚠️ URGENT: Re-authorise Payroll Transfer — Deadline: 2 Hours',
            date: 'Mon, 9 Mar 2026 14:32:07 +0000',
            body: `Dear Finance Manager,

We are writing on behalf of CloudPay Solutions regarding your scheduled payroll disbursement of $47,500 USD (Ref: CP-2026-03-TechCorp).

Due to an emergency system migration completed this weekend, all pending transfers require re-authorisation through our new secure payment portal before 4:30 PM (GMT) today.

⚠️ Failure to re-authorise within the deadline will result in a 48-72 hour processing delay, affecting payroll for 340 employees this pay cycle.

Please click the link below to verify and re-authorise the transaction:

👉 https://cloudpay-secure-auth.tk/verify?ref=TechCorp&amount=47500

This link expires in 2 hours. If you are unable to complete this, please contact your account manager at cloudpay-solutions.net/support.

Best regards,
James Whitfield
Senior Payments Coordinator
CloudPay Solutions Ltd.
+44 20 7946 0231`
        },
        headers: {
            SPF: 'fail',
            DKIM: 'fail',
            DMARC: 'fail',
            'Return-Path': 'noreply@cloudpay-update.tk'
        },
        red_flags: [
            'Reply-To address uses a different domain (.tk) than the From address',
            'SPF, DKIM, and DMARC all fail — email authentication completely broken',
            'Urgent 2-hour deadline is a classic social engineering pressure tactic',
            'Payment link leads to cloudpay-secure-auth.tk — suspicious lookalike domain',
            'Large dollar amount ($47,500) combined with emotional leverage (employee payroll)',
            'Return-Path mismatch — email does not originate from cloudpay-solutions.net'
        ],
        answer_key: 'This is a Business Email Compromise (BEC) phishing attack. All three email authentication checks (SPF, DKIM, DMARC) fail, indicating the email does not originate from the claimed domain. The Reply-To and Return-Path use a suspicious .tk domain. The urgency tactic (2-hour deadline affecting 340 employees) is engineered to bypass rational decision-making. Never re-authorise wire transfers via email links; always verify large transactions through a known phone number to the vendor.',
        difficulty: 'advanced',
        target_role: 'Finance department employee'
    }
};

export default function ScenarioGenerator() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const [type, setType] = useState('email');
    const [context, setContext] = useState('Spear phishing targeting a finance manager to approve a fake wire transfer of $47,500 to a vendor account, using payroll deadline pressure');
    const [difficulty, setDifficulty] = useState('advanced');
    const [target, setTarget] = useState(TARGET_PRESETS[0]);
    const [result, setResult] = useState(DEMO_RESULT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!context.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/scenario/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type, context, difficulty, target }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Generation failed');
            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const scenario = result?.scenario;

    return (
        <div className={`min-h-screen pt-28 pb-16 px-8 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-6">
                        <Sparkles size={16} className="text-cyber-cyan" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyber-cyan">Generative AI Engine</span>
                    </div>
                    <h1 className="text-4xl font-black mb-3">
                        Phishing Scenario <span className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">Generator</span>
                    </h1>
                    <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        Generate realistic phishing scenarios for lab creation and security awareness training
                    </p>
                    <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-bold ${isLight ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        <AlertTriangle size={11} />
                        For authorized educational use only — Admin / Instructor access
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Controls Panel */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Type */}
                        <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Attack Type</p>
                            <div className="space-y-2">
                                {TYPE_OPTIONS.map(t => (
                                    <button key={t.id} onClick={() => setType(t.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${type === t.id
                                            ? 'bg-cyber-purple/10 border-cyber-purple/40 text-cyber-purple'
                                            : isLight
                                                ? 'border-slate-100 text-slate-500 hover:border-slate-200'
                                                : 'border-white/5 text-white/40 hover:border-white/10'
                                            }`}>
                                        <t.icon size={16} />
                                        <div>
                                            <p className="text-xs font-black">{t.label}</p>
                                            <p className="text-[10px] opacity-60">{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Difficulty</p>
                            <div className="grid grid-cols-2 gap-2">
                                {DIFFICULTY.map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)}
                                        className={`py-2 rounded-xl text-xs font-black uppercase border transition-all ${difficulty === d
                                            ? 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan'
                                            : isLight ? 'border-slate-100 text-slate-400' : 'border-white/5 text-white/30'
                                            }`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Target */}
                        <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Target Role</p>
                            <select value={target} onChange={e => setTarget(e.target.value)}
                                className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white'
                                    }`}>
                                {TARGET_PRESETS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Input + Output */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Context Prompt */}
                        <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Context Prompt</p>
                            <textarea
                                value={context}
                                onChange={e => setContext(e.target.value)}
                                rows={4}
                                placeholder="e.g. Spear phishing targeting a finance manager to approve a fake wire transfer of $50,000 to a vendor account..."
                                className={`w-full rounded-xl px-4 py-3 text-sm resize-none outline-none border transition-all ${isLight
                                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-300 focus:border-cyber-purple/50'
                                    : 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-cyber-purple/50'
                                    }`}
                            />
                            {error && <p className="mt-2 text-red-400 text-xs font-bold">{error}</p>}
                            <button
                                onClick={handleGenerate}
                                disabled={!context.trim() || loading}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-black text-sm rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? <Loader size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                {loading ? 'Generating Scenario...' : 'Generate Phishing Scenario'}
                            </button>
                        </div>

                        {/* Result */}
                        <AnimatePresence>
                            {scenario && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    {/* Scenario */}
                                    {scenario.scenario && (
                                        <div className={`rounded-2xl border p-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                                            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Scenario Background</p>
                                            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{scenario.scenario}</p>
                                        </div>
                                    )}

                                    {/* Artifact */}
                                    {scenario.artifact && (
                                        <div className={`rounded-2xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                                            <div className="flex items-center justify-between p-5 border-b border-white/5">
                                                <p className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                                                    Generated {type === 'email' ? 'Phishing Email' : type === 'sms' ? 'Smishing SMS' : 'Vishing Script'}
                                                </p>
                                                <button onClick={() => handleCopy(JSON.stringify(scenario.artifact, null, 2))}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-cyber-cyan hover:opacity-80">
                                                    {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                                                    {copied ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                {type === 'email' && (
                                                    <div className="space-y-2 font-mono text-sm">
                                                        {['from', 'replyTo', 'subject', 'date'].map(k => scenario.artifact[k] && (
                                                            <div key={k} className="flex gap-2">
                                                                <span className="text-cyber-cyan w-16 flex-shrink-0 capitalize">{k}:</span>
                                                                <span className={isLight ? 'text-slate-700' : 'text-white/80'}>{scenario.artifact[k]}</span>
                                                            </div>
                                                        ))}
                                                        {scenario.artifact.body && (
                                                            <div className={`mt-3 p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${isLight ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-white/5 border-white/5 text-white/70'}`}>
                                                                {scenario.artifact.body}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {(type === 'sms' || type === 'voice') && (
                                                    <pre className={`text-sm leading-relaxed whitespace-pre-wrap ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                                                        {type === 'sms' ? scenario.artifact.body : scenario.artifact.script}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Red Flags + Answer Key */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {scenario.red_flags && scenario.red_flags.length > 0 && (
                                            <div className={`rounded-2xl border p-5 ${isLight ? 'bg-red-50/60 border-red-100' : 'bg-red-500/5 border-red-500/20'}`}>
                                                <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Red Flags</p>
                                                <ul className="space-y-1.5">
                                                    {scenario.red_flags.map((f, i) => (
                                                        <li key={i} className={`text-xs flex items-start gap-2 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                                                            <span className="text-red-400 mt-0.5">•</span> {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {scenario.answer_key && (
                                            <div className={`rounded-2xl border p-5 ${isLight ? 'bg-emerald-50/60 border-emerald-100' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                                <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">Answer Key</p>
                                                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{scenario.answer_key}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
