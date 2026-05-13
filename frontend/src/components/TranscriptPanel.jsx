import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

/**
 * Immersive-style Transcript Panel Component
 * Features:
 * - Timestamped segments
 * - Auto-highlight current segment
 * - Auto-scroll to active segment
 * - Click to seek video
 */
const TranscriptPanel = ({ segments = [], content = '', currentTime = 0, onSegmentClick, className = '' }) => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const segmentRefs = useRef([]);

    // Find active segment based on current video time
    useEffect(() => {
        if (!segments || segments.length === 0) return;

        const index = segments.findIndex((seg, idx) => {
            const nextSeg = segments[idx + 1];
            return currentTime >= seg.start && (!nextSeg || currentTime < nextSeg.start);
        });

        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    }, [currentTime, segments]);

    // Auto-scroll to active segment
    useEffect(() => {
        if (activeIndex >= 0 && segmentRefs.current[activeIndex]) {
            segmentRefs.current[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }, [activeIndex]);

    // Format seconds to MM:SS or H:MM:SS
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if ((!segments || segments.length === 0) && !content) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 text-white/20 ${className}`}>
                <Clock size={48} className="mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No Transcript Available</p>
            </div>
        );
    }

    if ((!segments || segments.length === 0) && content) {
        return (
            <div className={`p-4 text-white/80 text-sm leading-relaxed whitespace-pre-wrap ${className}`}>
                {content}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar ${className}`}
        >
            {segments.map((segment, index) => {
                const isActive = index === activeIndex;

                return (
                    <div
                        key={index}
                        ref={el => segmentRefs.current[index] = el}
                        onClick={() => onSegmentClick && onSegmentClick(segment.start)}
                        className={`
                            group flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                            ${isActive
                                ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/10'
                                : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                            }
                        `}
                    >
                        {/* Timestamp */}
                        <div className="flex-shrink-0">
                            <div
                                className={`
                                    px-2 py-1 rounded-lg text-xs font-bold transition-all
                                    ${isActive
                                        ? 'bg-cyber-cyan text-cyber-black'
                                        : 'bg-white/5 text-white/40 group-hover:bg-cyber-cyan/20 group-hover:text-cyber-cyan'
                                    }
                                `}
                            >
                                {formatTime(segment.start)}
                            </div>
                        </div>

                        {/* Transcript Text */}
                        <div className="flex-1">
                            <p
                                className={`
                                    text-sm leading-relaxed transition-colors
                                    ${isActive
                                        ? 'text-white font-medium'
                                        : 'text-white/70 group-hover:text-white/90'
                                    }
                                `}
                            >
                                {segment.text}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptPanel;

