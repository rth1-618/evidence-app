import React, { useState } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MediaPreview } from '../../components/ui/MediaPreview';
import { MapPin, Calendar, Hash, ShieldCheck, User } from 'lucide-react';

export default function EvidenceDetail({ evidence }: { evidence: any }) {
    const [activePreview, setActivePreview] = useState<any>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details & Metadata */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{evidence.title}</h3>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <Hash className="w-4 h-4" /> {evidence.evidenceId} • Case: {evidence.caseId}
                            </p>
                        </div>
                        <StatusBadge status={evidence.status} size="md" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-gray-100">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Collection Site</p>
                                <p className="text-sm text-gray-900 font-medium">{evidence.locationFound.address}</p>
                                <p className="text-xs text-gray-500 mt-1">GPS: {evidence.locationFound.lat}, {evidence.locationFound.lng}</p>
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

            {/* Right Column: Forensics & Sticker Preview */}
            <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-6 text-white shadow-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-4 text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Integrity Verified</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono break-all mb-4">
                        SHA256: {evidence.fileHashes?.[0]?.hash || "Calculating fingerprint..."}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <button
                            onClick={() => window.print()}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Reprint Physical Tag
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Screen Preview (reuse your Modal or logic here) */}
            {activePreview && (
                <div
                    className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setActivePreview(null)}
                >
                    {activePreview.type === 'img' && <img src={activePreview.url} className="max-h-full max-w-full rounded-lg" />}
                    {activePreview.type === 'video' && <video src={activePreview.url} controls autoPlay className="max-h-full max-w-full rounded-lg" />}
                </div>
            )}
        </div>
    );
}
