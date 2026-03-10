import React, { useState, useEffect } from 'react';
import { FileQuestion, Lock, Search, Filter, BookOpen, Clock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function QuizzesPage() {
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            // Full quiz catalog
            const mockQuizzes = [
                { id: 'q1', title: 'Phishing Detection Assessment', description: 'Test your ability to spot sophisticated spear-phishing attempts and lookalike domains.', difficulty: 'Intermediate', questions: 10, time: '15m', xp: 200, unlocked: true, category: 'Phishing' },
                { id: 'q2', title: 'Vishing Countermeasures', description: 'Identify voice-phishing tactics including caller ID spoofing and tech support scams.', difficulty: 'Beginner', questions: 7, time: '10m', xp: 150, unlocked: true, category: 'Vishing' },
                { id: 'q3', title: 'Advanced Payload Analysis', description: 'Decode malicious intent in multi-stage droppers, C2 communication and LotL techniques.', difficulty: 'Expert', questions: 8, time: '30m', xp: 350, unlocked: true, category: 'Technical' },
                { id: 'q4', title: 'Social Engineering Defence', description: 'Master Cialdini\'s influence principles and spot pretexting, baiting, and tailgating attacks.', difficulty: 'Intermediate', questions: 6, time: '15m', xp: 200, unlocked: true, category: 'Social' },
                { id: 'q5', title: 'QR Code & Quishing Attacks', description: 'Recognise malicious QR codes used to bypass email filters and steal credentials.', difficulty: 'Beginner', questions: 8, time: '10m', xp: 150, unlocked: true, category: 'QR Code' },
                { id: 'q6', title: 'Malware Detection Fundamentals', description: 'Classify malware families, identify infection vectors and understand evasion techniques.', difficulty: 'Intermediate', questions: 10, time: '15m', xp: 200, unlocked: true, category: 'Malware' },
                { id: 'q7', title: 'Password & Credential Security', description: 'Evaluate password strength, credential stuffing risks, MFA bypass methods and best practices.', difficulty: 'Beginner', questions: 8, time: '10m', xp: 120, unlocked: true, category: 'Credentials' },
                { id: 'q8', title: 'Ransomware Awareness & Response', description: 'Understand ransomware kill chains, negotiation tactics, and incident response procedures.', difficulty: 'Expert', questions: 9, time: '20m', xp: 300, unlocked: true, category: 'Ransomware' },
                { id: 'q9', title: 'Network Security & Firewall Basics', description: 'Test knowledge of network attack vectors, firewall rules, intrusion detection, and segmentation.', difficulty: 'Intermediate', questions: 8, time: '15m', xp: 200, unlocked: true, category: 'Network' },
            ];
            setQuizzes(mockQuizzes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30">
                        <FileQuestion className="text-yellow-400 w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-black italic text-white tracking-tight uppercase">
                        Knowledge <span className="text-yellow-400">Assessments</span>
                    </h1>
                </div>
                <p className="text-white/40 text-lg font-medium max-w-xl">
                    Validate your theoretical security knowledge across various operational domains.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz, index) => (
                    <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className={`h-full flex flex-col p-8 group transition-all duration-500 hover:scale-[1.02] ${quiz.unlocked
                            ? 'bg-white/[0.02] border-white/10 hover:border-yellow-400/40'
                            : 'bg-black/40 border-white/5 opacity-60'
                            }`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${quiz.category === 'Phishing' ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' :
                                    quiz.category === 'Vishing' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                    }`}>
                                    {quiz.category}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${quiz.difficulty === 'Beginner' ? 'bg-green-500' :
                                        quiz.difficulty === 'Intermediate' ? 'bg-yellow-400' : 'bg-red-500'
                                        }`} />
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">{quiz.difficulty}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black italic text-white mb-3 uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">
                                {quiz.title}
                            </h3>
                            <p className="text-white/40 text-sm mb-8 flex-grow leading-relaxed">
                                {quiz.description}
                            </p>

                            <div className="flex items-center gap-6 mb-8 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">{quiz.questions} Qs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">{quiz.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">50 XP</span>
                                </div>
                            </div>

                            {quiz.unlocked ? (
                                <Button
                                    variant="primary"
                                    className="w-full gap-2 bg-yellow-400 hover:bg-yellow-300 text-black uppercase tracking-[0.2em] font-black text-[10px]"
                                    onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                >
                                    Initialize <ArrowRight size={14} />
                                </Button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest">
                                    <Lock size={12} /> Complete {quiz.category} Lab to Unlock
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
