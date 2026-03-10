import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Beaker,
    Shield,
    Clock,
    Trophy
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import api from '../services/api';

const TOPICS = [
    { id: 'all', name: 'All Topics' },
    { id: 'phishing', name: 'Phishing' },
    { id: 'vishing', name: 'Vishing' },
    { id: 'smishing', name: 'Smishing' },
    { id: 'qr_code', name: 'QR/Quishing' },
    { id: 'social_engineering', name: 'Social Engineering' },
    { id: 'advanced_threats', name: 'Advanced Threats' },
    { id: 'malware_detection', name: 'Malware' }
];

export default function AdminLabsPage() {
    const navigate = useNavigate();
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('all');

    useEffect(() => {
        fetchLabs();
    }, [selectedTopic]);

    const fetchLabs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedTopic !== 'all') params.topic = selectedTopic;

            // Re-using the public API for now, could be an admin-specific one later
            const response = await api.get('/labs', { params });
            setLabs(response.data.data);
        } catch (error) {
            console.error('Error fetching labs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lab? This action cannot be undone.')) return;

        try {
            await api.delete(`/labs/${id}`);
            setLabs(labs.filter(lab => lab._id !== id));
        } catch (error) {
            console.error('Error deleting lab:', error);
            alert('Failed to delete lab');
        }
    };

    const filteredLabs = labs.filter(lab =>
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tight text-white mb-2">
                        Lab <span className="text-cyber-cyan">Management</span>
                    </h1>
                    <p className="text-white/60">Create, edit, and manage simulation scenarios.</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/labs/new')}
                    className="flex items-center gap-2 bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-bold"
                >
                    <Plus size={20} />
                    Create New Lab
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <Input
                        placeholder="Search labs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${selectedTopic === topic.id
                                ? 'bg-cyber-cyan text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Labs List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredLabs.length === 0 ? (
                        <div className="text-center py-20 text-white/40">
                            No labs found matching your criteria.
                        </div>
                    ) : (
                        filteredLabs.map((lab) => (
                            <LabListItem
                                key={lab._id}
                                lab={lab}
                                onDelete={() => handleDelete(lab._id)}
                                onEdit={() => navigate(`/admin/labs/${lab._id}/edit`)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function LabListItem({ lab, onDelete, onEdit }) {
    const getTopicColor = (topic) => {
        const colors = {
            phishing: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
            vishing: 'text-green-400 bg-green-400/10 border-green-400/20',
            smishing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            qr_code: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
            social_engineering: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
            advanced_threats: 'text-red-400 bg-red-400/10 border-red-400/20',
            malware_detection: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
        };
        return colors[lab.topic] || 'text-white bg-white/10 border-white/20';
    };

    return (
        <div className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center gap-4">
            <div className={`p-3 rounded-lg ${getTopicColor(lab.topic)}`}>
                <Beaker size={24} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">{lab.title}</h3>
                    <Badge variant="outline" className={`text-[10px] uppercase ${getTopicColor(lab.topic)} border`}>
                        {lab.topic.replace('_', ' ')}
                    </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1.5">
                        <Shield size={14} /> {lab.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {Math.floor(lab.timeLimit / 60)}m
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Trophy size={14} /> {lab.points}pts
                    </span>
                    {lab.correctAnswer && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20 text-[10px] uppercase font-black">
                            Answer: <span className="text-white ml-0.5">{lab.correctAnswer}</span>
                        </span>
                    )}
                    {Array.isArray(lab.hints) && lab.hints.length > 0 && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] uppercase font-black">
                            Hints: <span className="text-white ml-0.5">{lab.hints.length}</span>
                        </span>
                    )}
                    {lab.status && (
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${lab.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            lab.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                            {lab.status}
                        </span>
                    )}
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
