import React from 'react';
import { Package, FlaskConical, ArrowLeftRight, Clock } from 'lucide-react';
import { mockEvidence, mockTransfers } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function CustodianDashboard() {
  const awaitingStorage = mockEvidence.filter(e => e.status === 'pending').length;
  const inLab = mockEvidence.filter(e => e.status === 'in-lab').length;
  const pendingTransfers = mockTransfers.filter(t => t.status === 'pending').length;
  const activeTransfers = mockTransfers.filter(t => t.status === 'in-transit').length;

  const stats = [
    {
      label: 'Awaiting Storage',
      value: awaitingStorage,
      icon: <Package className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Evidence in Lab',
      value: inLab,
      icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Pending Transfers',
      value: pendingTransfers,
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Active Transfers',
      value: activeTransfers,
      icon: <ArrowLeftRight className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Evidence EV-001 stored at Shelf A-12', time: '10 minutes ago', type: 'storage' },
    { id: 2, action: 'Transfer TR-001 approved for Forensics Lab', time: '1 hour ago', type: 'transfer' },
    { id: 3, action: 'Evidence EV-003 scanned into system', time: '2 hours ago', type: 'scan' },
    { id: 4, action: 'Evidence EV-002 dispatched to lab', time: '3 hours ago', type: 'dispatch' }
  ];

  const pendingStorageItems = mockEvidence.filter(e => e.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Custodian Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage evidence storage and transfers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Storage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Awaiting Storage</h3>
          <div className="space-y-3">
            {pendingStorageItems.map((evidence) => (
              <div key={evidence.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{evidence.id}</div>
                    <div className="text-sm text-gray-600 mt-1">{evidence.title}</div>
                  </div>
                  <StatusBadge status={evidence.status} />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(evidence.submittedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pendingStorageItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No evidence awaiting storage
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Transfers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Transfers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Transfer ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Evidence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{transfer.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transfer.evidenceId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{transfer.fromLocation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{transfer.toLocation}</td>
                  <td className="px-4 py-3"><StatusBadge status={transfer.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(transfer.requestedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
