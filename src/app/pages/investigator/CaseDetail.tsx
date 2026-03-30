import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  mockCases,
  mockEvidence,
  mockPersonsOfInterest,
  type PersonOfInterest
} from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  Plus,
  Link2,
  Users,
  FileText,
  MapPin,
  Calendar,
  User,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const caseData = mockCases.find(c => c.id === caseId);
  const caseEvidence = mockEvidence.filter(e => e.caseId === caseId);
  const casePersons = mockPersonsOfInterest.filter(p => p.caseId === caseId);

  // Available evidence not yet attached to this case
  const availableEvidence = mockEvidence.filter(e => e.caseId !== caseId);

  const [caseDetails, setCaseDetails] = useState({
    description: caseData?.title || '',
    notes: '',
    priority: 'medium'
  });

  const [showAttachEvidenceModal, setShowAttachEvidenceModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState<{ name: string; dob: string; role: string; address: string | undefined; }>({
    name: '',
    dob: '',
    role: 'Suspect',
    address: ''
  });

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Case not found</p>
        <button
          onClick={() => navigate('/investigator/cases')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Cases
        </button>
      </div>
    );
  }

  const handleSaveDetails = () => {
    toast.success('Case details updated successfully');
  };

  const handleAttachEvidence = () => {
    if (selectedEvidence.length === 0) {
      toast.error('Please select at least one evidence item');
      return;
    }
    toast.success(`${selectedEvidence.length} evidence item(s) attached to case`);
    setSelectedEvidence([]);
    setShowAttachEvidenceModal(false);
  };

  const handleAddPerson = () => {
    if (!newPerson.name || !newPerson.dob) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`${newPerson.name} added as ${newPerson.role}`);
    setNewPerson({ name: '', dob: '', role: 'Suspect', address: '' });
    setShowAddPersonModal(false);
  };

  const toggleEvidenceSelection = (evidenceId: string) => {
    setSelectedEvidence(prev =>
      prev.includes(evidenceId)
        ? prev.filter(id => id !== evidenceId)
        : [...prev, evidenceId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/investigator/cases')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{caseData.id}</h2>
            <p className="text-gray-600 mt-1">{caseData.title}</p>
          </div>
        </div>
        <StatusBadge color={caseData.status} />
      </div>

      {/* Case Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Case Type</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{caseData.type}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Created Date</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(caseData.createdDate).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Assigned Officers</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {caseData.assignedOfficers.join(', ')}
          </p>
        </div>
      </div>

      {/* Case Details Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={caseDetails.description}
              onChange={(e) => setCaseDetails({ ...caseDetails, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investigation Notes
            </label>
            <textarea
              value={caseDetails.notes}
              onChange={(e) => setCaseDetails({ ...caseDetails, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your investigation notes here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={caseDetails.priority}
              onChange={(e) => setCaseDetails({ ...caseDetails, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            onClick={handleSaveDetails}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Details
          </button>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Attached Evidence</h3>
          <button
            onClick={() => setShowAttachEvidenceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Link2 className="w-4 h-4" />
            Attach Evidence
          </button>
        </div>

        {caseEvidence.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No evidence attached yet</p>
        ) : (
          <div className="space-y-3">
            {caseEvidence.map((evidence) => (
              <div
                key={evidence.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{evidence.id}</span>
                    <StatusBadge color={evidence.status} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{evidence.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{evidence.locationFound?.address}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted by {evidence.submittedBy} on {new Date(evidence.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Persons of Interest Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Persons of Interest</h3>
          <button
            onClick={() => setShowAddPersonModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Person
          </button>
        </div>

        {casePersons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No persons of interest added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {casePersons.map((person) => (
              <div
                key={person.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.role}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>DOB: {new Date(person.dob).toLocaleDateString()}</p>
                  {person.lastKnownLocation && (
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{person.lastKnownLocation?.address}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Added: {new Date(person.addedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attach Evidence Modal */}
      <Modal
        isOpen={showAttachEvidenceModal}
        onClose={() => {
          setShowAttachEvidenceModal(false);
          setSelectedEvidence([]);
        }}
        title="Attach Evidence to Case"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select evidence items collected by field officers to attach to this case:
          </p>

          {availableEvidence.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No available evidence to attach</p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableEvidence.map((evidence) => (
                <label
                  key={evidence.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedEvidence.includes(evidence.id)}
                    onChange={() => toggleEvidenceSelection(evidence.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">{evidence.id}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {evidence.caseId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{evidence.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted by {evidence.submittedBy}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowAttachEvidenceModal(false);
                setSelectedEvidence([]);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachEvidence}
              disabled={selectedEvidence.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Attach Selected ({selectedEvidence.length})
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Person of Interest Modal */}
      <Modal
        isOpen={showAddPersonModal}
        onClose={() => {
          setShowAddPersonModal(false);
          setNewPerson({ name: '', dob: '', role: 'Suspect', address: '' });
        }}
        title="Add Person of Interest"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddPerson();
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newPerson.name}
              onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={newPerson.dob}
              onChange={(e) => setNewPerson({ ...newPerson, dob: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              required
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Suspect">Suspect</option>
              <option value="Witness">Witness</option>
              <option value="Victim">Victim</option>
              <option value="Associate">Associate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Known Address
            </label>
            <textarea
              value={newPerson?.address}
              onChange={(e) => setNewPerson({ ...newPerson, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address (optional)"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This person is not currently in the system. They will be added as a new entry.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddPersonModal(false);
                setNewPerson({ name: '', dob: '', role: 'Suspect', address: '' });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Person
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
