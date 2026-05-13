import React from 'react';
import { Database, ExternalLink, BookOpen, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const DATASETS = [
    {
        name: 'PhishTank',
        icon: '🎣',
        description: 'Community-curated database of verified phishing URLs, maintained by OpenDNS.',
        url: 'https://phishtank.org',
        size: '100,000+ verified phishing URLs',
        features: ['URL', 'Target brand', 'Verified status', 'Online/Offline'],
        usedFor: 'Real-time threat lookup and URL-based detection training in this platform.',
        citation: 'PhishTank. (2024). PhishTank Developer Information. OpenDNS.',
        color: 'from-red-500/20 to-orange-500/10',
        border: 'border-red-500/20',
        badge: 'Real-time Feed',
        badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    },
    {
        name: 'Kaggle Phishing Websites Dataset',
        icon: '📊',
        description: '11,055 URLs with 30 extracted features, one of the most cited phishing ML datasets.',
        url: 'https://www.kaggle.com/datasets/eswarchandt/phishing-website-detector',
        size: '11,055 URLs · 30 features',
        features: ['IP address', 'URL length', 'Shortening service', 'SSL state', 'Domain registration length', 'Web traffic'],
        usedFor: 'Feature-based classification using ML models (RF 92-96%, XGBoost 95-97%). Reference benchmark for this project.',
        citation: 'Chandra, T. (2021). Phishing Website Detector Dataset. Kaggle repository.',
        color: 'from-blue-500/20 to-cyan-500/10',
        border: 'border-blue-500/20',
        badge: '11K+ Samples',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
        name: 'Enron Email Corpus',
        icon: '📧',
        description: 'Largest publicly available real-world email dataset, used in spam and social engineering research.',
        url: 'https://www.cs.cmu.edu/~./enron/',
        size: '500,000+ emails · 150 users',
        features: ['From/To headers', 'Subject', 'Body text', 'Timestamps', 'Attachments'],
        usedFor: 'Email-based social engineering detection, BERT fine-tuning, and language model benchmarks.',
        citation: 'Klimt, B., & Yang, Y. (2004). The Enron Corpus: A New Dataset for Email Classification Research. ECML.',
        color: 'from-purple-500/20 to-pink-500/10',
        border: 'border-purple-500/20',
        badge: '500K+ Emails',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
        name: 'OpenPhish Feed',
        icon: '🌐',
        description: 'Autonomous phishing detection system providing a live feed of verified active phishing URLs.',
        url: 'https://openphish.com',
        size: 'Live feed · 1,000–2,000 new URLs/day',
        features: ['Phishing URL', 'Target brand', 'Discovery date'],
        usedFor: 'Supplementary real-time threat intelligence integration in this platform.',
        citation: 'OpenPhish. (2024). OpenPhish - Phishing Intelligence. OpenPhish Team.',
        color: 'from-emerald-500/20 to-teal-500/10',
        border: 'border-emerald-500/20',
        badge: 'Live Feed',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
];

const ML_MODELS = [
    { model: 'Random Forest', accuracy: '92–96%', notes: 'High interpretability, fast inference' },
    { model: 'SVM', accuracy: '90–94%', notes: 'Effective with small datasets' },
    { model: 'XGBoost', accuracy: '95–97%', notes: 'Best overall on tabular URL features' },
    { model: 'BERT', accuracy: '96–98%', notes: 'State-of-art on email body analysis' },
    { model: 'Groq LLaMA-3.3', accuracy: '~95%+', notes: 'Used in this platform — zero-shot analysis' },
];

export default function DatasetReferencePage() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className={`min-h-screen pt-28 pb-16 px-8 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyber-purple/30 bg-cyber-purple/10 mb-6">
                        <Database size={16} className="text-cyber-purple" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyber-purple">Research Datasets</span>
                    </div>
                    <h1 className="text-4xl font-black mb-3">
                        Dataset <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">References</span>
                    </h1>
                    <p className={`text-sm max-w-xl ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                        Publicly available datasets referenced and utilized in the AntiPhishX phishing detection research. All datasets are cited per IEEE academic standards.
                    </p>
                </motion.div>

                {/* Dataset Cards */}
                <div className="grid gap-5 mb-12">
                    {DATASETS.map((ds, i) => (
                        <motion.div
                            key={ds.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-2xl border bg-gradient-to-br ${ds.color} ${ds.border} p-6`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{ds.icon}</span>
                                    <div>
                                        <h3 className="font-black text-lg">{ds.name}</h3>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${ds.badgeColor}`}>
                                            {ds.badge}
                                        </span>
                                    </div>
                                </div>
                                <a href={ds.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-bold text-cyber-cyan hover:opacity-80 transition-opacity">
                                    Visit <ExternalLink size={12} />
                                </a>
                            </div>

                            <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{ds.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Size</p>
                                    <p className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{ds.size}</p>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Key Features</p>
                                    <div className="flex flex-wrap gap-1">
                                        {ds.features.slice(0, 4).map(f => (
                                            <span key={f} className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-white/60'}`}>{f}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Usage in Project</p>
                                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-white/60'}`}>{ds.usedFor}</p>
                                </div>
                            </div>

                            <div className={`mt-4 p-3 rounded-xl border text-xs font-mono ${isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-black/20 border-white/5 text-white/40'}`}>
                                📖 {ds.citation}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Model Comparison Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-cyber-purple" />
                        ML Model Accuracy Comparison
                    </h2>
                    <div className={`rounded-2xl border overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                        <table className="w-full text-sm">
                            <thead className={`${isLight ? 'bg-slate-50' : 'bg-white/5'}`}>
                                <tr>
                                    {['Model', 'Typical Accuracy', 'Notes'].map(h => (
                                        <th key={h} className={`px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ML_MODELS.map((m, i) => (
                                    <tr key={m.model} className={`border-t ${isLight ? 'border-slate-100' : 'border-white/5'} ${m.model.includes('Groq') ? (isLight ? 'bg-cyber-purple/5' : 'bg-cyber-purple/5') : ''}`}>
                                        <td className={`px-5 py-3.5 font-black ${m.model.includes('Groq') ? 'text-cyber-purple' : isLight ? 'text-slate-700' : 'text-white/80'}`}>
                                            {m.model} {m.model.includes('Groq') && '⭐'}
                                        </td>
                                        <td className={`px-5 py-3.5 font-bold ${m.model.includes('Groq') ? 'text-cyber-cyan' : isLight ? 'text-slate-600' : 'text-white/70'}`}>{m.accuracy}</td>
                                        <td className={`px-5 py-3.5 text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>{m.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className={`mt-3 text-xs ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                        Reference: Sahingoz et al., "Machine learning based phishing detection from URLs," Applied Soft Computing, 2019.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

