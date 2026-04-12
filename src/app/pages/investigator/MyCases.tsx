import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCases, mockEvidence, mockPersonsOfInterest } from '../../utils/mockData';
import api from '../../api/axios';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Plus, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';


export default function MyCases() {
  const { user, isLoading: authLoading } = useAuth();
  const componentRef = useRef(null);
  //驗證身分 Verify user role
  // console.log("Current User:", user); // Check if this is null
  // console.log("Auth Loading:", authLoading);
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddPOI, setShowAddPOI] = useState(false);
  const [poiForm, setPoiForm] = useState({
    name: '',
    dob: '',
    role: '',
    contract: ''
  });

  if (authLoading) {
    return <div>Loading...</div>;
  }
  if (!user || user.role !== 'INVESTIGATOR') {
    return <div>Unauthorized</div>;
  }
  else {
    /**Case Management */
    //add case
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCase, setNewCase] = useState({ caseId: '', title: '', types: '', status: 'active', investigatorId: user.id });
    const handleAddCase = async () => {
      try {
        // console.log('case:', newCase);
        const res = await api.post('/cases/addcase', newCase);
        toast.success('Case added successfully');
        setShowAddModal(false);
        refetch();
        // After adding a new case, refetch the case list to show the updated data
        refetch();
      } catch (error) {
        console.error('Error adding case:', error);
        toast.error('Failed to add case');
      }
    };
    //list case 
    const { data: caseList = [], isLoading, refetch } = useQuery({
      queryKey: ['cases', user?.id],
      queryFn: async () => {
        const res = await api.get('/cases', { params: { investigatorId: user.id } });
        console.log('res:', res);
        return res.data.data;
      },
      enabled: !!user?.id
    });
    const caseColumns: Column<typeof caseList[0]>[] = [
      { key: 'caseId', label: 'Case ID', sortable: true },
      { key: 'title', label: 'Title', sortable: true },
      { key: 'types', label: 'Type', sortable: true },
      {
        key: 'status',
        label: 'Status',
        render: (item) => <StatusBadge color={item.status} />
      },
      {
        key: 'updatedAt',
        label: 'Last Modified',
        sortable: true,
        render: (item) => new Date(item.updatedAt).toLocaleDateString()
      },
      {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        render: (item) => new Date(item.createdAt).toLocaleDateString()
      }
    ];
    const handleCaseClick = (caseItem: typeof caseList[0]) => {
      setSelectedCase(caseItem.caseId);
    };
    const selectedCaseData = caseList.find((c: typeof caseList[0]) => c.caseId === selectedCase);
    // console.log('Selected Case Data:', selectedCaseData); // Check if this is undefined



    /* Evidence Management */
    // list evidence only active ==pending for verification
    const { data: evidenceData = [], isLoading: evidenceLoading, refetch: refetchEvidence } = useQuery({
      queryKey: ['evidence', user?.id],
      queryFn: async () => {
        const res = await api.get('/evidence');
        setShowAddEvidence(false);
        // Filter evidence to only include those with status 'pending' and investigatorId matching the current user
        // const filteredEvidence = res.data.data.filter((e: any) => e.status === 'pending');
        //console.log('Filtered Evidence:', filteredEvidence); 
        return res.data.data;
      },
      enabled: !!user?.id
    });

    // fliter only pending evidence and caseId match selected case
    const caseEvidence = evidenceData.filter((e: any) => e.caseId === selectedCase);
    const filteredEvidence = evidenceData.filter((e: any) => e.status === 'pending');
    // console.log('Filtered Evidence for Selected Case:', filteredEvidence); // Check if this is empty or contains the expected evidence items

    const evidenceColumns: Column<typeof evidenceData[0]>[] = [
      { key: 'evidenceId', label: 'Evidence ID', sortable: true },
      { key: 'title', label: 'Title', sortable: true },
      { key: 'description', label: 'Description', sortable: false },
      {
        key: 'status',
        label: 'Status',
        render: (item) => <StatusBadge color={item.status} />
      },
      {
        key: 'submittedDate',
        label: 'Submitted',
        sortable: true,
        render: (item) => new Date(item.submittedDate).toLocaleDateString()
      },
      {
        key: 'storedAt',
        label: 'Location',
        render: (item) => item.storedAt || 'N/A'
      },
      {
        key: 'verify', label: 'Action', render: (item) => (
          <button
            onClick={async () => {
              //setSelectedCase(item.caseId);
              //setShowAddEvidence(true);
              // change status to verified in database
              try {
                const res = await api.post(`/cases/verify`, { id: item.evidenceId, caseId: item.caseId });
                toast.success('Evidence verified successfully');
                setShowAddEvidence(true);
                // console.log('Verification Response:', res);
                //refetchEvidence(); // Refresh the evidence list after verification
              } catch (error) {
                console.error('Error verifying evidence:', error);
                toast.error('Failed to verify evidence');
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Verify
          </button>
        )
      }

    ];

    //selected case detail from database Fetch selected case detail from database
    const handleEvidenceClick = (evidenceItem: typeof evidenceData[0]) => {
      setSelectedCase(evidenceItem.evidenceId);
    };
    //setSelectedEvidence(evidenceItem.evidenceId);

    const { data: poiData = [], isLoading: poiLoading, refetch: refetchPoi } = useQuery({
      queryKey: ['pois', user?.id, selectedCase],
      queryFn: async () => {
        // console.log('Fetching POIs for investigatorId:', user.id, 'and caseId:', selectedCase);
        const res = await api.get('/cases/pois', { params: { investigatorId: user.id, caseId: selectedCase } });
        // console.log('pois', res);
        setShowAddEvidence(false);
        return res.data.data;
      },
      enabled: !!user?.id && !!selectedCase
    });
    /* Persons of Interest Management */
    const handleAddPOI = async () => {
      try {
        // console.log('case:', poiForm);
        const res = await api.post('/cases/addPOI', { ...poiForm, caseId: selectedCase, investigatorId: user.id });
        toast.success('POI added successfully');
        setShowAddPOI(false);
        refetch();
        // After adding a new case, refetch the case list to show the updated data
        refetch();
      } catch (error) {
        console.error('Error adding case:', error);
        toast.error('Failed to add case');
      }
    };

    const poiColumns: Column<typeof poiData[0]>[] = [
      { key: '_id', label: 'POI ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'caseId', label: 'Case ID', sortable: true },
      { key: 'dob', label: 'Date of Birth', sortable: true, render: (item) => new Date(item.dob).toLocaleDateString() },
      { key: 'role', label: 'Role in Case', sortable: true },
      { key: 'lastKnownLocation', label: 'Last Known Location', sortable: false }
    ];

    const caseEvidenceA = caseList.filter((e: typeof caseList[0]) => e.caseId === selectedCase && e.status === 'Active');
    const casePOIs = poiData.filter((p: typeof poiData[0]) => p.caseId === selectedCase);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Cases</h2>
            <p className="text-gray-600 mt-1">View and manage your assigned cases</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Case
          </button>
        </div>
        <div className="flex justify-end">
        </div>
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Case">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Case added'); setShowAddModal(false); handleAddCase(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case ID *</label>
              <input
                type="text"
                required
                value={newCase.caseId}
                onChange={(e) => setNewCase({ ...newCase, caseId: e.target.value })}
                placeholder="e.g., Case 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                //placeholder="e.g., Section E"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <input
                type="text"
                required
                value={newCase.types}
                onChange={(e) => setNewCase({ ...newCase, types: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Case
              </button>
            </div>
          </form>
        </Modal>

        {!selectedCase ? (
          <DataTable
            data={caseList}
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
                  <p className="text-gray-600 mt-1">Case ID: {selectedCaseData?.caseId}</p>
                </div>
                <StatusBadge color={selectedCaseData?.status || 'open'} size="md" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 text-gray-900">{selectedCaseData?.types}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedCaseData?.createdAt && new Date(selectedCaseData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Modified:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedCaseData?.updatedAt && new Date(selectedCaseData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence List (Read-only) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Evidence</h4>
                <button
                  onClick={() => setShowAddEvidence(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
                >
                  <Plus className="w-4 h-4" />
                  Verify New Evidence
                </button>
              </div>
              {caseEvidence.length > 0 ? (
                <div className="space-y-3">
                  {caseEvidence.map((evidence: typeof caseEvidence[0]) => (
                    <div key={evidence.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{evidence.id} - {evidence.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{evidence.description}</div>
                        </div>
                        <StatusBadge color={evidence.status} />
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
            <Modal
              isOpen={showAddEvidence}
              onClose={() => setShowAddEvidence(false)}
              title="Verify New Evidence"
            >
              <div className="text-center py-8 text-gray-500">
                {/*select evedience by field officer and verify it here */}
                <DataTable
                  data={filteredEvidence}
                  columns={evidenceColumns}
                  searchPlaceholder="Search cases..."
                  emptyMessage="No cases assigned to you"
                />
              </div>
            </Modal>

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
                  {casePOIs.map((poi: typeof poiData[0]) => (
                    <div key={poi._id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{poi.name}</div>
                          <div className="text-sm text-gray-600">Role: {poi.role}</div>
                          <div className="text-xs text-gray-500 mt-1">DOB: {new Date(poi.dob).toLocaleDateString()}</div>
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
                value={poiForm.contract}
                onChange={(e) => setPoiForm({ ...poiForm, contract: e.target.value })}
                placeholder="Enter contact information"
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
}
