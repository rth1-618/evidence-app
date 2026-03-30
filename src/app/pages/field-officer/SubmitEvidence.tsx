import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../hooks/useEvidence';
import { MapPin, Upload as UploadIcon, CheckCircle, Radio, Music, CircleX, ShieldCheck } from 'lucide-react';
import { mockCases } from '../../utils/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { MediaCapture } from '../../components/ui/MediaCapture';
import { LiveMediaCapture } from '../../components/ui/LiveMediaCapture';
import { MediaPreview } from '../../components/ui/MediaPreview';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { PrintSticker } from '../../components/core/PrintSticker';

export default function SubmitEvidence() {

  const { user } = useAuth(); // Automatically get logged in user
  const { submitEvidence, isSubmitting } = useEvidence();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Physical',
    caseId: '',
    description: '',
    location: '', // Address string
    lat: 0,
    lng: 0,
  });
  const [media, setMedia] = useState<{
    img: File[],
    video: File[],
    voiceNote: File[]
  }>({ img: [], video: [], voiceNote: [] });

  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [submittedEvidence, setSubmittedEvidence] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [activeRecorder, setActiveRecorder] = useState<'img' | 'video' | 'voiceNote' | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<{ file: File | string, type: string } | null>(null);


  const navigate = useNavigate();

  // 1. Auto-set Location and Timestamp
  useEffect(() => {
    const getPosition = async () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser.");
        setIsLocating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            setFormData(prev => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              location: data.display_name || "Address not found"
            }));
            setIsLocating(false); // Success!
          } catch (error) {
            console.error("Reverse geocode error:", error);
            setFormData(prev => ({ ...prev, lat: latitude, lng: longitude, location: "GPS Fixed (No Address)" }));
            setIsLocating(false);
          }
        },
        (err) => {
          // Handle User Refusal or Device Errors
          const messages = {
            1: "Permission denied. Please enable location in your browser settings to submit evidence.",
            2: "Location unavailable. Check your device GPS.",
            3: "Request timed out."
          };
          setLocationError(messages[err.code as keyof typeof messages] || "An unknown error occurred.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    getPosition();
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'img' | 'video' | 'voiceNote') => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMedia(prev => ({
        ...prev,
        [category]: [...prev[category], ...newFiles]
      }));
    }
  };

  const addMedia = (file: File, type: 'img' | 'video' | 'voiceNote') => {
    setMedia(prev => ({ ...prev, [type]: [...prev[type], file] }));
  };

  const assignedCases = mockCases.filter(c =>
    c.assignedOfficers.includes('John Mitchell') && c.status === 'open'
  );

  const evidenceTypes = [
    'Physical',
    'Digital',
    'Video',
    'Audio',
    'Document',
    'Photograph',
    'Other'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleFiles = (incomingFiles: File[]) => {
    incomingFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        setMedia(prev => ({ ...prev, img: [...prev.img, file] }));
      } else if (file.type.startsWith('video/')) {
        setMedia(prev => ({ ...prev, video: [...prev.video, file] }));
      } else if (file.type.startsWith('audio/')) {
        setMedia(prev => ({ ...prev, voiceNote: [...prev.voiceNote, file] }));
      } else {
        // Default to img or handle other types as needed
        setMedia(prev => ({ ...prev, img: [...prev.img, file] }));
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingId = toast.loading('Uploading evidence to secure storage...');

    try {
      const data = new FormData();

      // Basic fields
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('caseId', formData.caseId);
      data.append('description', formData.description);

      // Crucial: Stringify the object for the backend JSON.parse
      data.append('locationFound', JSON.stringify({
        lat: formData.lat,
        lng: formData.lng,
        address: formData.location
      }));

      // Append files to their specific fields
      media.img.forEach(file => data.append('img', file));
      media.video.forEach(file => data.append('video', file));
      media.voiceNote.forEach(file => data.append('voiceNote', file));

      const result = await submitEvidence(data);

      if (result.success) {
        toast.success('Evidence secured and uploaded!', { id: loadingId });
        setSubmitted(true);
        setQrCode(result.data.evidenceId);
        setSubmittedEvidence(result.data)

      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: loadingId });
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      title: '',
      type: '',
      caseId: '',
      description: ''
    });
    setFiles([]);
    setMedia({ img: [], video: [], voiceNote: [] })
    setSubmitted(false);

    setQrCode('');
  };

  // 1. Show Loading Screen while waiting for GPS
  if (isLocating) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Securing GPS Location...</h2>
        <p className="text-gray-500">Evidence submission requires verified location data.</p>
      </div>
    );
  }

  // 2. Show Error Screen if Permission is Denied
  if (locationError) {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-red-50 rounded-2xl border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-red-900 mb-2">Location Required</h2>
        <p className="text-red-700 mb-6">{locationError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
        >
          Try Again / Grant Permission
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto print:max-w-none print:m-0">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center print:border-none print:p-0">

          {/* Your success messageand buttons here */}

          {/* Header - Hidden on Print */}
          <div className="print:hidden">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Evidence Secured</h2>
            <p className="text-gray-600 mb-6">The digital record has been successfully hashed and stored.</p>
          </div>

          {/* THE UNIFIED TAG */}
          <PrintSticker
            type="EVIDENCE"
            qrValue={qrCode}
            idDisplay={qrCode}
            title={formData.title}
            caseId={formData.caseId}
            secondaryId={user?.badge}
            submittedAt={new Date(submittedEvidence.submittedDate).toLocaleString()}
            showInComponent={true}
          />

          {/* Action Buttons - Hidden on Print */}
          <div className="mt-8 space-y-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
            >
              <Printer className="w-5 h-5" /> Generate Bag Sticker
            </button>
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Evidence
            </button>
            <button
              onClick={() => navigate('/field-officer/dashboard')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>


      </div>
    );
  }


  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Submit Evidence</h2>
          <p className="text-gray-600 mt-1">Complete the form below to submit new evidence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the evidence"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  {evidenceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Case *
                </label>
                <select
                  required
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select case...</option>
                  {assignedCases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.id} - {caseItem.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the evidence, how it was collected, and any relevant context"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    disabled
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter address or location"
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Coordinates: {formData.lat}, {formData.lng}
                </p>
              </div>
            </div>
          </div>

          {activeRecorder && (
            <LiveMediaCapture
              mode={activeRecorder}
              onCapture={(file) => {
                // Use your existing logic to add file to state
                addMedia(file, activeRecorder);
                setActiveRecorder(null);
              }}
              onClose={() => setActiveRecorder(null)}
            />
          )}
          {/* 1. Live Capture Box */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Collection</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">
                <Radio className="w-3 h-3" /> Field Mode Active
              </span>
            </div>

            <MediaCapture
              onCapture={handleFileChange}
              onOpenLive={(mode) => setActiveRecorder(mode)}
            />
            {/* upload more */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            >
              <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  browse
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supported: Images, Videos, Documents (Max 100MB per file)
              </p>
            </div>

            {
              Object.values(media).flat().length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {Object.entries(media).map(([category, fileArray]) =>
                    fileArray.map((file, index) => (
                      <div key={`${category}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-500 uppercase">{category}</span>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMedia(prev => ({
                              ...prev,
                              [category]: prev[category as keyof typeof media].filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {Object.entries(media).map(([category, fileArray]) =>
                fileArray.map((file, index) => (
                  <MediaPreview
                    key={`${category}-${index}`}
                    src={file}
                    type={category as any}
                    onRemove={() => {
                      setMedia(prev => ({
                        ...prev,
                        [category]: prev[category as keyof typeof media].filter((_, i) => i !== index)
                      }));
                    }}
                    onView={() => setActivePreview({ file, type: category })}
                  />
                ))
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Evidence
            </button>
          </div>
        </form>
      </div>

      {activePreview && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setActivePreview(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <CircleX className="w-8 h-8" />
          </button>

          <div className="w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
            {activePreview.type === 'img' && (
              <img
                src={typeof activePreview.file === 'string' ? activePreview.file : URL.createObjectURL(activePreview.file)}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
            {activePreview.type === 'video' && (
              <video
                controls autoPlay
                src={typeof activePreview.file === 'string' ? activePreview.file : URL.createObjectURL(activePreview.file)}
                className="max-w-full max-h-full rounded-lg"
              />
            )}
            {activePreview.type === 'voiceNote' && (
              <div className="bg-white/5 p-12 rounded-3xl border border-white/10 flex flex-col items-center">
                <Music className="w-20 h-20 text-blue-500 mb-6" />
                <audio
                  controls autoPlay
                  src={typeof activePreview.file === 'string' ? activePreview.file : URL.createObjectURL(activePreview.file)}
                />
              </div>
            )}
          </div>
          <p className="text-white/50 mt-6 text-sm uppercase tracking-widest font-bold">
            {activePreview.type} Preview
          </p>
        </div>
      )}
    </>

  );
}
