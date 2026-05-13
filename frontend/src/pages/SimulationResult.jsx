import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Eye, CheckCircle2, Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function SimulationResult() {
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaign');

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111] border border-red-500/30 p-8 md:p-12 rounded-3xl max-w-3xl w-full text-center relative overflow-hidden"
            >
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10  pointer-events-none" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <ShieldAlert size={40} className="text-red-500" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black italic mb-4 text-white">
                        Oops! That was a test.
                    </h1>
                    <p className="text-xl text-red-400 mb-8 font-bold">
                        You just clicked on a simulated phishing link.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left mb-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-yellow-500" />
                                Don't worry, you are safe!
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                This email was sent by your IT Security team to test your awareness of phishing attacks. No actual compromise occurred, but in the real world, clicking that link could have given attackers access to our corporate network.
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Eye size={18} className="text-cyan-400" />
                                What red flags did you miss?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-red-500/20 p-1 rounded">
                                        <AlertTriangle size={14} className="text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Urgency and Fear</p>
                                        <p className="text-xs text-white/50">The email created a false sense of urgency (e.g., "Account closing immediately") to make you act quickly without thinking.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-red-500/20 p-1 rounded">
                                        <AlertTriangle size={14} className="text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Suspicious Sender Address</p>
                                        <p className="text-xs text-white/50">The sender's email address was slightly misspelled or came from an external domain, not our official corporate domain.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-red-500/20 p-1 rounded">
                                        <AlertTriangle size={14} className="text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Hidden URLs</p>
                                        <p className="text-xs text-white/50">Hovering over the link before clicking would have revealed it was going to an unknown website.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} />
                            Return to Dashboard
                        </Link>
                        <Link 
                            to="/courses"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            <Lock size={16} />
                            Review Security Training
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

