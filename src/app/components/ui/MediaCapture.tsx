import React from 'react';
import { Camera, Video, Mic } from 'lucide-react';

interface MediaCaptureProps {
    onCapture: (e: React.ChangeEvent<HTMLInputElement>, category: 'img' | 'video' | 'voiceNote') => void;
    onOpenLive: (mode: 'img' | 'video' | 'voiceNote') => void;
}

export const MediaCapture = ({ onCapture, onOpenLive }: MediaCaptureProps) => {
    // Define exact Tailwind classes here so the compiler sees them
    const colorMap: Record<string, { bg: string, bgHover: string, icon: string, dot: string, ping: string, circle: string }> = {
        blue: {
            bg: 'bg-blue-100', bgHover: 'hover:bg-blue-50', icon: 'text-blue-600',
            dot: 'bg-blue-500', ping: 'bg-blue-400', circle: 'group-hover:bg-blue-200'
        },
        red: {
            bg: 'bg-red-100', bgHover: 'hover:bg-red-50', icon: 'text-red-600',
            dot: 'bg-red-500', ping: 'bg-red-400', circle: 'group-hover:bg-red-200'
        },
        green: {
            bg: 'bg-green-100', bgHover: 'hover:bg-green-50', icon: 'text-green-600',
            dot: 'bg-green-500', ping: 'bg-green-400', circle: 'group-hover:bg-green-200'
        },
    };

    const captureOptions = [
        { id: 'img', label: 'Photo', icon: Camera, color: 'blue', inputId: 'cap-img', accept: 'image/*', capture: 'environment' },
        { id: 'video', label: 'Video', icon: Video, color: 'red', inputId: 'cap-vid', accept: 'video/*', capture: 'environment' },
        { id: 'voiceNote', label: 'Audio', icon: Mic, color: 'green', inputId: 'cap-mic', accept: 'audio/*', capture: undefined },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {captureOptions.map((opt) => {
                const styles = colorMap[opt.color];
                return (
                    <div key={opt.id} className="space-y-2">
                        <button
                            type="button"
                            onClick={() => onOpenLive(opt.id as any)}
                            className={`w-full flex flex-col items-center p-4 border border-gray-200 rounded-xl transition-all group relative ${styles.bgHover}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${styles.bg} ${styles.circle}`}>
                                <opt.icon className={`w-6 h-6 ${styles.icon}`} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Live {opt.label}</span>

                            {/* Live Pulsing Dot */}
                            <span className="absolute top-3 right-3 flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.ping}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`}></span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => document.getElementById(opt.inputId)?.click()}
                            className="w-full py-1.5 text-[10px] text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50 uppercase tracking-wider font-medium"
                        >
                            Use Gallery
                        </button>

                        <input
                            id={opt.inputId}
                            type="file"
                            accept={opt.accept}
                            capture={opt.capture as any}
                            className="hidden"
                            onChange={(e) => onCapture(e, opt.id as any)}
                        />
                    </div>
                );
            })}
        </div>
    );
};
