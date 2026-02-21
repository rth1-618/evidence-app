import React from 'react';
import { mockCustodyEvents, mockEvidence } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';

export default function CustodyRecords() {
  const custodyColumns: Column<typeof mockCustodyEvents[0]>[] = [
    { key: 'id', label: 'Event ID', sortable: true },
    { key: 'evidenceId', label: 'Evidence', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'performedBy', label: 'Performed By', sortable: true },
    { key: 'location', label: 'Location' },
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (item) => new Date(item.timestamp).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Custody Records</h2>
        <p className="text-gray-600 mt-1">View chain of custody history for all evidence</p>
      </div>

      <DataTable
        data={mockCustodyEvents}
        columns={custodyColumns}
        searchPlaceholder="Search custody records..."
        filters={
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">All Evidence</option>
            {mockEvidence.map((e) => (
              <option key={e.id} value={e.id}>{e.id}</option>
            ))}
          </select>
        }
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All custody records are read-only and cannot be modified. Each action is automatically timestamped and recorded.
        </p>
      </div>
    </div>
  );
}
