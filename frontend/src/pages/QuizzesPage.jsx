import React, { useState, useEffect } from 'react';
import { FileQuestion, Lock, Search, Filter, BookOpen, Clock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import api from '../services/api';

export default function QuizzesPage() {
    const { user } = useAuth();
    const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quizzes');
            setQuizzes(response.data.data);
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
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
                    {isAdminOrInstructor && (
                        <Button
                            variant="secondary"
                            className="h-12 px-6 border-yellow-400/30 hover:border-yellow-400/60 text-yellow-400"
                            onClick={() => navigate('/admin/quizzes')}
                        >
                            <ShieldAlert size={18} className="mr-2" />
                            Administer Quizzes
                        </Button>
                    )}
                </div>

            {quizzes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-40">
                    <FileQuestion size={48} className="text-cyber-gray" />
                    <p className="font-black uppercase text-xs tracking-widest text-cyber-gray">No assessments available</p>
                    {isAdminOrInstructor && (
                        <p className="text-xs text-cyber-gray mt-2">Click "Administer Quizzes" to create one.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quizzes.map((quiz, index) => (
                        <motion.div
                            key={quiz._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                        <Card className="h-full flex flex-col p-8 group transition-all duration-500 hover:scale-[1.02] bg-white/[0.02] border-white/10 hover:border-yellow-400/40">
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
                                {quiz.description || "Test your knowledge in this objective assessment."}
                            </p>

                            <div className="flex items-center gap-6 mb-8 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">{quiz.questions?.length || 0} Qs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">{Math.floor(quiz.timeLimitSeconds / 60)}m</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-yellow-400" />
                                    <span className="text-xs font-bold text-white">{quiz.xp} XP</span>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                className="w-full gap-2 bg-yellow-400 hover:bg-yellow-300 text-black uppercase tracking-[0.2em] font-black text-[10px]"
                                onClick={() => navigate(`/quizzes/${quiz._id}`)}
                            >
                                Initialize <ArrowRight size={14} />
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>
            )}
        </div>
    );
}

