import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { Card, Button, Input, Select } from '../components/ui';
import api from '../services/api';

const TOPICS = [
    { id: 'phishing', name: 'Phishing' },
    { id: 'vishing', name: 'Vishing' },
    { id: 'smishing', name: 'Smishing' },
    { id: 'qr_code', name: 'QR/Quishing' },
    { id: 'social_engineering', name: 'Social Engineering' },
    { id: 'advanced_threats', name: 'Advanced Threats' },
    { id: 'malware_detection', name: 'Malware' }
];

const LAB_TYPES = [
    { id: 'email', name: 'Email Analysis' },
    { id: 'url', name: 'URL Analysis' },
    { id: 'message', name: 'Message Analysis' },
    { id: 'call', name: 'Voice Call (Vishing)' },
    { id: 'sms', name: 'SMS (Smishing)' },
    { id: 'qr', name: 'QR Code' },
    { id: 'file', name: 'File/Malware' },
    { id: 'scenario', name: 'General Scenario' }
];

export default function AdminLabEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = !!id;

    // RBAC: Admins and Instructors can edit labs
    if (user?.role !== 'admin' && user?.role !== 'instructor') {
        return <Navigate to="/labs" replace />;
    }

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: 'phishing',
        level: 'beginner',
        type: 'email',
        difficulty: 1,
        published: true,
        points: 100,
        timeLimit: 600,
        order: 1,
        correctAnswer: 'phishing',
        explanation: '',
        content: {}, // Will hold type-specific content
        indicators: [],
        legitimateSignals: [],
        hints: []
    });

    const [jsonContent, setJsonContent] = useState('{}');

    useEffect(() => {
        if (isEditing) {
            fetchLab();
        }
    }, [id]);

    const fetchLab = async () => {
        try {
            const response = await api.get(`/labs/${id}`);
            const lab = response.data;
            setFormData(lab);
            // Pre-fill type specific content into JSON editor
            const initialContent = lab.content?.[lab.type] || {};
            setJsonContent(JSON.stringify(initialContent, null, 2));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching lab:', err);
            setError('Failed to load lab data');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleJsonChange = (e) => {
        setJsonContent(e.target.value);
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Validate JSON content
            let parsedContent;
            try {
                parsedContent = JSON.parse(jsonContent);
            } catch (jsonErr) {
                setError('Invalid JSON in Content field');
                setSaving(false);
                return;
            }

            // Construct payload
            const payload = {
                ...formData,
                content: {
                    [formData.type]: parsedContent
                }
            };

            if (isEditing) {
                await api.put(`/labs/${id}`, payload);
            } else {
                await api.post('/labs', payload);
            }

            setSuccess(true);
            setTimeout(() => {
                if (!isEditing) navigate(-1);
            }, 1000);
        } catch (err) {
            console.error('Error saving lab:', err);
            setError(err.response?.data?.error || 'Failed to save lab');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black italic text-white mb-1">
                            {isEditing ? 'Edit Lab' : 'Create New Lab'}
                        </h1>
                        <p className="text-white/60 text-sm">
                            {isEditing ? `Editing: ${formData.title}` : 'Configure a new simulation scenario'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {success && <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle size={16} /> Saved!</span>}
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-bold min-w-[120px]"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                {isEditing ? 'Update Lab' : 'Create Lab'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2 font-bold">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-white/60">Title</label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. CEO Fraud Attempt"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Select
                                label="Topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                options={TOPICS}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Select
                                label="Status"
                                name="status"
                                value={formData.status || 'published'}
                                onChange={handleChange}
                                options={[
                                    { id: 'draft', name: 'Draft (Admin Only)' },
                                    { id: 'published', name: 'Published (Visible to All)' },
                                    { id: 'archived', name: 'Archived' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-white/60">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-cyan text-sm min-h-[80px]"
                            placeholder="Brief description of the scenario..."
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Select
                                label="Level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                options={[
                                    { id: 'beginner', name: 'Beginner' },
                                    { id: 'intermediate', name: 'Intermediate' },
                                    { id: 'advanced', name: 'Advanced' }
                                ]}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-white/60">Points</label>
                            <Input
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-white/60">Time (sec)</label>
                            <Input
                                type="number"
                                name="timeLimit"
                                value={formData.timeLimit}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-white/60">Difficulty (1-10)</label>
                            <Input
                                type="number"
                                name="difficulty"
                                min="1" max="10"
                                value={formData.difficulty}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Card>

                {/* Scenario & Steps */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Scenario & Objectives</h2>

                    <div className="space-y-1">
                        <Select
                            label="Lab Type (Environment)"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={LAB_TYPES}
                        />
                        <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                            <Info size={12} />
                            Determines the simulated environment (Email Client, Browser, Phone, etc.)
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-white/60">Detailed Scenario</label>
                        <textarea
                            name="scenario"
                            value={formData.scenario || ''}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-cyan text-sm min-h-[120px]"
                            placeholder="Full story/context for the user..."
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/60 flex justify-between items-center">
                            <span>Mission Steps</span>
                            <Button type="button" size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => addArrayItem('steps')}>+ Add Step</Button>
                        </label>
                        {(formData.steps || []).map((step, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-white/40 font-mono text-xs w-6 pt-2">{i + 1}.</span>
                                <Input
                                    value={step}
                                    onChange={(e) => handleArrayChange('steps', i, e.target.value)}
                                    placeholder={`Step ${i + 1} instruction`}
                                />
                                <Button type="button" size="sm" variant="ghost" className="text-red-400 h-10 w-10 p-0" onClick={() => removeArrayItem('steps', i)}>×</Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Technical Content */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Technical Content</h2>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-white/60 flex justify-between">
                            <span>Simulation Data (JSON)</span>
                            <span className="text-cyber-cyan cursor-pointer hover:underline text-[10px]" onClick={() => {
                                setJsonContent('{\n  "sender": "CEO <ceo@company-update.com>",\n  "subject": "Urgent Wire Transfer",\n  "body": "Please process this immediately..."\n}');
                            }}>Load Template</span>
                        </label>
                        <textarea
                            value={jsonContent}
                            onChange={handleJsonChange}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-green-400 font-mono text-xs min-h-[200px] focus:outline-none focus:border-cyber-cyan"
                            spellCheck="false"
                        />
                        <p className="text-xs text-white/40">
                            Specific data for the simulation (headers for email, URL for browser, etc.)
                        </p>
                    </div>
                </Card>

                {/* Outcome & Evaluation */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Outcome & Evaluation</h2>

                    <div className="space-y-1">
                        <Select
                            label="Correct Answer"
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            options={[
                                { id: 'phishing', name: 'Phishing' },
                                { id: 'legitimate', name: 'Legitimate' },
                                { id: 'suspicious', name: 'Suspicious' }
                            ]}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-white/60">Explanation</label>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyber-cyan text-sm min-h-[80px]"
                        />
                    </div>

                    {/* Hints */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-white/60 flex justify-between items-center">
                            <span>Hints</span>
                            <Button type="button" size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => {
                                const newHints = [...(formData.hints || [])];
                                newHints.push({ content: '', cost: 10 });
                                setFormData(prev => ({ ...prev, hints: newHints }));
                            }}>+ Add Hint</Button>
                        </label>
                        {(formData.hints || []).map((hint, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <Input
                                    value={typeof hint === 'string' ? hint : hint.content}
                                    onChange={(e) => {
                                        const newHints = [...formData.hints];
                                        if (typeof newHints[i] === 'string') {
                                            newHints[i] = { content: e.target.value, cost: 10 };
                                        } else {
                                            newHints[i] = { ...newHints[i], content: e.target.value };
                                        }
                                        setFormData(prev => ({ ...prev, hints: newHints }));
                                    }}
                                    placeholder="Hint text..."
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    value={typeof hint === 'string' ? 10 : hint.cost}
                                    onChange={(e) => {
                                        const newHints = [...formData.hints];
                                        const cost = parseInt(e.target.value) || 0;
                                        if (typeof newHints[i] === 'string') {
                                            newHints[i] = { content: newHints[i], cost };
                                        } else {
                                            newHints[i] = { ...newHints[i], cost };
                                        }
                                        setFormData(prev => ({ ...prev, hints: newHints }));
                                    }}
                                    className="w-20 text-center"
                                    placeholder="Cost"
                                />
                                <Button type="button" size="sm" variant="ghost" className="text-red-400 h-10 w-10 p-0" onClick={() => removeArrayItem('hints', i)}>×</Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </form>
        </div>
    );
}
