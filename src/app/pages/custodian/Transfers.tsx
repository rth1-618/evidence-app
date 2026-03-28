import React, { useState } from 'react';
import { mockTransfers, mockEvidence } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function Transfers() {
  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'dispatch' | 'return' | null>(null);

  const transferColumns: Column<typeof mockTransfers[0]>[] = [
    { key: 'id', label: 'Transfer ID', sortable: true },
    {
      key: 'evidenceId',
      label: 'Evidence',
      render: (item) => {
        const evidence = mockEvidence.find(e => e.id === item.evidenceId);
        return (
          <div>
            <div className="font-medium">{item.evidenceId}</div>
            <div className="text-xs text-gray-500">{evidence?.title}</div>
          </div>
        );
      }
    },
    { key: 'fromLocation', label: 'From', sortable: true },
    { key: 'toLocation', label: 'To', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge color={item.status} />
    },
    {
      key: 'requestedDate',
      label: 'Date',
      sortable: true,
      render: (item) => new Date(item.requestedDate).toLocaleDateString()
    }
  ];

  const handleAction = (transferId: string, action: 'approve' | 'dispatch' | 'return') => {
    setSelectedTransfer(transferId);
    setActionType(action);
    setShowApproveModal(true);
  };

  const handleConfirm = () => {
    toast.success(`Transfer ${actionType} successfully`);
    setSelectedTransfer(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Transfer Management</h2>
        <p className="text-gray-600 mt-1">Approve and track evidence transfers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-semibold text-gray-900">
            {mockTransfers.filter(t => t.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-semibold text-gray-900">
            {mockTransfers.filter(t => t.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">In Transit</div>
          <div className="text-2xl font-semibold text-gray-900">
            {mockTransfers.filter(t => t.status === 'in-transit').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-semibold text-gray-900">
            {mockTransfers.filter(t => t.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DataTable
          data={mockTransfers}
          columns={transferColumns}
          searchPlaceholder="Search transfers..."
        />

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          {mockTransfers.filter(t => t.status === 'pending').map((transfer) => (
            <div key={transfer.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{transfer.id}</div>
                <div className="text-sm text-gray-600">
                  {transfer.evidenceId}: {transfer.fromLocation} → {transfer.toLocation}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(transfer.id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(transfer.id, 'dispatch')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleConfirm}
        title={`Confirm ${actionType}`}
        message={`Are you sure you want to ${actionType} transfer ${selectedTransfer}?`}
        confirmText={actionType?.charAt(0).toUpperCase() + (actionType?.slice(1) || '')}
      />
    </div>
  );
}
