import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MediaPreview } from '../../components/ui/MediaPreview';
import { PrintSticker } from '../../components/core/PrintSticker';
import {
    MapPin, Calendar, Hash, ShieldCheck, Printer, X, FileCheck, ArrowLeft, Loader2, User,
    FileSearch,
    Shield,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useEvidence } from '../../hooks/useEvidence';

export default function EvidencePreview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activePreview, setActivePreview] = useState<{ url: string, type: string } | null>(null);
    const { updateStatus } = useEvidence();

    // Fetch specific evidence data
    const { data: evidence, isLoading } = useQuery({
        queryKey: ['evidence-preview', id],
        queryFn: async () => {
            const res = await api.get(`/evidence/${id}`);
            return res.data.data;
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Asset File...</p>
        </div>
    );

    if (!evidence) return (
        <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in fade-in zoom-in-95">
            {/* Icon Container with Amber Theme */}
            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100 shadow-inner">
                <FileSearch size={32} />
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Evidence Asset Not Found
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                    The requested evidence ID could not be located in the secure digital registry.
                </p>
            </div>

            {/* Return Button */}
            <div className="pt-2">
                <button
                    onClick={() => navigate(-1)} // Goes back to the previous Case or List
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Return to Registry
                </button>
            </div>

            {/* Optional: Subtle Help Text */}
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-black pt-4">
                Chain of Custody Error: 404_ASSET_NULL
            </p>
        </div>
    );


    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">

            {/* HEADER BAR */}
            <div className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-5">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white border rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-gray-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">{evidence.title}</h1>
                            <StatusBadge color={evidence.status} size="md" />
                        </div>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <Hash size={14} /> {evidence.evidenceId} • Case Ref: {evidence.caseId || 'Unassigned'}
                        </p>
                    </div>
                </div>
                <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                    <Printer size={16} /> Print Evidence Tag
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: NARRATIVE & MEDIA */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Collection Site</p>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">{evidence.locationFound?.address || 'Location data restricted'}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            {/* Top Section: Date */}
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm transition-transform group-hover:scale-105">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Submission Date
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {new Date(evidence.submittedDate).toLocaleString('en-GB', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Section: Unit Badge */}
                            <div className="flex items-center gap-4 group pt-2">
                                {/* High-Contrast Unit Visual */}
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-blue-600 transition-all group-hover:shadow-blue-100">
                                    <Shield size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Submitted By
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-black text-slate-900 tracking-tight uppercase">
                                            {evidence.submittedByBadge || 'N/A'}
                                        </p>
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Investigative Narrative</h3>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {evidence.description || "No narrative logged for this asset."}
                        </p>
                    </div>

                    {/* Media Files */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Digital Assets</h3>
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

                {/* RIGHT COLUMN: TAGS & INTEGRITY */}
                <div className="space-y-6">
                    {/* THE STICKER COMPONENT */}
                    <PrintSticker
                        type="EVIDENCE"
                        qrValue={evidence.evidenceId}
                        idDisplay={evidence.evidenceId}
                        title={evidence.title}
                        caseId={evidence.caseId}
                        submittedAt={new Date(evidence.submittedDate).toLocaleString()}
                        secondaryId={evidence.submittedByBadge}
                    />

                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                        <div className="flex items-center gap-3 text-green-400 mb-6 border-b border-white/10 pb-4">
                            <ShieldCheck size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Forensic Integrity</span>
                        </div>
                        <div className="space-y-6">

                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">SHA-256 Checksum</p>
                                <code className="block bg-black/40 p-4 rounded-xl text-[9px] text-blue-400/80 break-all border border-white/5 leading-relaxed">
                                    a5f2...3e91 (Simulated for Prototype)
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {evidence.status !== 'active' ? (
                            <button
                                onClick={() => updateStatus.mutate({ id: evidence._id, status: 'active', caseId: evidence.caseId })}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm group"
                            >
                                <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
                                Approve & Verify Evidence
                            </button>
                        ) : (
                            <button
                                onClick={() => updateStatus.mutate({ id: evidence._id, status: 'unassigned' })}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm group"
                            >
                                <XCircle size={18} className="transition-transform group-hover:scale-110" />

                                Revoke / Unassign Asset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* FULL SCREEN PREVIEW OVERLAY */}
            {activePreview && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-8 backdrop-blur-md" onClick={() => setActivePreview(null)}>
                    <button className="absolute top-10 right-10 text-white hover:text-red-500 transition-colors">
                        <X className="w-10 h-10" />
                    </button>
                    <div className="w-full max-w-5xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {activePreview.type === 'img' && <img src={activePreview.url} className="max-h-full rounded-2xl shadow-2xl animate-in zoom-in" />}
                        {activePreview.type === 'video' && <video src={activePreview.url} controls autoPlay className="max-h-full rounded-2xl shadow-2xl animate-in zoom-in" />}
                        {activePreview.type === 'voiceNote' && (
                            <div className="bg-white/5 p-12 rounded-3xl border border-white/10 flex flex-col items-center animate-in zoom-in">
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
