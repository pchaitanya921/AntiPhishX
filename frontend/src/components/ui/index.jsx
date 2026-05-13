import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import LockedFeature from './LockedFeature';

export { VideoPlayer, LockedFeature };

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    ...props
}) => {
    const baseStyles = 'font-black rounded-full transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]';

    const variants = {
        primary: 'bg-emerald-500 text-black hover:bg-white shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95',
        secondary: 'bg-white/[0.05] text-white border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95',
        lime: 'bg-lime-400 text-black hover:bg-white shadow-[0_0_30px_rgba(163,230,53,0.25)] active:scale-95',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95',
        ghost: 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 active:scale-95',
        outline: 'bg-transparent border border-white/10 text-white hover:border-emerald-500/50 hover:text-emerald-400 active:scale-95'
    };

    const sizes = {
        sm: 'px-5 py-2.5',
        md: 'px-8 py-3.5',
        lg: 'px-10 py-4.5 text-[11px]',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
                children
            )}
        </motion.button>
    );
};

export const Card = ({ children, className = '', glass = true, hover = false, ...props }) => {
    const baseStyles = 'rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden';
    const glassStyles = glass
        ? 'bg-[#111111] border-white/5'
        : 'bg-[#0A0A0A] border-white/5';

    const hoverStyles = hover ? 'hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-pointer group' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
            {...props}
        >
            {hover && (
                <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            )}
            {children}
        </motion.div>
    );
};

export const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
    return (
        <div className="space-y-3 w-full">
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-6">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-emerald-400 transition-colors">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    className={`
                        w-full h-16 px-6 rounded-2xl
                        bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/5'}
                        text-white placeholder-white/10
                        focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.04]
                        transition-all duration-500
                        ${Icon ? 'pl-16' : ''}
                        shadow-2xl font-medium
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-6"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export const Badge = ({ children, variant = 'default', className = "" }) => {
    const variants = {
        default: 'bg-white/5 text-white/40 border-white/10',
        primary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        lime: 'bg-lime-400/10 text-lime-400 border-lime-400/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
    };

    return (
        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export const Spinner = ({ className = "" }) => (
    <div className={`w-10 h-10 border-[3px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin ${className}`} />
);

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ label, options, value, onChange, name, placeholder = "Select sequence...", className = "" }) => {
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
        const event = { target: { name: name, value: optionValue } };
        onChange(event);
        setIsOpen(false);
    };

    return (
        <div className={`space-y-3 ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-6">
                    {label}
                </label>
            )}
            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full h-16 px-6 rounded-2xl cursor-pointer
                        bg-white/[0.03] border border-white/5
                        text-white flex items-center justify-between
                        transition-all duration-500
                        hover:bg-white/[0.04] hover:border-emerald-500/20
                        ${isOpen ? 'border-emerald-500/40 bg-white/[0.06]' : ''}
                    `}
                >
                    <span className={`text-sm font-medium ${selectedOption ? 'text-white' : 'text-white/20'}`}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-white/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
                    />
                </motion.div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute z-[100] w-full mt-3 overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-[#0A0A0A]"
                        >
                            <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-3 space-y-1">
                                {options.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        className={`
                                            px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all
                                            flex items-center justify-between group
                                            ${option.id === value
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'text-white/40 hover:bg-white/5 hover:text-white'
                                            }
                                        `}
                                    >
                                        {option.name}
                                        {option.id === value && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
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

