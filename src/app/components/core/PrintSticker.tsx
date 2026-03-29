import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';

interface PrintStickerProps {
    qrValue: string;
    idDisplay: string;
    title: string;
    caseId?: string;
    secondaryId?: string;
    status?: string;
    showInComponent?: boolean;
    submittedAt?: string;
    type: 'EVIDENCE' | 'STORAGE';
}

export const PrintSticker = ({
    qrValue,
    idDisplay,
    title,
    caseId,
    secondaryId,
    status,
    submittedAt,
    showInComponent = false,
    type
}: PrintStickerProps) => {
    const isEvidence = () => type === 'EVIDENCE';
    return (
        <>
            {
                <style>
                    {`
                        @media print {
                            @page {
                                size: 4in 7in;
                                margin: 0 !important;
                            }

                            /* 1. Hide everything else on the page */
                            body > * {
                                visibility: hidden !important;
                            }

                            /* 2. Isolate and show ONLY the sticker */
                            .print-sticker-container,
                            .print-sticker-container * {
                                visibility: visible !important;
                            }

                            .print-sticker-container {
                                position: fixed !important;
                                top: 0 !important;
                                left: 0 !important;
                                width: 4in !important;
                                height: 7in !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                background: white !important; /* Covers background ghosts */
                                z-index: 99999;


                            }

                            .print-sticker {
                                width: 4in !important;
                                height: 7in !important;
                                margin: 0 !important;
                                padding: 1.5rem !important;
                                box-sizing: border-box !important;
                                border: 4px solid black !important;
                                display: flex !important;
                                flex-direction: column !important;
                                page-break-after: avoid !important;
                            }

                            /* Fix for potential second blank page */
                            html, body {
                                height: 7in !important;
                                overflow: hidden !important;
                            }
                        }
                        `}
                </style>
            }




            <div className={`${showInComponent ? "" : "hidden"} print:block print-sticker-container max-w-2xl mx-auto`}>
                <div className="mx-auto print:block bg-white border-[4px] border-black p-6 w-full print-sticker max-w-md print:max-w-[4in] print:h-[6in] flex flex-col text-left">

                    {/* Header */}
                    <div className="border-b-[3px] border-black pb-4 mb-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                                {isEvidence() ? 'Evidence' : 'Storage Tag'}
                            </h1>
                            <p className="text-[10px] font-bold uppercase text-gray-600">Property & Evidence Division</p>
                        </div>
                        <ShieldCheck className="w-10 h-10 text-black" />
                    </div>

                    {/* QR Section */}
                    <div className="flex flex-col items-center justify-center mb-6 py-4 border-b-2 border-black border-dashed">
                        <div className="bg-white p-2 border border-gray-200 mb-2">
                            <QRCodeSVG value={qrValue} size={180} level='H' marginSize={1} />
                        </div>
                        <p className="text-3xl font-mono font-black tracking-widest uppercase">{idDisplay}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500">
                                {isEvidence() ? 'Evidence Title' : 'Location Section'}
                            </label>
                            <p className="text-lg font-bold border-b border-black pb-1 leading-tight">{title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-500">
                                    {isEvidence() ? 'Officer Badge #' : 'Total Capacity'}
                                </label>
                                <p className="text-lg font-bold border-b border-black pb-1 uppercase">
                                    {secondaryId || 'N/A'} {type === 'STORAGE' ? 'Units' : ''}
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-500">
                                    {isEvidence() ? 'Case ID' : 'Current Status'}
                                </label>
                                <p className="text-lg font-bold border-b border-black pb-1 uppercase">{caseId || status}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500">
                                {isEvidence() && submittedAt ? 'Submission Time' : 'Timestamp'}

                            </label>
                            <p className="text-sm font-bold border-b border-black pb-1">{isEvidence() && submittedAt ? submittedAt : new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Original Footer Design */}
                    <div className="mt-auto pt-4 text-center">
                        <p className="text-[9px] font-black uppercase border-2 border-black p-1">
                            {isEvidence()
                                ? 'Warning: Tampering is a criminal offence'
                                : 'Note: Scan to assign items to this shelf'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
