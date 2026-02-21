import React from 'react';
import { Users as UsersIcon, Folder, BarChart3, AlertCircle } from 'lucide-react';
import { mockCases, mockEvidence, mockSystemUsers } from '../../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function EvidenceManagerDashboard() {
  const stats = [
    {
      label: 'Total Cases',
      value: mockCases.length,
      icon: <Folder className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Evidence',
      value: mockEvidence.length,
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Active Users',
      value: mockSystemUsers.filter(u => u.status === 'active').length,
      icon: <UsersIcon className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      label: 'Eligible for Disposal',
      value: 0,
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      bgColor: 'bg-orange-50'
    }
  ];

  const caseStatusData = [
    { name: 'Open', value: mockCases.filter(c => c.status === 'open').length, color: '#3B82F6' },
    { name: 'Closed', value: mockCases.filter(c => c.status === 'closed').length, color: '#6B7280' }
  ];

  const evidenceTypeData = [
    { type: 'Physical', count: 2 },
    { type: 'Video', count: 1 },
    { type: 'Digital', count: 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Evidence Manager Dashboard</h2>
        <p className="text-gray-600 mt-1">System overview and analytics</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={caseStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {caseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={evidenceTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
