import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

export default function AchievementNotification({ achievement, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Entrance animation
        setTimeout(() => setIsVisible(true), 100);

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    };

    if (!achievement) return null;

    return (
        <div
            className={`fixed top-24 right-8 z-50 transition-all duration-300 ${isVisible && !isLeaving
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                }`}
        >
            <div className="bg-gradient-to-br from-purple-900/95 to-cyber-black/95  border-2 border-cyber-cyan rounded-xl p-6 shadow-2xl min-w-[320px] relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-purple-500/10 animate-pulse" />

                {/* Sparkle Effect */}
                <div className="absolute top-2 right-2 text-yellow-400 animate-bounce">
                    <Sparkles size={20} />
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="text-cyber-cyan" size={24} />
                        <h3 className="text-lg font-black italic text-white uppercase tracking-wide">
                            Achievement Unlocked!
                        </h3>
                    </div>

                    {/* Achievement Display */}
                    <div className="flex items-center gap-4">
                        <AchievementBadge
                            achievement={achievement}
                            unlocked={true}
                            size="md"
                        />
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-1">
                                {achievement.name}
                            </h4>
                            <p className="text-sm text-white/70 mb-2">
                                {achievement.description}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-cyber-cyan font-bold text-lg">
                                    +{achievement.points} points
                                </span>
                                <span className="text-xs text-white/40 uppercase px-2 py-0.5 bg-white/10 rounded">
                                    {achievement.rarity}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (auto-dismiss indicator) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                        className="h-full bg-cyber-cyan animate-[shrink_5s_linear]"
                        style={{
                            animation: 'shrink 5s linear forwards'
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
}

