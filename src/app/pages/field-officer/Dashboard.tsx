import React from 'react';
import { Briefcase, Bell, Upload, Clock } from 'lucide-react';
import { mockCases, mockEvidence, mockAlerts } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function FieldOfficerDashboard() {
  const assignedCases = mockCases.filter(c => 
    c.assignedOfficers.includes('John Mitchell')
  );
  const pendingAlerts = mockAlerts.filter(a => 
    a.assignedTo === 'John Mitchell' && a.status === 'pending'
  );
  const recentSubmissions = mockEvidence
    .filter(e => e.submittedBy === 'John Mitchell')
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Assigned Cases',
      value: assignedCases.length,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pending Alerts',
      value: pendingAlerts.length,
      icon: <Bell className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Evidence Submitted',
      value: recentSubmissions.length,
      icon: <Upload className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      label: 'Open Cases',
      value: assignedCases.filter(c => c.status === 'open').length,
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back, Officer</h2>
        <p className="text-gray-600 mt-1">Here's your current workload overview</p>
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
        {/* Assigned Cases */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Cases</h3>
          <div className="space-y-3">
            {assignedCases.map((caseItem) => (
              <div key={caseItem.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{caseItem.id}</div>
                    <div className="text-sm text-gray-600 mt-1">{caseItem.title}</div>
                  </div>
                  <StatusBadge status={caseItem.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span>Type: {caseItem.type}</span>
                  <span>•</span>
                  <span>Updated: {new Date(caseItem.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {assignedCases.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No cases assigned
              </div>
            )}
          </div>
        </div>

        {/* Pending Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Alerts</h3>
          <div className="space-y-3">
            {pendingAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">{alert.title}</div>
                  <StatusBadge status={alert.status} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{alert.message}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(alert.createdDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pendingAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Evidence Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Evidence ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Case</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentSubmissions.map((evidence) => (
                <tr key={evidence.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{evidence.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{evidence.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{evidence.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{evidence.caseId}</td>
                  <td className="px-4 py-3"><StatusBadge status={evidence.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(evidence.submittedDate).toLocaleDateString()}
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
