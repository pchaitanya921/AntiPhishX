import React from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';

/**
 * ChatInput Component
 * Message input with send button
 */
const ChatInput = ({ onSend, isLoading, disabled }) => {
    const [message, setMessage] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        onSend(message);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#0d1117]">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end gap-3">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={disabled ? "Select a mode to start chatting..." : "Ask anything about cybersecurity..."}
                        disabled={disabled || isLoading}
                        rows={1}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
                        style={{
                            minHeight: '48px',
                            height: 'auto'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading || disabled}
                        className="p-3 rounded-xl bg-gradient-to-br from-cyber-purple to-cyber-cyan text-white hover:shadow-lg hover:shadow-cyber-cyan/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>

                {/* Hint */}
                <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
                    <AlertCircle size={12} />
                    <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;

