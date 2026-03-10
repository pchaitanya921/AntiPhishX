import React from 'react';
import EmailClient from './EmailClient';
import WebBrowser from './WebBrowser';
import MobileDevice from './MobileDevice';
import QREnvironment from './QREnvironment';
import Terminal from './Terminal';
import SocialEngineeringEnvironment from './SocialEngineeringEnvironment';
import VishingEnvironment from './VishingEnvironment';
import SmishingEnvironment from './SmishingEnvironment';
import { LayoutGrid } from 'lucide-react';

const LabWorkspace = ({ lab, onSimulationComplete }) => {
    const { type, content, topic } = lab;

    const renderEnvironment = () => {
        // ── Topic-based overrides ─────────────────────────────────────────────
        // Social Engineering legacy labs
        if (topic === 'social_engineering' && type === 'email' && !content?.email) {
            return (
                <div className="flex-1 flex flex-col w-full min-w-0 max-w-5xl mx-auto overflow-auto justify-start pt-8 pb-12 bg-[#0d1117]">
                    <SocialEngineeringEnvironment content={content} onComplete={onSimulationComplete} />
                </div>
            );
        }

        // Vishing topic — always use VishingEnvironment regardless of 'type' stored in DB
        if (topic === 'vishing' || type === 'vishing') {
            return (
                <div className="flex-1 flex flex-col w-full min-w-0 max-w-full mx-auto overflow-auto justify-start">
                    <VishingEnvironment content={content} level={lab.level} onComplete={onSimulationComplete} />
                </div>
            );
        }

        // Smishing topic — always use SmishingEnvironment
        if (topic === 'smishing' || type === 'smishing') {
            return (
                <div className="flex-1 flex flex-col w-full min-w-0 max-w-full mx-auto overflow-auto justify-start">
                    <SmishingEnvironment content={content} level={lab.level} onComplete={onSimulationComplete} />
                </div>
            );
        }

        // Override for Advanced Threats and Malware Detection topics
        // These should use interactive simulations (email/browser) instead of terminal
        if (topic === 'advanced_threats' || topic === 'malware_detection') {
            // If lab has email content, use EmailClient
            if (type === 'email' || content?.email || (content?.sender && content?.subject)) {
                return (
                    <div className="flex-1 flex flex-col w-full min-w-0 max-w-5xl overflow-auto lab-scrollbar border-x border-white/5 shadow-2xl justify-start pt-8 pb-12">
                        <EmailClient content={content} />
                    </div>
                );
            }
            // If lab has URL content, use WebBrowser
            if (type === 'url' || content?.url || content?.fullUrl) {
                return (
                    <div className="flex-1 flex flex-col w-full min-w-0 max-w-5xl overflow-auto lab-scrollbar border-x border-white/5 shadow-2xl justify-start pt-8 pb-12">
                        <WebBrowser content={content} />
                    </div>
                );
            }
            // Fallback to terminal only if no email/url content
        }

        switch (type) {
            case 'social_engineering':
                return (
                    <div className="flex flex-col h-full w-full min-w-0 max-w-5xl mx-auto overflow-auto lab-scrollbar justify-start pt-8 pb-12 bg-[#0d1117]">
                        <SocialEngineeringEnvironment content={content} onComplete={onSimulationComplete} />
                    </div>
                );
            case 'email':
            case 'phishing': // Legacy support
                return (
                    <div className="flex flex-col h-full w-full min-w-0 max-w-5xl overflow-auto lab-scrollbar border-x border-white/5 shadow-2xl justify-start pt-8 pb-12">
                        <EmailClient content={content} />
                    </div>
                );
            case 'url':
                return (
                    <div className="flex flex-col h-full w-full min-w-0 max-w-5xl overflow-auto lab-scrollbar border-x border-white/5 shadow-2xl justify-start pt-8 pb-12">
                        <WebBrowser content={content} />
                    </div>
                );
            case 'vishing':
                return (
                    <div className="flex-1 flex flex-col w-full min-w-0 max-w-full mx-auto overflow-auto justify-start">
                        <VishingEnvironment content={content} level={lab.level} onComplete={onSimulationComplete} />
                    </div>
                );
            case 'smishing':
                return (
                    <div className="flex-1 flex flex-col w-full min-w-0 max-w-full mx-auto overflow-auto justify-start">
                        <SmishingEnvironment content={content} level={lab.level} onComplete={onSimulationComplete} />
                    </div>
                );
            case 'sms':
            case 'call':
                return (
                    <div className="flex flex-col h-full w-full min-w-0 max-w-5xl mx-auto overflow-auto lab-scrollbar justify-start pt-8 pb-12">
                        <MobileDevice
                            content={content}
                            level={lab.level}
                            onComplete={onSimulationComplete}
                        />
                    </div>
                );
            case 'qr':
            case 'qr_code':
                return (
                    <div className="flex flex-col h-full w-full min-w-0 max-w-5xl mx-auto overflow-auto justify-start pt-8 pb-12 text-white">
                        <QREnvironment
                            content={content}
                            onComplete={onSimulationComplete}
                        />
                    </div>
                );
            case 'file':
            case 'malware':
                return (
                    <div className="flex flex-col w-full min-w-0 max-w-5xl border-x border-white/5 shadow-2xl justify-start pt-8 pb-12 mt-8 min-h-[60vh] max-h-[75vh] overflow-y-auto lab-scrollbar">
                        <Terminal
                            content={content}
                            steps={content?.steps}
                            onStepComplete={(stepId) => {
                                console.log('Step completed:', stepId);
                                // Trigger re-render or pass to parent if needed
                            }}
                        />
                    </div>
                );
            default:
                // Fallback: If content has 'email' structure or sender/subject, assume email
                if (content?.email || (content?.sender && content?.subject)) {
                    return (
                        <div className="flex flex-col h-full w-full min-w-0 max-w-5xl overflow-auto border-x border-white/5 shadow-2xl justify-start pt-8 pb-12">
                            <EmailClient content={content} />
                        </div>
                    );
                }

                return (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 pt-24 pb-12">
                        <LayoutGrid size={48} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-bold">Standard Simulation Environment</h3>
                        <p className="text-sm mt-2">No specific simulated tool available for this lab type.</p>
                        {/* Fallback to generic content display if specific UI not found */}
                        <div className="bg-white/5 p-6 rounded-xl mt-8 max-w-lg w-full font-mono text-xs overflow-auto">
                            {JSON.stringify(content, null, 2)}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 w-full bg-[#0d1117] flex flex-col overflow-hidden relative min-h-[calc(100vh-80px)]">
            {/* Workspace Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <div className="text-[20vw] font-black text-white">LAB</div>
            </div>

            {/* Active Tool Window */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {renderEnvironment()}
            </div>
        </div>
    );
};

export default LabWorkspace;
