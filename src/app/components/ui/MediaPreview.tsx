import React, { useRef, useState } from 'react';
import { Play, Music, X, Eye, Pause, Trash2 } from 'lucide-react';

interface MediaPreviewProps {
    src: string | File;
    type?: 'img' | 'video' | 'voiceNote' | 'document';
    onRemove?: () => void;
    onView?: () => void;
    showDetails?: boolean;
}

export const MediaPreview = ({ src, type, onRemove, onView, showDetails = true }: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const url = React.useMemo(() => {
        if (typeof src === 'string') return src;
        return URL.createObjectURL(src);
    }, [src]);

    const fileName = typeof src === 'string' ? src.split('/').pop() : src.name;
    const fileSize = typeof src === 'string' ? null : (src.size / 1024 / 1024).toFixed(2) + ' MB';

    const category = type || (typeof src !== 'string' ?
        (src.type.startsWith('image') ? 'img' : src.type.startsWith('video') ? 'video' : 'voiceNote') : 'img');

    const handleVideoToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play().catch(err => console.error("Playback failed:", err));
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Media Display Area */}
            <div className="aspect-video bg-gray-900 flex items-center justify-center overflow-hidden relative">
                {category === 'img' && (
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                )}

                {category === 'video' && (
                    <div className="relative w-full h-full cursor-pointer" onClick={handleVideoToggle}>
                        <video ref={videoRef} src={url} className="w-full h-full object-cover" loop muted playsInline />
                        {!isPlaying && (
                            /* pointer-events-none is the fix to let click reach the parent div */
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                <Play className="w-10 h-10 text-white fill-white/20" />
                            </div>
                        )}
                    </div>
                )}

                {category === 'voiceNote' && (
                    <div className="flex flex-col items-center text-blue-400">
                        <Music className="w-10 h-10 mb-2" />
                        <audio src={url} controls className="h-8 scale-75 opacity-80" />
                    </div>
                )}

                {/* Top-Right Remove Button - Kept exactly as you had it */}
                {onRemove && (
                    <button type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="absolute top-2 right-2 z-30 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* View Overlay - Kept exactly as you had it */}
                {onView && (
                    <button type="button"
                        onClick={(e) => { e.stopPropagation(); onView(); }}
                        className="absolute top-2 left-2 z-30 p-1.5 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Details Footer - Kept exactly as you had it */}
            {showDetails && (
                <div className="p-3 border-t border-gray-100 bg-white">
                    <p className="text-xs font-semibold text-gray-900 truncate" title={fileName}>
                        {fileName}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded uppercase ${category === 'video' ? 'bg-red-100 text-red-600' :
                            category === 'img' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                            {category}
                        </span>
                        {fileSize && <p className="text-[10px] text-gray-400 font-medium">{fileSize}</p>}
                    </div>

                </div>
            )}
        </div>
    );
};
