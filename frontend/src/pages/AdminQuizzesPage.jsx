import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    FileText,
    Clock,
    Zap,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import api from '../services/api';

const CATEGORIES = [
    { id: 'all', name: 'All Categories' },
    { id: 'Phishing', name: 'Phishing' },
    { id: 'Vishing', name: 'Vishing' },
    { id: 'Technical', name: 'Technical' },
    { id: 'Social', name: 'Social' },
    { id: 'QR Code', name: 'QR Code' },
    { id: 'Malware', name: 'Malware' },
    { id: 'Credentials', name: 'Credentials' },
    { id: 'Ransomware', name: 'Ransomware' },
    { id: 'Network', name: 'Network' }
];

export default function AdminQuizzesPage() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchQuizzes();
    }, [selectedCategory]);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/quizzes');
            let data = response.data.data;
            
            if (selectedCategory !== 'all') {
                data = data.filter(q => q.category === selectedCategory);
            }
            
            setQuizzes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;

        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes(quizzes.filter(q => q._id !== id));
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Failed to delete quiz');
        }
    };

    const filteredQuizzes = quizzes.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tight text-white mb-2">
                        Quiz <span className="text-cyber-purple">Management</span>
                    </h1>
                    <p className="text-white/60">Create and manage dynamic assessments for users.</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/quizzes/new')}
                    className="flex items-center gap-2 bg-cyber-purple text-white hover:bg-cyber-purple/90 font-bold"
                >
                    <Plus size={20} />
                    Create New Quiz
                </Button>
            </div>

            <Card className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <Input
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-cyber-purple text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </Card>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredQuizzes.length === 0 ? (
                        <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-2xl">
                            No quizzes found. Click "Create New Quiz" to get started.
                        </div>
                    ) : (
                        filteredQuizzes.map((quiz) => (
                            <QuizListItem
                                key={quiz._id}
                                quiz={quiz}
                                onDelete={() => handleDelete(quiz._id)}
                                onEdit={() => navigate(`/admin/quizzes/${quiz._id}/edit`)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function QuizListItem({ quiz, onDelete, onEdit }) {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Beginner': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Expert': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white bg-white/10 border-white/20';
        }
    };

    return (
        <div className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center gap-4">
            <div className={`p-3 rounded-lg bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20`}>
                <FileText size={24} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">{quiz.title}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase border-white/20">
                        {quiz.category}
                    </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-black border ${getDifficultyColor(quiz.difficulty)}`}>
                         {quiz.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {Math.floor(quiz.timeLimitSeconds / 60)}m
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Zap size={14} /> {quiz.xp} XP
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FileText size={14} /> {quiz.questions?.length || 0} Questions
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${quiz.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {quiz.status}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={onDelete}>
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
}

