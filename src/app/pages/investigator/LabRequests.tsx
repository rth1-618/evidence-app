import React from 'react';
import { mockLabRequests } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function LabRequests() {
  const labColumns: Column<typeof mockLabRequests[0]>[] = [
    { key: 'id', label: 'Request ID', sortable: true },
    { key: 'evidenceId', label: 'Evidence', sortable: true },
    { key: 'caseId', label: 'Case', sortable: true },
    { key: 'requestType', label: 'Request Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const isOverdue = item.status === 'in-lab' && new Date(item.dueDate) < new Date();
        return <StatusBadge color={isOverdue ? 'overdue' : item.status} />;
      }
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (item) => {
        const isOverdue = new Date(item.dueDate) < new Date();
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {new Date(item.dueDate).toLocaleDateString()}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Lab Requests</h2>
        <p className="text-gray-600 mt-1">Track forensic analysis requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-semibold text-gray-900">
            {mockLabRequests.filter(r => r.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">In Lab</div>
          <div className="text-3xl font-semibold text-gray-900">
            {mockLabRequests.filter(r => r.status === 'in-lab').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Returned</div>
          <div className="text-3xl font-semibold text-gray-900">
            {mockLabRequests.filter(r => r.status === 'returned').length}
          </div>
        </div>
      </div>

      <DataTable
        data={mockLabRequests}
        columns={labColumns}
        searchPlaceholder="Search lab requests..."
      />
    </div>
  );
}
