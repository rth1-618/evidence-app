import React, { useState } from 'react';
import { QrCode, CheckCircle, Scan } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { mockEvidence } from '../../utils/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function ScanAndStore() {
  const [evidenceQR, setEvidenceQR] = useState('');
  const [shelfQR, setShelfQR] = useState('');
  const [isScanning, setIsScanning] = useState<'evidence' | 'shelf' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleScanEvidence = () => {
    setIsScanning('evidence');
    // Simulate QR scan - in real app would use camera
    setTimeout(() => {
      setEvidenceQR('EV-001');
      setIsScanning(null);
      toast.success('Evidence QR scanned successfully');
    }, 1000);
  };

  const handleScanShelf = () => {
    setIsScanning('shelf');
    // Simulate QR scan
    setTimeout(() => {
      setShelfQR('SHELF-A-12');
      setIsScanning(null);
      toast.success('Shelf QR scanned successfully');
    }, 1000);
  };

  const handleConfirmStorage = () => {
    toast.success(`Evidence ${evidenceQR} stored at ${shelfQR}`);
    setEvidenceQR('');
    setShelfQR('');
  };

  const handleReset = () => {
    setEvidenceQR('');
    setShelfQR('');
  };

  const scannedEvidence = mockEvidence.find(e => e.id === evidenceQR);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Scan & Store Evidence</h2>
        <p className="text-gray-600 mt-1">Scan evidence and shelf QR codes to record storage location</p>
      </div>

      {/* Scanning Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan Evidence QR */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Step 1: Scan Evidence</h3>
              <p className="text-sm text-gray-600">Scan the evidence QR code</p>
            </div>
          </div>

          {!evidenceQR ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <button
                onClick={handleScanEvidence}
                disabled={isScanning === 'evidence'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                <Scan className="w-5 h-5" />
                {isScanning === 'evidence' ? 'Scanning...' : 'Scan Evidence QR'}
              </button>
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Evidence Scanned</span>
              </div>
              {scannedEvidence && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Evidence ID:</span>
                    <span className="ml-2 font-medium text-gray-900">{scannedEvidence.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <span className="ml-2 text-gray-900">{scannedEvidence.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{scannedEvidence.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Case:</span>
                    <span className="ml-2 text-gray-900">{scannedEvidence.caseId}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scan Shelf QR */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Step 2: Scan Shelf</h3>
              <p className="text-sm text-gray-600">Scan the storage shelf QR code</p>
            </div>
          </div>

          {!shelfQR ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <button
                onClick={handleScanShelf}
                disabled={!evidenceQR || isScanning === 'shelf'}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <Scan className="w-5 h-5" />
                {isScanning === 'shelf' ? 'Scanning...' : 'Scan Shelf QR'}
              </button>
              {!evidenceQR && (
                <p className="text-xs text-gray-500 mt-3">Scan evidence first</p>
              )}
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Shelf Scanned</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Shelf ID:</span>
                  <span className="ml-2 font-medium text-gray-900">{shelfQR}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 text-gray-900">Evidence Storage - Section A</span>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <span className="ml-2 text-gray-900">Available</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview and Confirm */}
      {evidenceQR && shelfQR && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Preview</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-3">Evidence Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evidence ID:</span>
                    <span className="font-medium text-gray-900">{evidenceQR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Location:</span>
                    <span className="font-medium text-gray-900">{shelfQR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <QRCodeSVG value={`${evidenceQR}@${shelfQR}`} size={100} />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Storage
            </button>
          </div>
        </div>
      )}

      {/* Sample Shelf QR Codes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Shelf QR Codes</h3>
        <p className="text-sm text-gray-600 mb-4">Use these for testing the scanning process</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['SHELF-A-12', 'SHELF-B-05', 'SHELF-C-08', 'SHELF-D-15'].map((shelf) => (
            <div key={shelf} className="text-center p-4 border border-gray-200 rounded-lg">
              <QRCodeSVG value={shelf} size={80} className="mx-auto mb-2" />
              <p className="text-xs text-gray-600">{shelf}</p>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmStorage}
        title="Confirm Evidence Storage"
        message={`Are you sure you want to store ${evidenceQR} at ${shelfQR}? This action will be recorded in the custody log.`}
        confirmText="Confirm Storage"
      />
    </div>
  );
}
