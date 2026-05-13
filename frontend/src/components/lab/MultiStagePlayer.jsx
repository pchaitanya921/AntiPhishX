import React, { useState, useEffect } from 'react';
import { labAPI } from '../../services/api';
import StageConsequence from './StageConsequence';
import { Button, Card } from '../ui';
import { CheckCircle, ArrowRight } from 'lucide-react';

const MultiStagePlayer = ({ labId, onComplete }) => {
    const [sessionData, setSessionData] = useState(null);
    const [consequence, setConsequence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSession();
    }, [labId]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const res = await labAPI.startSession(labId);
            if (res.success) {
                setSessionData(res.data);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError('Failed to load multi-stage lab session.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = async (optionIndex) => {
        try {
            setLoading(true);
            const res = await labAPI.submitStage(labId, { optionIndex });
            
            if (res.success) {
                if (res.data.consequence) {
                    setConsequence(res.data.consequence);
                    // Do not load next stage until consequence is acknowledged
                } else if (res.data.sessionState === 'completed') {
                    if (onComplete) onComplete(res.data);
                } else {
                    // Load the next stage seamlessly
                    loadSession();
                }
            }
        } catch (err) {
            setError('Failed to submit choice.');
        } finally {
            setLoading(false);
        }
    };

    const handleConsequenceAck = () => {
        setConsequence(null);
        // After acknowledging consequence, check if session is completed or load next stage
        // We need to re-fetch the session state to know what stage we are currently on
        loadSession();
    };

    if (loading && !sessionData && !consequence) {
        return <div className="p-8 text-center animate-pulse text-cyber-purple">Loading Simulation...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (consequence) {
        return <StageConsequence consequence={consequence} onContinue={handleConsequenceAck} />;
    }

    if (!sessionData || !sessionData.stageData) {
        return <div className="p-8 text-center text-green-500 flex flex-col items-center">
            <CheckCircle size={48} className="mb-4" />
            <h3 className="text-xl font-bold">Simulation Completed</h3>
            <Button onClick={() => onComplete && onComplete()} className="mt-4">Return to Results</Button>
        </div>;
    }

    const { stageData } = sessionData;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="p-6">
                <div className="mb-4 pb-4 border-b border-slate-700">
                    <span className="text-xs font-mono uppercase text-cyber-purple tracking-widest bg-cyber-purple/10 px-3 py-1 rounded-full">
                        Stage: {stageData.stageId}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-4">
                        Incoming {stageData.type.toUpperCase()} Intercept
                    </h2>
                </div>

                {/* Simulated Content Payload */}
                <div className="bg-black/50 border border-slate-700 rounded-xl p-6 mb-8 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                    {JSON.stringify(stageData.content, null, 2)}
                </div>

                {/* Options / Actions */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Available Actions</h4>
                    {stageData.options && stageData.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 transition-all flex items-center justify-between group"
                            disabled={loading}
                        >
                            <span className="text-slate-200">{opt.text}</span>
                            <ArrowRight size={18} className="text-slate-500 group-hover:text-cyber-cyan transition-colors" />
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default MultiStagePlayer;

