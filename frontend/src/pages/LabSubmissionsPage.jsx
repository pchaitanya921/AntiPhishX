import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, XCircle, Search, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

export default function LabSubmissionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    const fetchSubmissions = async () => {
        try {
            const response = await api.get(`/labs/${id}/submissions`);
            setSubmissions(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setLoading(false);
        }
    };

    const filteredSubmissions = submissions.filter(sub =>
        sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(`/labs/${id}`)}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-2"
                    >
                        <ArrowLeft size={14} /> Back to Lab
                    </button>
                    <h1 className="text-3xl font-black italic tracking-tight text-white">Lab Submissions</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
                        Activity Log • Lab ID: {id}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyber-cyan/50 text-sm w-64 text-white placeholder-white/20"
                    />
                </div>
            </div>

            {/* Submissions Table */}
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#0d1117]/80 ">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
                                <th className="p-4">User</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Score</th>
                                <th className="p-4">Time</th>
                                <th className="p-4">Hints</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center text-cyber-purple font-bold text-xs uppercase border border-cyber-purple/30">
                                                    {sub.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-cyber-cyan transition-colors">{sub.user?.name || 'Unknown User'}</div>
                                                    <div className="text-xs text-white/40">{sub.user?.email || 'No Email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {sub.isCorrect ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide">
                                                    <CheckCircle size={12} /> Passed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide">
                                                    <XCircle size={12} /> Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono font-bold text-white/80">
                                            {sub.score} <span className="text-xs text-white/30">PTS</span>
                                        </td>
                                        <td className="p-4 font-mono text-white/60">
                                            {formatTime(sub.timeSpent)}
                                        </td>
                                        <td className="p-4 text-white/60">
                                            {sub.hintsUsed > 0 ? (
                                                <span className="text-yellow-500 font-bold">{sub.hintsUsed}</span>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-white/40 text-xs font-mono">
                                            {format(new Date(sub.submittedAt), 'MMM d, yyyy HH:mm')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-white/30 italic">
                                        No submissions found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

