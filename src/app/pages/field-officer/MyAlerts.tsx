import React, { useState } from 'react';
import { mockAlerts } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MyAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  const myAlerts = mockAlerts.filter(a => a.assignedTo === 'John Mitchell');

  const alertColumns: Column<typeof myAlerts[0]>[] = [
    { key: 'id', label: 'Alert ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'message', label: 'Message' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (item) => new Date(item.createdDate).toLocaleDateString()
    }
  ];

  const handleAlertClick = (alert: typeof myAlerts[0]) => {
    setSelectedAlert(alert.id);
    if (alert.status === 'pending') {
      setShowResponseModal(true);
    }
  };

  const handleCompleteAlert = () => {
    toast.success('Alert marked as completed');
    setShowResponseModal(false);
    setSelectedAlert(null);
    setResponse('');
  };

  const selectedAlertData = myAlerts.find(a => a.id === selectedAlert);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">My Alerts</h2>
        <p className="text-gray-600 mt-1">Tasks and notifications assigned to you</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Alerts</div>
          <div className="text-3xl font-semibold text-gray-900">{myAlerts.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <div className="text-sm text-yellow-800 mb-1">Pending</div>
          <div className="text-3xl font-semibold text-yellow-900">
            {myAlerts.filter(a => a.status === 'pending').length}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="text-sm text-green-800 mb-1">Completed</div>
          <div className="text-3xl font-semibold text-green-900">
            {myAlerts.filter(a => a.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <DataTable
        data={myAlerts}
        columns={alertColumns}
        onRowClick={handleAlertClick}
        searchPlaceholder="Search alerts..."
        filters={
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        }
        emptyMessage="No alerts assigned to you"
      />

      {/* Response Modal */}
      <Modal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setSelectedAlert(null);
          setResponse('');
        }}
        title="Complete Alert"
      >
        {selectedAlertData && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedAlertData.title}</h4>
              <p className="text-sm text-gray-600">{selectedAlertData.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(selectedAlertData.createdDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Response Note
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Describe what actions were taken..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800">
                This will mark the alert as completed
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedAlert(null);
                  setResponse('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteAlert}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
