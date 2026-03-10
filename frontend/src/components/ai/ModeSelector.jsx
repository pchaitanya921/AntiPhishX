import React from 'react';
import { ChevronDown, Beaker, Shield, GraduationCap } from 'lucide-react';

/**
 * ModeSelector Component
 * Dropdown to switch between AI modes
 */
const ModeSelector = ({ currentMode, onModeChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const modes = [
        {
            id: 'lab',
            name: 'Lab Assistant',
            icon: Beaker,
            description: 'Guided learning for labs',
            color: 'from-amber-500 to-orange-500'
        },
        {
            id: 'cyber',
            name: 'Cyber Chat',
            icon: Shield,
            description: 'Cybersecurity mentor',
            color: 'from-cyber-purple to-cyber-cyan'
        },
        {
            id: 'instructor',
            name: 'Instructor AI',
            icon: GraduationCap,
            description: 'Lab generation (Admin)',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    const currentModeData = modes.find(m => m.id === currentMode) || modes[1];
    const CurrentIcon = currentModeData.icon;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all w-full"
            >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${currentModeData.color}`}>
                    <CurrentIcon size={16} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-white">{currentModeData.name}</div>
                    <div className="text-[10px] text-white/40">{currentModeData.description}</div>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                        {modes.map((mode) => {
                            const Icon = mode.icon;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => {
                                        onModeChange(mode.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${currentMode === mode.id ? 'bg-white/10' : ''
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${mode.color}`}>
                                        <Icon size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-bold text-white">{mode.name}</div>
                                        <div className="text-[10px] text-white/40">{mode.description}</div>
                                    </div>
                                    {currentMode === mode.id && (
                                        <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModeSelector;
