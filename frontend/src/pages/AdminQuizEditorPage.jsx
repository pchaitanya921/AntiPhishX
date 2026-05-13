import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    FileText,
    Settings,
    Layout,
    HelpCircle
} from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import api from '../services/api';

export default function AdminQuizEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!id;

    if (user?.role !== 'admin') {
        return <Navigate to="/quizzes" replace />;
    }

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('settings'); // settings, questions

    const [formData, setFormData] = useState({
        title: '',
        category: 'Phishing',
        difficulty: 'Beginner',
        xp: 100,
        timeLimitSeconds: 600,
        status: 'draft',
        questions: []
    });

    useEffect(() => {
        if (isEditing) {
            fetchQuiz();
        }
    }, [id]);

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${id}`);
            setFormData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching quiz:', err);
            setError('Failed to load quiz data');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    correct: 0,
                    explanation: ''
                }
            ]
        }));
        setActiveTab('questions');
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.questions.length === 0) {
            setError('Please add at least one question');
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (isEditing) {
                await api.put(`/quizzes/${id}`, formData);
            } else {
                await api.post('/quizzes', formData);
            }
            setSuccess(true);
            setTimeout(() => navigate('/admin/quizzes'), 1500);
        } catch (err) {
            console.error('Error saving quiz:', err);
            setError(err.response?.data?.message || 'Failed to save quiz');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin/quizzes')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black italic text-white mb-1 uppercase tracking-tighter">
                            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
                        </h1>
                        <p className="text-white/60 text-sm">
                            {isEditing ? `Editing: ${formData.title}` : 'Design a new assessment for your users'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {success && <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle size={16} /> Saved Successfully</span>}
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-cyber-purple text-white hover:bg-cyber-purple/90 font-bold min-w-[140px]"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                {isEditing ? 'Update Quiz' : 'Finalize Quiz'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2 font-bold animate-pulse">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black transition-all ${activeTab === 'settings' ? 'bg-cyber-purple text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Settings size={16} /> Configuration
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black transition-all ${activeTab === 'questions' ? 'bg-cyber-purple text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Layout size={16} /> Questions ({formData.questions.length})
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {activeTab === 'settings' && (
                    <Card className="p-8 space-y-6">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6 uppercase tracking-widest border-l-4 border-cyber-purple pl-4">General Settings</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/40 tracking-widest">Quiz Title</label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Advanced Phishing Tactics"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Select
                                        label="Category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        options={[
                                            { id: 'Phishing', name: 'Phishing' },
                                            { id: 'Vishing', name: 'Vishing' },
                                            { id: 'Technical', name: 'Technical' },
                                            { id: 'Social', name: 'Social' },
                                            { id: 'QR Code', name: 'QR Code' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <Select
                                        label="Difficulty"
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        options={[
                                            { id: 'Beginner', name: 'Beginner' },
                                            { id: 'Intermediate', name: 'Intermediate' },
                                            { id: 'Expert', name: 'Expert' }
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/40 tracking-widest">XP Points</label>
                                    <Input
                                        type="number"
                                        name="xp"
                                        value={formData.xp}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/40 tracking-widest">Time Limit (Sec)</label>
                                    <Input
                                        type="number"
                                        name="timeLimitSeconds"
                                        value={formData.timeLimitSeconds}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Select
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        options={[
                                            { id: 'draft', name: 'Draft (In-progress)' },
                                            { id: 'published', name: 'Published (Live)' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </section>
                    </Card>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        {formData.questions.map((q, qIndex) => (
                            <Card key={qIndex} className="p-8 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-purple" />
                                <div className="flex justify-between items-start mb-6">
                                    <Badge className="bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30 font-black">QUESTION #{qIndex + 1}</Badge>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeQuestion(qIndex)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-white/40 tracking-widest">Question Text</label>
                                        <textarea
                                            value={q.question}
                                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyber-purple transition-all min-h-[80px]"
                                            placeholder="Ask something challenging..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <input 
                                                        type="radio" 
                                                        name={`correct-${qIndex}`} 
                                                        checked={q.correct === oIndex}
                                                        onChange={() => updateQuestion(qIndex, 'correct', oIndex)}
                                                        className="w-4 h-4 accent-cyber-purple"
                                                    />
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Opt {oIndex + 1}</span>
                                                </div>
                                                <Input
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    className={`pl-20 ${q.correct === oIndex ? 'border-cyber-purple bg-cyber-purple/5' : ''}`}
                                                    placeholder={`Choice ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-white/40 tracking-widest">Correct Explanation</label>
                                        <textarea
                                            value={q.explanation}
                                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                            className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-white/80 focus:outline-none focus:border-emerald-500 transition-all text-sm min-h-[60px]"
                                            placeholder="Explain why this answer is correct..."
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <Button
                            type="button"
                            onClick={addQuestion}
                            className="w-full py-6 border-2 border-dashed border-white/10 bg-transparent hover:border-cyber-purple/50 hover:bg-cyber-purple/5 text-white/40 hover:text-white flex items-center justify-center gap-3 transition-all rounded-2xl"
                        >
                            <Plus size={20} />
                            <span className="font-black uppercase tracking-widest text-sm">Add Question</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

