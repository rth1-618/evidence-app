import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Scan, XCircle, Loader2, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEvidence } from '../../hooks/useEvidence';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function ScanAndStore() {
  const { linkStorage, getEvidenceDetails, isLinking, getShelfById } = useEvidence();

  // Scanned Raw Data
  const [evidenceQR, setEvidenceQR] = useState(''); // Stores evidenceId (EV-XXXX)
  const [shelfQR, setShelfQR] = useState('');       // Stores shelf _id (ObjectID)

  // Display Objects (Fetched from DB)
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [shelfData, setShelfData] = useState<any>(null);

  const [isScanning, setIsScanning] = useState<'evidence' | 'shelf' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Scanner Logic
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(async (decodedText) => {
        if (isScanning === 'evidence') {
          await handleEvidenceScanned(decodedText);
        } else {
          await handleShelfScanned(decodedText);
        }
        scanner?.clear();
        setIsScanning(null);
      }, (err) => { });
    }

    return () => {
      if (scanner) scanner.clear().catch(e => console.error(e));
    };
  }, [isScanning]);

  const handleEvidenceScanned = async (id: string) => {
    try {
      const data = await getEvidenceDetails(id);
      setEvidenceData(data);
      setEvidenceQR(id);
      toast.success('Evidence QR scanned successfully');
    } catch (err) {
      toast.error('Invalid Evidence ID');
    }
  };

  const handleShelfScanned = async (objectId: string) => {
    try {
      const shelf = await getShelfById(objectId);
      console.log('shelf:', shelf);

      if (shelf) {
        setShelfData(shelf);
        setShelfQR(objectId);
        toast.success('Shelf QR scanned successfully');
      } else {
        toast.error('Shelf not found');
      }
    } catch (err) {
      toast.error('Error identifying shelf');
    }
  };

  const handleConfirmStorage = async () => {
    try {
      // Use evidenceId (string) and shelfId (string) for the backend link
      await linkStorage({
        evidenceId: evidenceQR,
        shelf_id: shelfData._id
      });
      toast.success(`Evidence ${evidenceQR} stored at ${shelfData.shelfId}`);
      handleReset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Linking failed');
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleReset = () => {
    setEvidenceQR('');
    setShelfQR('');
    setEvidenceData(null);
    setShelfData(null);
    setIsScanning(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Scan & Store Evidence</h2>
          <p className="text-sm md:text-gray-600 mt-1">Scan evidence and shelf QR codes to record storage location</p>
        </div>
        {(evidenceQR || shelfQR) && (
          <button
            onClick={handleReset}
            className="w-full md:w-auto px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Reset Scans
          </button>
        )}
      </div>

      {/* Camera View Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Scanning {isScanning === 'evidence' ? 'Evidence' : 'Shelf'}...</h3>
              <button onClick={() => setIsScanning(null)}><XCircle className="text-red-500" /></button>
            </div>
            <div id="reader" className="w-full mx-auto"></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Scan Evidence QR */}
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
                onClick={() => setIsScanning('evidence')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Scan className="w-5 h-5" /> Scan Evidence QR
              </button>
              <div className="text-xs text-gray-500 py-4"></div>
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Evidence Scanned</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Evidence ID:</span><span className="ml-2 font-medium text-gray-900">{evidenceQR}</span></div>
                <div><span className="text-gray-600">Title:</span><span className="ml-2 text-gray-900">{evidenceData?.title}</span></div>
                <div><span className="text-gray-600">Type:</span><span className="ml-2 text-gray-900">{evidenceData?.type}</span></div>
                <div><span className="text-gray-600">Case:</span><span className="ml-2 text-gray-900">{evidenceData?.caseId}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Scan Shelf QR */}
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
                onClick={() => setIsScanning('shelf')}
                disabled={!evidenceQR}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <Scan className="w-5 h-5" /> Scan Shelf QR
              </button>
              {!evidenceQR && <p className="text-xs text-gray-500 mt-3">Scan evidence first</p>}
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Shelf Scanned</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Shelf ID:</span><span className="ml-2 font-medium text-gray-900">{shelfData?.shelfId}</span></div>
                <div><span className="text-gray-600">Location:</span><span className="ml-2 text-gray-900">{shelfData?.section}</span></div>
                <div><span className="text-gray-600">Capacity:</span><span className="ml-2 text-gray-900">{shelfData?.occupied}/{shelfData?.capacity} Occupied</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview and Confirm */}
      {evidenceQR && shelfQR && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Preview</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6">
            {/* Changed to flex-col-reverse on mobile so details stay on top, QR below */}
            <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-6">
              <div className="flex-1 w-full">
                <h4 className="font-semibold text-gray-900 mb-3 text-center md:text-left">Evidence Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-blue-100 pb-1 md:border-none"><span className="text-gray-600">Evidence ID:</span><span className="font-medium text-gray-900">{evidenceQR}</span></div>
                  <div className="flex justify-between border-b border-blue-100 pb-1 md:border-none"><span className="text-gray-600">Storage Location:</span><span className="font-medium text-gray-900">{shelfData?.shelfId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Timestamp:</span><span className="font-medium text-gray-900 text-right">{new Date().toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <QRCodeSVG value={`${evidenceQR}@${shelfData?.shelfId}`} size={120} className="md:w-[100px] md:h-[100px]" />
              </div>
            </div>
          </div>
          {/* Stack buttons vertically on mobile */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <button onClick={handleReset} className="w-full md:flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 md:order-1">
              Cancel
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isLinking}
              className="w-full md:flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 order-1 md:order-2"
            >
              {isLinking && <Loader2 className="w-5 h-5 animate-spin" />}
              Confirm Storage
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmStorage}
        title="Confirm Evidence Storage"
        message={`Are you sure you want to store ${evidenceQR} at ${shelfData?.shelfId}? This action will be recorded in the custody log.`}
        confirmText="Confirm Storage"
      />
    </div>
  );
}
