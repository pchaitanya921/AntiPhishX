import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';

export { VideoPlayer };

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    ...props
}) => {
    const baseStyles = 'font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-tight';

    const variants = {
        primary: 'bg-cyber-purple text-white hover:bg-cyber-purple/80 shadow-cyber-glow cyber-button-glow',
        secondary: 'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
        cyan: 'bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/80 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        ghost: 'bg-transparent text-cyber-gray hover:bg-white/5 hover:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </motion.button>
    );
};

export const Card = ({ children, className = '', glass = true, hover = false, ...props }) => {
    const baseStyles = 'rounded-2xl border transition-all duration-300';
    const glassStyles = glass
        ? 'glass-panel'
        : 'bg-cyber-dark border-white/5';

    const hoverStyles = hover ? 'hover:border-cyber-purple/40 hover:shadow-cyber-glow cursor-pointer' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const Input = ({ label, error, icon: Icon, ...props }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-gray group-focus-within:text-cyber-purple transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
            w-full px-5 py-3 rounded-xl
            bg-cyber-black border ${error ? 'border-red-500' : 'border-white/10'}
            text-white placeholder-white/20
            focus:outline-none focus:ring-2 focus:ring-cyber-purple/40 focus:border-cyber-purple/50
            transition-all duration-300
            ${Icon ? 'pl-12' : ''}
            shadow-inner
          `}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-medium text-red-400 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export const Badge = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-white/5 text-cyber-gray border-white/10',
        primary: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]',
        cyan: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
        success: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    };

    return (
        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${variants[variant]}`}>
            {children}
        </span>
    );
};

export const Spinner = ({ className = "" }) => (
    <div className={`w-10 h-10 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin ${className}`} />
);

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ label, options, value, onChange, name, placeholder = "Select option...", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        // Mimic standard event for compatibility
        const event = {
            target: {
                name: name,
                value: optionValue
            }
        };
        onChange(event);
        setIsOpen(false);
    };

    return (
        <div className={`space-y-2 ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-widest text-cyber-gray ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full px-5 py-3 rounded-xl cursor-pointer
                        bg-white/[0.03] border border-white/10 backdrop-blur-md
                        text-white flex items-center justify-between
                        transition-all duration-300
                        hover:bg-white/[0.05] hover:border-white/20
                        ${isOpen ? 'ring-2 ring-cyber-cyan/40 border-cyber-cyan/50' : ''}
                    `}
                >
                    <span className={selectedOption ? 'text-white' : 'text-white/40'}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-cyber-gray transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </motion.div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 w-full mt-2 overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-cyber-black/90"
                        >
                            <div className="max-h-[240px] overflow-y-auto custom-scrollbar py-1">
                                {options.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        className={`
                                            px-5 py-3 text-sm cursor-pointer transition-colors
                                            flex items-center justify-between
                                            ${option.id === value
                                                ? 'bg-cyber-cyan/10 text-cyber-cyan font-bold'
                                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                                            }
                                        `}
                                    >
                                        {option.name}
                                        {option.id === value && (
                                            <motion.div
                                                layoutId="active-check"
                                                className="w-1.5 h-1.5 rounded-full bg-cyber-cyan"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

