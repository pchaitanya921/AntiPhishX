import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Play, Loader2 } from 'lucide-react';

const VideoPlayer = forwardRef(({ url, videoUrl, thumbnailUrl, cloudinaryId, onProgress, onTimeUpdate, onEnded, className = "" }, ref) => {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Expose seekTo method to parent component
    useImperativeHandle(ref, () => ({
        seekTo: (timeInSeconds) => {
            if (videoRef.current) {
                videoRef.current.currentTime = timeInSeconds;
            }
        },
        getCurrentTime: () => {
            return videoRef.current ? videoRef.current.currentTime : 0;
        },
        play: () => {
            if (videoRef.current) {
                videoRef.current.play();
            }
        },
        pause: () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }));

    // Priority 1: Use Cloudinary video if available
    const finalVideoUrl = videoUrl || url;

    if (!finalVideoUrl) {
        return (
            <div className={`relative aspect-video bg-cyber-black/80 rounded-2xl flex flex-col items-center justify-center border border-cyber-purple/20 overflow-hidden ${className}`}>
                <div className="absolute inset-0 bg-[#030014] opacity-50" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-cyber-purple/10 flex items-center justify-center border border-cyber-purple/20">
                        <Play className="w-8 h-8 text-cyber-purple animate-pulse" />
                    </div>
                    <p className="text-cyber-purple/60 font-medium tracking-wider">NEURAL STREAM STANDBY</p>
                    <p className="text-white/30 text-xs">No video URL provided</p>
                </div>
            </div>
        );
    }

    const handleLoadedMetadata = () => {
        setIsLoading(false);
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            const currentTime = video.currentTime;

            // Call onTimeUpdate for transcript sync
            if (onTimeUpdate) {
                onTimeUpdate(currentTime);
            }

            // Call onProgress for legacy support
            if (onProgress) {
                onProgress({
                    played: currentTime / video.duration,
                    playedSeconds: currentTime,
                    loaded: video.buffered.length > 0 ? video.buffered.end(0) / video.duration : 0,
                    loadedSeconds: video.buffered.length > 0 ? video.buffered.end(0) : 0
                });
            }
        }
    };

    const handleEnded = () => {
        if (onEnded) onEnded();
    };

    const handleError = (e) => {
        console.error('Video error:', e);
        setIsLoading(false);
    };

    return (
        <div className={`relative aspect-video bg-black rounded-2xl border border-cyber-purple/20 overflow-hidden shadow-2xl ${className}`}>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-12 h-12 text-cyber-purple animate-spin" />
                        <span className="text-sm font-medium tracking-widest text-cyber-purple">ESTABLISHING UPLINK...</span>
                    </div>
                </div>
            )}

            {/* Simple HTML5 Video Player */}
            <video
                ref={videoRef}
                controls
                preload="metadata"
                controlsList="nodownload"
                poster={thumbnailUrl}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={handleError}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                className="w-full h-full"
                style={{
                    maxHeight: '500px',
                    borderRadius: '12px'
                }}
            >
                <source src={finalVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
