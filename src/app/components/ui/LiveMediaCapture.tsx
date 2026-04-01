import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Mic, StopCircle, RefreshCcw, PlayCircle, CircleX, Circle, Dot, Trash2, Check } from 'lucide-react';

interface LiveMediaProps {
    mode: 'img' | 'video' | 'voiceNote';
    onCapture: (file: File) => void;
    onClose: () => void;
}

export const LiveMediaCapture = ({ mode, onCapture, onClose }: LiveMediaProps) => {
    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [previewFile, setPreviewFile] = useState<File | null>(null); // [NEW] Holds the file for review
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // [NEW] For the UI display

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null); // Use Ref for reliable cleanup
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Function to kill the current stream completely
    const stopExistingStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                // console.log(`Track ${track.kind} stopped`);
            });
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        const startStream = async () => {

            if (previewUrl) return;

            stopExistingStream(); // Step 1: Kill the old one

            // Small delay to let the camera hardware "release"
            await new Promise(resolve => setTimeout(resolve, 150));

            try {
                const constraints = {
                    video: (mode === 'img' || mode === 'video')
                        ? { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }
                        : false,
                    audio: true
                };

                const newStream = await navigator.mediaDevices.getUserMedia(constraints);

                if (isMounted) {
                    streamRef.current = newStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = newStream;
                        // Force play to prevent black screen freeze
                        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
                    }
                }
            } catch (err) {
                console.error("Camera Access Error:", err);
            }
        };

        startStream();

        return () => {
            isMounted = false;
            stopExistingStream();
        };
    }, [mode, facingMode, previewUrl]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (recording) {
            setSeconds(0); // Reset timer on start
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [recording]);

    const toggleCamera = () => {
        if (recording) return;
        setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    };


    const handleCaptured = (file: File) => {
        const url = URL.createObjectURL(file);
        // console.log('url:', url);

        setPreviewFile(file);
        setPreviewUrl(url);
        stopExistingStream(); // Stop camera while reviewing
    };

    const confirmCapture = () => {
        if (previewFile) {
            onCapture(previewFile);
            onClose();
        }
    };

    const retake = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewFile(null);
        setPreviewUrl(null);
        // useEffect will trigger camera restart because streamRef.current is now null
    };


    const takePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            if (facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(videoRef.current, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    handleCaptured(file); // Review first
                }
            }, 'image/jpeg', 0.9); // 0.9 quality
        }
    };

    const startRecording = () => {
        if (!streamRef.current) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mode === 'video' ? 'video/mp4' : 'audio/wav' });
            const ext = mode === 'video' ? 'mp4' : 'wav';
            const file = new File([blob], `recorded_${Date.now()}.${ext}`, { type: blob.type });
            onCapture(file);
            onClose();
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mode === 'video' ? 'video/mp4' : 'audio/wav' });
                const file = new File([blob], `recorded_${Date.now()}.${mode === 'video' ? 'mp4' : 'wav'}`, { type: blob.type });
                handleCaptured(file); // Review first
            };
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };



    return (
        <div className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center p-4">
            {previewUrl ? (
                <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-widest">Review Evidence</h2>

                    <div className="relative w-full aspect-[9/16] md:aspect-video bg-gray-900 rounded-3xl overflow-hidden border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        {mode === 'img' && <img src={previewUrl} className="w-full h-full object-cover" />}
                        {mode === 'video' && <video src={previewUrl} controls className="w-full h-full object-cover" />}
                        {mode === 'voiceNote' && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/20">
                                <Mic className="w-20 h-20 text-blue-500 mb-4" />
                                <audio src={previewUrl} controls className="w-3/4" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 mt-8 w-full">
                        <button type="button" onClick={retake} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 transition-colors">
                            <Trash2 className="w-5 h-5" /> Retake
                        </button>
                        <button type="button" onClick={confirmCapture} className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">
                            <Check className="w-5 h-5" /> Add to List
                        </button>
                    </div>
                </div>
            ) : (

                <>
                    {(mode === 'img' || mode === 'video') && (
                        <div className={`relative overflow-hidden border-2 border-white/10 shadow-2xl transition-all duration-300
        /* Mobile: Portrait */
        w-full max-w-[320px] aspect-[9/16] rounded-[40px] 
        /* Desktop: Landscape */
        md:max-w-2xl md:aspect-video md:rounded-3xl bg-gray-900`}
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                // object-cover ensures the video fills the container regardless of ratio
                                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                            />

                            {/* Recording Indicator */}
                            {recording && (
                                <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full z-10">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                    <span className="text-white text-[10px] font-black tracking-widest">REC</span>
                                </div>
                            )}
                        </div>
                    )}


                    {(mode === 'video' || mode === 'voiceNote') && recording && (
                        <div className="absolute top-10 flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-white font-mono text-2xl tracking-widest">
                                {formatTime(seconds)}
                            </span>
                        </div>
                    )}

                    {mode === 'voiceNote' && (
                        <div className="w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                            <Mic className={`w-20 h-20 text-white ${recording ? 'animate-bounce' : ''}`} />
                        </div>
                    )}
                    {/* CONTROLS */}
                    <div className="flex gap-10 items-center mt-12 bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20">
                        <button type="button" onClick={onClose} className="p-4 bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                            <CircleX className="w-8 h-8" />
                        </button>

                        {mode === 'img' && (
                            <button type="button" onClick={takePhoto} className="w-24 h-24 bg-white rounded-full border-[6px] border-blue-500 shadow-xl active:scale-90 transition-transform" />
                        )}

                        {/* Massive Record Button (with inner red dot) */}
                        {(mode === 'video' || mode === 'voiceNote') && !recording && (
                            <button type="button"
                                onClick={startRecording}
                                className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                            >
                                <div className="w-20 h-20 bg-red-600 rounded-full" />
                            </button>
                        )}

                        {/* Recording Stop Button (pulsing square) */}
                        {recording && (
                            <button type="button"
                                onClick={stopRecording}
                                className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl animate-pulse"
                            >
                                <div className="w-10 h-10 bg-red-600 rounded-sm" />
                            </button>
                        )}

                        {(mode === 'img' || mode === 'video') && (
                            <button type="button" disabled={recording} onClick={toggleCamera} className={`p-4 bg-white/5 rounded-full text-white transition-colors ${recording ? 'opacity-20' : 'hover:bg-white/10'}`}>
                                <RefreshCcw className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                </>
            )}


        </div>
    );
};
