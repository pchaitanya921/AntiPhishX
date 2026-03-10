import React from 'react';
import { Trophy, Target, Zap, Star, Lock } from 'lucide-react';

const ICON_MAP = {
    trophy: Trophy,
    target: Target,
    zap: Zap,
    star: Star
};

const RARITY_COLORS = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
};

export default function AchievementBadge({ achievement, unlocked, progress, size = 'md' }) {
    const Icon = ICON_MAP[achievement.icon] || Trophy;
    const rarityGradient = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;

    const sizes = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const iconSizes = {
        sm: 24,
        md: 32,
        lg: 48
    };

    const progressPercentage = progress
        ? Math.min(100, Math.round((progress.current / progress.required) * 100))
        : 0;

    return (
        <div className="flex flex-col items-center gap-2 group">
            {/* Badge Container */}
            <div className="relative">
                {/* Badge Circle */}
                <div
                    className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${unlocked
                            ? `bg-gradient-to-br ${rarityGradient} shadow-lg group-hover:scale-110`
                            : 'bg-white/5 border-2 border-white/10 grayscale opacity-50'
                        }`}
                >
                    {unlocked ? (
                        <Icon size={iconSizes[size]} className="text-white" />
                    ) : (
                        <Lock size={iconSizes[size]} className="text-white/40" />
                    )}
                </div>

                {/* Progress Ring (for locked achievements) */}
                {!unlocked && progress && progress.required > 1 && (
                    <svg
                        className="absolute top-0 left-0 w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#progress-gradient)"
                            strokeWidth="4"
                            strokeDasharray={`${progressPercentage * 2.827} 282.7`}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00d4ff" />
                                <stop offset="100%" stopColor="#7b2ff7" />
                            </linearGradient>
                        </defs>
                    </svg>
                )}

                {/* Points Badge */}
                {unlocked && (
                    <div className="absolute -bottom-1 -right-1 bg-cyber-cyan text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        +{achievement.points}
                    </div>
                )}
            </div>

            {/* Achievement Info */}
            <div className="text-center max-w-[120px]">
                <h4 className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-white/40'}`}>
                    {achievement.name}
                </h4>
                <p className="text-xs text-white/40 line-clamp-2">{achievement.description}</p>

                {/* Progress Text */}
                {!unlocked && progress && progress.required > 1 && (
                    <p className="text-xs text-cyber-cyan mt-1">
                        {progress.current}/{progress.required}
                    </p>
                )}
            </div>
        </div>
    );
}
