import React from 'react';
import { mockAuditLogs } from '../../utils/mockData';
import { DataTable, Column } from '../../components/ui/DataTable';

export default function AuditLogs() {
  const logColumns: Column<typeof mockAuditLogs[0]>[] = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (item) => new Date(item.timestamp).toLocaleString()
    },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'resource', label: 'Resource', sortable: true },
    { key: 'details', label: 'Details' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Audit Logs</h2>
        <p className="text-gray-600 mt-1">System activity and security logs</p>
      </div>

      <DataTable
        data={mockAuditLogs}
        columns={logColumns}
        searchPlaceholder="Search logs..."
        filters={
          <>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">All Users</option>
              <option value="1">John Mitchell</option>
              <option value="2">Sarah Williams</option>
              <option value="3">David Thompson</option>
              <option value="4">Elizabeth Carter</option>
            </select>
          </>
        }
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All system actions are automatically logged and cannot be deleted. Logs are retained according to data retention policies.
        </p>
      </div>
    </div>
  );
}
