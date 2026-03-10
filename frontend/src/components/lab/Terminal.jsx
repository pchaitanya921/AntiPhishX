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
        <div className="flex flex-col w-full min-h-[500px] bg-[#1e1e1e] rounded-lg overflow-hidden font-mono text-sm border border-[#333] shadow-2xl">
            {/* Title Bar */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-white/80">
                    <TerminalIcon size={14} />
                    <span className="font-medium text-xs">analyst@antiphishx:~</span>
                </div>
                <div className="flex items-center gap-4 text-white/40">
                    <X size={14} className="hover:text-red-400 cursor-pointer" />
                </div>
            </div>

            {/* Terminal Window */}
            <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto terminal-scrollbar"
                onClick={() => document.getElementById('terminal-input')?.focus()}
            >
                <div className="space-y-1">
                    {history.map((line, i) => (
                        <div key={i} className={`${line.type === 'input' ? 'text-white font-bold' :
                            line.type === 'success' ? 'text-green-400 font-semibold' :
                                line.type === 'error' ? 'text-yellow-400' :
                                    'text-green-400'
                            }`}>
                            {line.type === 'input' ? (
                                <span className="text-blue-400 mr-2">analyst@antiphishx:~$</span>
                            ) : null}
                            {line.text}
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <form onSubmit={handleCommand} className="mt-1 flex items-center">
                    <span className="text-blue-400 mr-2 shrink-0">analyst@antiphishx:~$</span>
                    <input
                        id="terminal-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white caret-white"
                        autoComplete="off"
                        autoFocus
                    />
                </form>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default Terminal;
