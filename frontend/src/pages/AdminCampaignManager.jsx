import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Plus, Send, AlertTriangle, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';
import { Card, Button, Input, Badge, Spinner } from '../components/ui';
import { campaignAPI } from '../services/api';

export default function AdminCampaignManager() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    // New Campaign Form
    const [name, setName] = useState('');
    const [templateType, setTemplateType] = useState('AI_Adaptive');
    const [targetDepartment, setTargetDepartment] = useState('All');
    
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = await campaignAPI.getCampaigns();
            if (res.data && res.data.success) {
                setCampaigns(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        try {
            const res = await campaignAPI.createCampaign({ name, templateType, targetDepartment });
            if (res.data.success) {
                setCampaigns([res.data.data, ...campaigns]);
                setIsCreating(false);
                setName('');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create campaign');
        }
    };

    const handleLaunchCampaign = async (id) => {
        if (!confirm('Are you sure you want to launch this campaign? Simulated phishing emails will be sent to the targets.')) return;
        
        try {
            const res = await campaignAPI.launchCampaign(id);
            if (res.data.success) {
                alert('Campaign launched successfully!');
                fetchCampaigns();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to launch campaign');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic flex items-center gap-3">
                        <Mail className="text-rose-500" />
                        Phishing Campaigns
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">
                        Manage real-world email simulations
                    </p>
                </div>
                <Button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Campaign
                </Button>
            </div>

            {isCreating && (
                <Card className="p-6 border-rose-500/30 bg-rose-500/5">
                    <h2 className="text-xl font-black italic mb-4">Create New Campaign</h2>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Campaign Name</label>
                                <Input 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder="e.g. Q3 Urgent Invoice Test" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Template</label>
                                <select 
                                    value={templateType}
                                    onChange={e => setTemplateType(e.target.value)}
                                    className="w-full bg-cyber-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                                >
                                    <option value="AI_Adaptive">⭐ AI Adaptive (Dynamic Generation)</option>
                                    <option value="password_reset">Password Reset (High Urgency)</option>
                                    <option value="urgent_invoice">Urgent Invoice (Finance Focus)</option>
                                    <option value="hr_policy_update">HR Policy Update (Broad Focus)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Target Department</label>
                                <select 
                                    value={targetDepartment}
                                    onChange={e => setTargetDepartment(e.target.value)}
                                    className="w-full bg-cyber-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                                >
                                    <option value="All">All Departments</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">HR</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Executive">Executive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white">Create Draft</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-12"><Spinner /></div>
            ) : campaigns.length === 0 ? (
                <Card className="p-12 text-center text-white/40 border-white/5">
                    No campaigns found. Create one to start testing your organization.
                </Card>
            ) : (
                <div className="space-y-4">
                    {campaigns.map(campaign => (
                        <Card key={campaign._id} className="p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                                        <Badge variant={campaign.status === 'active' ? 'primary' : campaign.status === 'completed' ? 'success' : 'outline'}>
                                            {campaign.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-white/40 flex gap-4">
                                        <span>Template: {campaign.templateType.replace('_', ' ')}</span>
                                        <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="text-center px-4 border-r border-white/10">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Targets</p>
                                        <p className="text-xl font-black">{campaign.metrics.totalTargets}</p>
                                    </div>
                                    <div className="text-center px-4 border-r border-white/10">
                                        <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Opened</p>
                                        <p className="text-xl font-black text-emerald-400">{campaign.metrics.emailsOpened}</p>
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-[10px] text-rose-500 uppercase tracking-widest font-bold">Clicked (Failed)</p>
                                        <p className="text-xl font-black text-rose-500">{campaign.metrics.linksClicked}</p>
                                    </div>
                                </div>

                                <div>
                                    {campaign.status === 'draft' && (
                                        <Button 
                                            onClick={() => handleLaunchCampaign(campaign._id)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                                        >
                                            <Send size={14} />
                                            Launch
                                        </Button>
                                    )}
                                    {campaign.status === 'active' && (
                                        <Button disabled className="bg-white/10 text-white/30 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                                            <Activity size={14} />
                                            Running
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

