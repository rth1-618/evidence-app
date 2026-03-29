import React, { useState } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MediaPreview } from '../../components/ui/MediaPreview';
import { MapPin, Calendar, Hash, ShieldCheck, Printer, X, FileCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PrintSticker } from '../../components/core/PrintSticker';

export default function EvidenceDetail({ evidence }: { evidence: any }) {
    const [activePreview, setActivePreview] = useState<any>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

            {/* THE UNIFIED TAG */}
            <PrintSticker
                type="EVIDENCE"
                qrValue={evidence.evidenceId}
                idDisplay={evidence.evidenceId}
                title={evidence.title}
                caseId={evidence.caseId}
                submittedAt={new Date(evidence.submittedDate).toLocaleString()}
                secondaryId={evidence.submittedByBadge}
            />

            {/* --- PAGE UI --- */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{evidence.title}</h3>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <Hash className="w-4 h-4" /> {evidence.evidenceId} • Case: {evidence.caseId}
                            </p>
                        </div>
                        <StatusBadge color={evidence.status} size="md" />
                    </div>

                    {/* Location & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-gray-100">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Collection Site</p>
                                <p className="text-sm text-gray-900 font-medium">{evidence.locationFound?.address || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Submission Date</p>
                                <p className="text-sm text-gray-900 font-medium">{new Date(evidence.submittedDate).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Description</h4>
                        <p className="text-gray-700 leading-relaxed">{evidence.description || "No description provided."}</p>
                    </div>
                </div>

                {/* Media Gallery */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Media Files</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {evidence.img?.map((url: string, i: number) => (
                            <MediaPreview key={i} src={url} type="img" onView={() => setActivePreview({ url, type: 'img' })} />
                        ))}
                        {evidence.video?.map((url: string, i: number) => (
                            <MediaPreview key={i} src={url} type="video" onView={() => setActivePreview({ url, type: 'video' })} />
                        ))}
                        {evidence.voiceNote?.map((url: string, i: number) => (
                            <MediaPreview key={i} src={url} type="voiceNote" onView={() => setActivePreview({ url, type: 'voiceNote' })} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Forensics */}
            <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-6 text-white shadow-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-4 text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Integrity Secured</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Primary SHA256 Fingerprint</p>
                            <div className="bg-black/50 p-3 rounded border border-white/10">
                                <code className="text-[10px] text-blue-400 break-all leading-tight">
                                    To be implemented in next Version
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={() => window.print()}
                            className="w-full py-4 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> Reprint Bag Tag
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. FULL SCREEN PREVIEW - FIXED Z-INDEX & SIDEBAR OVERLAY */}
            {activePreview && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-8 backdrop-blur-md"
                    onClick={() => setActivePreview(null)}
                >
                    {/* Close Button for Mobile Accessibility */}
                    <button className="absolute top-10 right-10 text-white hover:text-red-500 transition-colors">
                        <X className="w-10 h-10" />
                    </button>

                    <div className="w-full max-w-5xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {activePreview.type === 'img' && (
                            <img src={activePreview.url} className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain animate-in zoom-in duration-300" />
                        )}
                        {activePreview.type === 'video' && (
                            <video src={activePreview.url} controls autoPlay className="max-h-full max-w-full rounded-2xl shadow-2xl animate-in zoom-in duration-300" />
                        )}
                        {activePreview.type === 'voiceNote' && (
                            <div className="bg-white/5 p-12 rounded-3xl border border-white/10 flex flex-col items-center animate-in zoom-in duration-300">
                                <FileCheck className="w-20 h-20 text-blue-500 mb-6" />
                                <audio src={activePreview.url} controls autoPlay className="w-80" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
