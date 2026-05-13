import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, Zap, RotateCcw, ArrowRight, Award, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function QuizResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { quiz, questions, answers, score, autoSubmit, xpEarned: xpFromState, submissionId } = location.state || {};

    // Redirect if accessed without state
    useEffect(() => {
        if (!quiz) navigate('/quizzes');
    }, [quiz, navigate]);

    if (!quiz) return null;

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;
    const xpEarned = xpFromState ?? (passed ? quiz.xp : Math.round(quiz.xp * 0.25));

    // Achievement unlocked logic
    const achievements = [];
    if (percentage === 100) achievements.push({ icon: '🏆', name: 'Perfect Score', desc: '100% accuracy on this quiz' });
    if (percentage >= 90) achievements.push({ icon: '⚡', name: 'Swift Thinker', desc: 'Scored 90%+ on first attempt' });
    if (passed) achievements.push({ icon: '🛡️', name: 'Cyber Guardian', desc: 'Passed a cybersecurity assessment' });

    const scoreColor = percentage >= 90 ? 'text-green-400' : percentage >= 70 ? 'text-yellow-400' : 'text-red-400';
    const scoreBg = percentage >= 90 ? 'from-green-500/10' : percentage >= 70 ? 'from-yellow-400/10' : 'from-red-500/10';

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">

            {/* Auto-submit warning */}
            {autoSubmit && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3">
                    <XCircle size={18} /> Quiz was automatically submitted when the timer expired.
                </div>
            )}

            {/* Score Hero Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className={`p-10 text-center bg-gradient-to-br ${scoreBg} to-transparent border-white/10`}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                        style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent ' + (100 - percentage) + '%, currentColor ' + (100 - percentage) + '%)' }}
                    >
                        <div className="w-24 h-24 rounded-full bg-[#0a0c14] flex items-center justify-center">
                            <Trophy className={scoreColor} size={44} />
                        </div>
                    </motion.div>

                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{quiz.title}</div>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className={`text-8xl font-black italic mb-2 ${scoreColor}`}
                    >
                        {percentage}<span className="text-4xl opacity-40">%</span>
                    </motion.div>

                    <div className="text-2xl font-bold text-white mb-2">
                        {score} <span className="text-white/40">/ {total}</span> Correct
                    </div>

                    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mt-2 ${passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        {passed ? 'PASSED' : 'NOT PASSED'}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-6 mt-10 text-center">
                        <div>
                            <div className={`text-3xl font-black italic ${scoreColor}`}>{score}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Correct</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black italic text-yellow-400">+{xpEarned}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">XP Earned</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black italic text-cyber-purple">{total - score}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Incorrect</div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Achievements Unlocked */}
            {achievements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="p-6">
                        <h3 className="text-lg font-black italic mb-4 flex items-center gap-3">
                            <Star size={18} className="text-yellow-400" /> Achievements Unlocked
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {achievements.map(a => (
                                <div key={a.name} className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/20">
                                    <span className="text-2xl">{a.icon}</span>
                                    <div>
                                        <div className="text-sm font-black text-yellow-400">{a.name}</div>
                                        <div className="text-[10px] text-white/40">{a.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Detailed Answer Review */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="p-8">
                    <h3 className="text-xl font-black italic mb-6 flex items-center gap-3">
                        <Award size={20} className="text-cyber-cyan" /> Answer Review
                    </h3>

                    <div className="space-y-4">
                        {questions.map((q, idx) => {
                            const userAnswer = answers[idx];
                            const isCorrect = userAnswer === q.correct;
                            const [expanded, setExpanded] = React.useState(false);

                            return (
                                <div
                                    key={q.id}
                                    className={`rounded-2xl border overflow-hidden transition-all ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                                        }`}
                                >
                                    <button
                                        className="w-full p-5 flex items-start gap-4 text-left"
                                        onClick={() => setExpanded(e => !e)}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Q{idx + 1}</div>
                                            <div className="text-sm font-bold text-white leading-snug">{q.question}</div>
                                        </div>
                                        {expanded ? <ChevronUp size={16} className="text-white/30 shrink-0 mt-1" /> : <ChevronDown size={16} className="text-white/30 shrink-0 mt-1" />}
                                    </button>

                                    {expanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="px-6 pb-5 space-y-3"
                                        >
                                            <div className="space-y-2">
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${oi === q.correct
                                                        ? 'bg-green-500/15 border border-green-500/30 text-green-400 font-bold'
                                                        : oi === userAnswer && !isCorrect
                                                            ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                                            : 'text-white/40'
                                                        }`}>
                                                        <span className="text-[10px] font-black w-5 shrink-0">{['A', 'B', 'C', 'D'][oi]}</span>
                                                        {opt}
                                                        {oi === q.correct && <CheckCircle size={12} className="ml-auto shrink-0" />}
                                                        {oi === userAnswer && !isCorrect && <XCircle size={12} className="ml-auto shrink-0" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan mb-2">💡 Explanation</div>
                                                <p className="text-sm text-white/60 leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    className="flex-1 h-14 gap-3 text-sm font-black uppercase tracking-widest"
                    onClick={() => navigate(`/quizzes/${quiz._id}`)}
                >
                    <RotateCcw size={16} /> Retry Quiz
                </Button>
                <Link to="/quizzes" className="flex-1">
                    <Button
                        variant="primary"
                        className="w-full h-14 gap-3 text-sm font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-300 text-black"
                    >
                        All Quizzes <ArrowRight size={16} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

