import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, X } from 'lucide-react';

const Terminal = ({ content, steps, onStepComplete }) => {
    const { file } = content || {};
    const [completedSteps, setCompletedSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [history, setHistory] = useState([
        { type: 'output', text: 'AntiPhishX Secure OS v4.2 [Authorized Access Only]' },
        { type: 'output', text: 'Copyright (c) 2026 AntiPhishX. All rights reserved.' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Analyzing suspicious file...' },
        { type: 'output', text: `Target: ${file?.filename || 'unknown_file'}` },
        { type: 'output', text: '' },
    ]);
    const [input, setInput] = useState('');
    const terminalRef = useRef(null);
    const bottomRef = useRef(null);

    // Smarter auto-scroll: only scroll if at bottom or new command sent
    useEffect(() => {
        const terminal = terminalRef.current;
        if (!terminal) return;

        // Use a threshold of 100px to determine if we are "at the bottom"
        const isAtBottom = terminal.scrollHeight - terminal.scrollTop <= terminal.clientHeight + 100;

        if (isAtBottom) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [history]);

    const handleCommand = (e) => {
        e.preventDefault();
        const cmd = input.trim();
        const cmdLower = cmd.toLowerCase();

        // Add command to history
        const newHistory = [...history, { type: 'input', text: input }];

        // Check if we have steps for validation
        if (steps && steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            const isValidCommand = step.acceptedCommands.some(acceptedCmd =>
                cmdLower.includes(acceptedCmd.toLowerCase())
            );

            if (isValidCommand) {
                // Success! Step completed
                newHistory.push({ type: 'success', text: step.successMessage });
                const newCompletedSteps = [...completedSteps, currentStep];
                setCompletedSteps(newCompletedSteps);
                setCurrentStep(currentStep + 1);
                onStepComplete?.(currentStep);

                // Dispatch custom event for LabManual to listen
                window.dispatchEvent(new CustomEvent('labStepCompleted', {
                    detail: { stepId: currentStep, completedSteps: newCompletedSteps }
                }));

                // Check if all steps complete
                if (currentStep + 1 >= steps.length) {
                    newHistory.push({ type: 'success', text: '' });
                    newHistory.push({ type: 'success', text: '🎉 All objectives completed! You may now submit your findings.' });
                }
            } else if (cmdLower !== '' && !['help', 'clear'].includes(cmdLower)) {
                // Wrong command, show hint
                newHistory.push({ type: 'error', text: step.errorMessage });
            }
        }

        // Process standard commands
        let response = '';
        let responseType = 'output';

        if (cmdLower === 'help') {
            response = 'Available commands: ls, cat, file, strings, md5sum, clear, help, analyze';
        } else if (cmdLower === 'ls' || cmdLower.startsWith('ls ')) {
            response = `${file?.filename || 'suspicious.exe'}   notes.txt   config.ini`;
        } else if (cmdLower === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (cmdLower.startsWith('cat')) {
            response = 'Access Denied: Binary file cannot be displayed.';
        } else if (cmdLower.includes('file ')) {
            response = `${file?.filename}: PE32 executable (GUI) Intel 80386, for MS Windows`;
        } else if (cmdLower === 'analyze' || cmdLower === 'scan') {
            response = 'Scanning... THREAT DETECTED: Trojan.Win32.Phish.A';
        } else if (cmdLower === '') {
            response = '';
        } else if (!steps || steps.length === 0) {
            // No steps defined, show command not found
            response = `Command not found: ${cmd}`;
            responseType = 'error';
        }

        if (response) {
            newHistory.push({ type: responseType, text: response });
        }

        setHistory(newHistory);
        setInput('');

        // Force scroll to bottom on every user command
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    };

    return (
        <div className="flex flex-col w-full h-full min-h-[500px] bg-[#0A0A0A]/90  rounded-[2rem] overflow-hidden font-mono text-sm border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
            <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
            
            {/* Title Bar */}
            <div className="bg-white/[0.02] border-b border-white/5 px-8 py-5 flex items-center justify-between select-none relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <TerminalIcon size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-0.5">Tactical Analysis Node</div>
                        <div className="text-xs font-black italic text-white uppercase tracking-wider flex items-center gap-2">
                            analyst@antiphishx
                            <span className="text-[10px] text-emerald-500 animate-pulse">•</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-white/10">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    </div>
                </div>
            </div>

            {/* Terminal Window */}
            <div
                ref={terminalRef}
                className="flex-1 p-8 overflow-y-auto terminal-scrollbar relative z-10"
                onClick={() => document.getElementById('terminal-input')?.focus()}
            >
                <div className="space-y-2">
                    {history.map((line, i) => (
                        <div key={i} className={`leading-relaxed ${
                            line.type === 'input' ? 'text-white font-bold' :
                            line.type === 'success' ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                            line.type === 'error' ? 'text-amber-400' :
                            'text-emerald-500/80'
                        }`}>
                            {line.type === 'input' ? (
                                <span className="text-emerald-500/40 mr-3 font-black">λ</span>
                            ) : null}
                            {line.text}
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <form onSubmit={handleCommand} className="mt-4 flex items-center group">
                    <span className="text-emerald-500/60 mr-3 font-black animate-pulse">λ</span>
                    <input
                        id="terminal-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white caret-emerald-500 font-bold text-sm tracking-wide"
                        autoComplete="off"
                        autoFocus
                    />
                </form>
                <div ref={bottomRef} />
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        </div>
    );
};

export default Terminal;

