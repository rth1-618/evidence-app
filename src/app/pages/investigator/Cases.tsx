import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCases, mockEvidence } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Cases() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', type: '', officers: '' });

  const caseColumns: Column<typeof mockCases[0]>[] = [
    { key: 'id', label: 'Case ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge color={item.status} />
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sortable: true,
      render: (item) => new Date(item.lastModified).toLocaleDateString()
    }
  ];

  const handleCreateCase = () => {
    toast.success('Case created successfully');
    setShowCreateModal(false);
    setNewCase({ title: '', type: '', officers: '' });
  };

  const handleRowClick = (caseItem: typeof mockCases[0]) => {
    navigate(`/investigator/cases/${caseItem.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Cases</h2>
          <p className="text-gray-600 mt-1">Manage and track all cases</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Create Case
        </button>
      </div>

      <DataTable
        data={mockCases}
        columns={caseColumns}
        searchPlaceholder="Search cases..."
        onRowClick={handleRowClick}
      />

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Case">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateCase(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Title *</label>
            <input
              type="text"
              required
              value={newCase.title}
              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Type *</label>
            <select
              required
              value={newCase.type}
              onChange={(e) => setNewCase({ ...newCase, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type...</option>
              <option value="Burglary">Burglary</option>
              <option value="Theft">Theft</option>
              <option value="Fraud">Fraud</option>
              <option value="Assault">Assault</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Officers</label>
            <input
              type="text"
              value={newCase.officers}
              onChange={(e) => setNewCase({ ...newCase, officers: e.target.value })}
              placeholder="Officer names (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}