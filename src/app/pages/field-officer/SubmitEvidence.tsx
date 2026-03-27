import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvidence } from '../../hooks/useEvidence';
import { MapPin, Upload as UploadIcon, CheckCircle, Radio } from 'lucide-react';
import { mockCases } from '../../utils/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { MediaCapture } from '../../components/ui/MediaCapture';
import { LiveMediaCapture } from '../../components/ui/LiveMediaCapture';

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
  const [files, setFiles] = useState<File[]>([]);
  const [activeRecorder, setActiveRecorder] = useState<'img' | 'video' | 'voiceNote' | null>(null);


  // 1. Auto-set Location and Timestamp
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // Fetch address from Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            location: data.display_name || "Address not found" // Full formatted address
          }));
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      });
    }
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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: loadingId });
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      type: '',
      caseId: '',
      description: '',
      location: '',
      lat: 0,
      lng: 0
    });
    setFiles([]);
    setMedia({ img: [], video: [], voiceNote: [] })
    setSubmitted(false);
    setQrCode('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Evidence Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">Your evidence has been recorded and is pending storage processing</p>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4">Evidence QR Code</p>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <QRCodeSVG value={qrCode} size={200} level='M' marginSize={1} />
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">{qrCode}</p>
            <p className="text-sm text-gray-500 mt-2">This QR code will be used by custodians for storage tracking</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Evidence
            </button>
            <button
              onClick={handleReset}
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
  );
}
