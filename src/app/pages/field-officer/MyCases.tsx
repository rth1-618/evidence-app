import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCases, mockEvidence, mockPersonsOfInterest } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Plus, User } from 'lucide-react';

export default function MyCases() {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAddPOI, setShowAddPOI] = useState(false);
  const [poiForm, setPoiForm] = useState({
    name: '',
    dob: '',
    role: '',
    address: ''
  });

  const assignedCases = mockCases.filter(c => 
    c.assignedOfficers.includes('John Mitchell')
  );

  const caseColumns: Column<typeof assignedCases[0]>[] = [
    { key: 'id', label: 'Case ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sortable: true,
      render: (item) => new Date(item.lastModified).toLocaleDateString()
    }
  ];

  const handleCaseClick = (caseItem: typeof assignedCases[0]) => {
    setSelectedCase(caseItem.id);
  };

  const handleAddPOI = () => {
    // Handle form submission
    console.log('Adding POI:', poiForm);
    setShowAddPOI(false);
    setPoiForm({ name: '', dob: '', role: '', address: '' });
  };

  const selectedCaseData = mockCases.find(c => c.id === selectedCase);
  const caseEvidence = mockEvidence.filter(e => e.caseId === selectedCase);
  const casePOIs = mockPersonsOfInterest.filter(p => p.caseId === selectedCase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Cases</h2>
          <p className="text-gray-600 mt-1">View and manage your assigned cases</p>
        </div>
      </div>

      {!selectedCase ? (
        <DataTable
          data={assignedCases}
          columns={caseColumns}
          onRowClick={handleCaseClick}
          searchPlaceholder="Search cases..."
          emptyMessage="No cases assigned to you"
        />
      ) : (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCase(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Cases
          </button>

          {/* Case Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCaseData?.title}</h3>
                <p className="text-gray-600 mt-1">Case ID: {selectedCaseData?.id}</p>
              </div>
              <StatusBadge status={selectedCaseData?.status || 'open'} size="md" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 text-gray-900">{selectedCaseData?.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 text-gray-900">
                  {selectedCaseData?.createdDate && new Date(selectedCaseData.createdDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Modified:</span>
                <span className="ml-2 text-gray-900">
                  {selectedCaseData?.lastModified && new Date(selectedCaseData.lastModified).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence List (Read-only) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Evidence</h4>
            {caseEvidence.length > 0 ? (
              <div className="space-y-3">
                {caseEvidence.map((evidence) => (
                  <div key={evidence.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{evidence.id} - {evidence.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{evidence.description}</div>
                      </div>
                      <StatusBadge status={evidence.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      <span>Type: {evidence.type}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(evidence.submittedDate).toLocaleDateString()}</span>
                      {evidence.storedAt && (
                        <>
                          <span>•</span>
                          <span>Location: {evidence.storedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No evidence submitted for this case yet
              </div>
            )}
          </div>

          {/* Persons of Interest */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Persons of Interest</h4>
              <button
                onClick={() => setShowAddPOI(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Person
              </button>
            </div>
            {casePOIs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {casePOIs.map((poi) => (
                  <div key={poi.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{poi.name}</div>
                        <div className="text-sm text-gray-600">Role: {poi.role}</div>
                        <div className="text-xs text-gray-500 mt-1">DOB: {new Date(poi.dob).toLocaleDateString()}</div>
                        {poi.lastKnownLocation && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                            <MapPin className="w-3 h-3" />
                            {poi.lastKnownLocation.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No persons of interest added yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Person of Interest Modal */}
      <Modal
        isOpen={showAddPOI}
        onClose={() => setShowAddPOI(false)}
        title="Add Person of Interest"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddPOI(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={poiForm.name}
              onChange={(e) => setPoiForm({ ...poiForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={poiForm.dob}
              onChange={(e) => setPoiForm({ ...poiForm, dob: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role in Case *
            </label>
            <select
              required
              value={poiForm.role}
              onChange={(e) => setPoiForm({ ...poiForm, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role...</option>
              <option value="Suspect">Suspect</option>
              <option value="Witness">Witness</option>
              <option value="Victim">Victim</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Known Location
            </label>
            <input
              type="text"
              value={poiForm.address}
              onChange={(e) => setPoiForm({ ...poiForm, address: e.target.value })}
              placeholder="Enter address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddPOI(false)}
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
