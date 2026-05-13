import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';

/**
 * MessageBubble Component
 * Displays user/assistant messages with markdown support
 */
const MessageBubble = ({ message, isUser }) => {
    const [copied, setCopied] = React.useState(false);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUser
                        ? 'bg-gradient-to-br from-cyber-purple to-cyber-cyan'
                        : 'bg-white/10 border border-white/20'
                    }`}
            >
                {isUser ? (
                    <User size={16} className="text-white" />
                ) : (
                    <Bot size={16} className="text-cyber-cyan" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                <div
                    className={`inline-block max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                            ? 'bg-gradient-to-br from-cyber-purple to-cyber-cyan text-white'
                            : 'bg-white/5 border border-white/10 text-white/90'
                        }`}
                >
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="relative group">
                                                <button
                                                    onClick={() => copyCode(String(children))}
                                                    className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    {copied ? (
                                                        <Check size={14} className="text-green-400" />
                                                    ) : (
                                                        <Copy size={14} className="text-white/60" />
                                                    )}
                                                </button>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="!bg-black/40 !mt-2 !mb-2 rounded-lg"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code
                                                className="bg-white/10 px-1.5 py-0.5 rounded text-cyber-cyan"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className="mt-1 px-1">
                    <span className="text-[10px] text-white/40">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;

