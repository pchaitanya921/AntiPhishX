import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button, Card } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Zap, CheckCircle, Flag, ChevronLeft, ChevronRight, AlertTriangle, Loader } from 'lucide-react';
import api from '../services/api';

export default function QuizPlayerPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [flagged, setFlagged] = useState(new Set());
    const startTimeRef = useRef(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await api.get('/quizzes/' + quizId);
                const data = response.data.data;
                setQuiz(data);
                setTimeLeft(data.timeLimitSeconds || 600);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const handleStart = () => {
        startTimeRef.current = Date.now();
        setQuizStarted(true);
    };

    const questions = quiz?.questions || [];
    
    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (submitted || submitting || !quiz || questions.length === 0) return;
        setSubmitting(true);
        setSubmitted(true);

        const score = questions.reduce((acc, q, idx) =>
            acc + (answers[idx] === q.correct ? 1 : 0), 0);
        const finalAnswers = { ...answers };
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;
        const xpEarned = passed ? quiz.xp : Math.floor(quiz.xp * 0.25);
        const timeTakenSeconds = startTimeRef.current
            ? Math.round((Date.now() - startTimeRef.current) / 1000)
            : 0;

        let submissionId = null;
        try {
            const response = await api.post('/quizzes/submit', {
                quizId: quiz._id || quiz.id,
                quizTitle: quiz.title,
                category: quiz.category,
                difficulty: quiz.difficulty,
                answers: finalAnswers,
                score,
                total: questions.length,
                xpEarned,
                timeTakenSeconds,
                autoSubmitted: autoSubmit
            });
            submissionId = response.data.data?._id;
        } catch (err) {
            console.warn('[Quiz] Backend submission failed:', err.response?.data?.message || err.message);
        }

        setSubmitting(false);
        navigate('/quiz-result', {
            state: { quiz, questions, answers: finalAnswers, score, autoSubmit, xpEarned, submissionId }
        });
    }, [answers, quiz, questions, navigate, submitted, submitting]);

    // Timer countdown
    useEffect(() => {
        if (!quizStarted || submitted) return;
        if (timeLeft <= 0) { handleSubmit(true); return; }
        const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
        return () => clearInterval(t);
    }, [quizStarted, timeLeft, submitted, handleSubmit]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
    };

    const handleSelect = (optionIdx) => {
        setAnswers(prev => ({ ...prev, [currentQ]: optionIdx }));
    };

    const toggleFlag = () => {
        setFlagged(prev => {
            const next = new Set(prev);
            if (next.has(currentQ)) next.delete(currentQ);
            else next.add(currentQ);
            return next;
        });
    };

    const pct = questions.length > 0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white mb-4 italic uppercase tracking-tighter">Quiz Not Found or Empty</h2>
                <Button onClick={() => navigate('/quizzes')} className="bg-yellow-400 text-black hover:bg-yellow-300">Return to Catalog</Button>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
                    <Card className="p-10 text-center space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto">
                            <BookOpen className="text-yellow-400 w-10 h-10" />
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2">{quiz.category}</div>
                            <h1 className="text-3xl font-black italic text-white leading-tight">{quiz.title}</h1>
                            <p className="text-white/60 mt-3">{quiz.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            {[
                                { icon: BookOpen, label: 'Questions', value: questions.length },
                                { icon: Clock, label: 'Time Limit', value: formatTime(timeLeft) },
                                { icon: Zap, label: 'XP Reward', value: quiz.xp + ' XP' },
                                { icon: CheckCircle, label: 'Pass Mark', value: '70%' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <stat.icon className="text-cyber-cyan shrink-0" size={18} />
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                                        <div className="font-bold text-white">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="primary" className="w-full h-14 text-sm font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-300 text-black" onClick={handleStart}>
                            Begin Quiz ?
                        </Button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const q = questions[currentQ];
    const answered = Object.keys(answers).length;
    const isLowTime = timeLeft < 60;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 h-[calc(100vh-80px)] flex flex-col">
            {/* Header / Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-1">{quiz.title}</div>
                    <div className="text-2xl font-black italic text-white flex items-center gap-3">
                        Question {currentQ + 1}
                        {flagged.has(currentQ) && <Flag size={18} className="text-red-500" fill="currentColor" />}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <CheckCircle size={16} className={answered === questions.length ? 'text-green-400' : 'text-white/40'} />
                        <span className="font-bold text-sm text-white">{answered} / {questions.length}</span>
                    </div>
                    <div className={"flex items-center gap-2 px-4 py-2 rounded-xl border " + (isLowTime ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-white')}>
                        <Clock size={16} />
                        <span className="font-bold text-sm tracking-widest">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-8 shrink-0">
                <div className={"h-1.5 w-full rounded-full overflow-hidden " + (isDark ? 'bg-white/5' : 'bg-gray-200')}>
                    <motion.div animate={{ width: pct + '%' }} className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" />
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pb-4">
                <AnimatePresence mode="wait">
                    <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
                            {q.question}
                        </h2>
                        <div className="space-y-3">
                            {q.options.map((option, idx) => {
                                const isSelected = answers[currentQ] === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        className={"w-full flex items-center p-4 rounded-xl border text-left transition-all duration-200 group " + (isSelected ? 'bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.15)]' : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20')}
                                    >
                                        <div className={"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-4 font-black transition-colors " + (isSelected ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white')}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={"font-medium text-sm sm:text-base leading-snug flex-1 " + (isSelected ? 'text-white' : 'text-white/80')}>
                                            {option}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 shrink-0 mt-auto">
                <Button variant="outline" className="gap-2 h-12 px-6 hidden sm:flex" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
                    <ChevronLeft size={16} /> Previous
                </Button>
                <div className="flex gap-2 mx-auto sm:mx-0 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar pb-2 sm:pb-0">
                    {questions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQ(idx)}
                            className={"w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-colors " + (idx === currentQ ? 'bg-white text-black' : answers[idx] !== undefined ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : flagged.has(idx) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent')}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className={"h-12 w-12 sm:w-auto px-0 sm:px-6 gap-2 " + (flagged.has(currentQ) ? 'bg-red-500/20 border-red-500/50 text-red-400' : '')} onClick={toggleFlag}>
                        <Flag size={16} fill={flagged.has(currentQ) ? 'currentColor' : 'none'} />
                        <span className="hidden sm:inline">{flagged.has(currentQ) ? 'Flagged' : 'Flag'}</span>
                    </Button>
                    
                    {currentQ === questions.length - 1 ? (
                        <Button variant="primary" className="h-12 px-6 gap-2 bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]" onClick={() => handleSubmit(false)} loading={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    ) : (
                        <Button variant="outline" className="gap-2 h-12 px-6 bg-white/5 hover:bg-white/10 border-white/10 text-white" onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}>
                            Next <ChevronRight size={16} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

